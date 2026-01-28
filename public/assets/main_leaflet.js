if (document.getElementById('map')) {
	var project_nonLabord = [];
	let partielTab = [];
	const state = {
		drawing: false,
		selection: false,
		modifying: false
	};

	proj4.defs("EPSG:29702",
		"+proj=omerc +lat_0=-18.9 +lonc=44.10000000000001 +alpha=18.9 " +
		"+k=0.9995000000000001 +x_0=400000 +y_0=800000 +gamma=18.9 +ellps=intl " +
		"+towgs84=-189,-242,-91,0,0,0,0 +pm=paris +units=m +no_defs"
	);
	ol.proj.proj4.register(proj4);

	// Définir la projection dans OpenLayers
	const crs = new ol.proj.Projection({
		code: 'EPSG:29702',
		extent: [0, 0, 1000000, 1000000], // Ajuste selon les besoins
		units: 'm'
	});

	var scaleControl = new ol.control.ScaleLine({ units: 'metric', bar: true, steps: 1, text: true, minWidth: 140, });

	const layersConfig = {
		"E-topo:titre_fianara": {
			couleur: "#ff0000",
			remplissage: "#ff0000",
			largeur: 2
		},
		"E-topo:fn_fianara": {
			couleur: "#eef207",
			remplissage: "#eef207",
			largeur: 3
		},
		"E-topo:titre": {
			couleur: "#ff0000",
			remplissage: "#ff0000",
			largeur: 2
		},
		"E-topo:demande": {
			couleur: "#eef207",
			remplissage: "#eef207",
			largeur: 3
		},
		"E-topo:cadastre": {
			couleur: "#800080",
			remplissage: "#800080",
			largeur: 3
		}
	};

	// URL du serveur GeoServer
	var url_ = 'http://localhost:8080/geoserver/E-topo/wms';
	// Fonction pour créer une couche WMS
	function createWMSLayero(layerNameo, style = '', filter = '') {
		return new ol.layer.Tile({
			source: new ol.source.TileWMS({
				url: url_,
				params: {
					'LAYERS': layerNameo,
					'FORMAT': 'image/png',
					'TRANSPARENT': true,
					'VERSION': '1.1.0',
					'STYLES': style,
					'CQL_FILTER': filter
				},
				serverType: 'geoserver',
				crossOrigin: 'anonymous',
				transition: 0
			})
		});
	}

	// Fonction pour créer une couche WMS
	function createWMSLayer(layerName) {
		const layerStyle = layersConfig[layerName];  // Récupérer les styles dynamiques pour la couche
		// Créer la couche WMS
		const wmsLayer = new ol.layer.Tile({
			source: new ol.source.TileWMS({
				url: url_,  // URL du serveur GeoServer
				params: {
					LAYERS: layerName,
					'TRANSPARENT': true,
					env: `couleur:${layerStyle.couleur};remplissage:${layerStyle.remplissage};largeur:${layerStyle.largeur}`  // Paramètres dynamiques
				},
				ratio: 1,
				serverType: 'geoserver',
				crossOrigin: 'anonymous'
			}),
			name: layerName  // Ajouter un nom à la couche pour la gestion
		});
		return wmsLayer;  // Retourner la couche créée
	}

	// Définition des couches WMS
	var Ortho = createWMSLayero('E-topo:Fianarantsoa');

	var fokontany = createWMSLayero('E-topo:fokontany');
	//var region = createWMSLayero('E-topo:region');
	//var district = createWMSLayero('E-topo:district');
	var commune = createWMSLayero('E-topo:commune');
	var reperage_prealable = createWMSLayero('E-topo:reperage', 'style_reperage_prealable', "type_reperage = '1'");
	var reperage_second = createWMSLayero('E-topo:reperage', 'style_reperage_second', "type_reperage = '2'");

	// Ajouter chaque couche WMS avec son style dynamique
	var titre_Fianara = createWMSLayer("E-topo:titre_fianara");
	var titre = createWMSLayer("E-topo:titre");
	var FN_Fianara = createWMSLayer("E-topo:fn_fianara");
	var demande = createWMSLayer("E-topo:demande");
	var cadastre = createWMSLayer('E-topo:cadastre');

	var carouillage = new ol.layer.Graticule({
		showLabels: true,
		strokeStyle: new ol.style.Stroke({
			color: 'white',
			width: 1

		}),
		lonLabelFormatter: function (lon) {
			var center = ol.proj.toLonLat(map.getView().getCenter());
			var coord = ol.proj.transform([lon, center[1]], 'EPSG:4326', 'EPSG:29702');
			return Math.round(coord[0]);
		},
		latLabelFormatter: function (lat) {
			var center = ol.proj.toLonLat(map.getView().getCenter());
			var coord = ol.proj.transform([center[0], lat], 'EPSG:4326', 'EPSG:29702');
			return Math.round(coord[1]);
		},
		latLabelStyle: new ol.style.Text({
			rotation: Math.PI / 2,
			fill: new ol.style.Fill({ color: 'black' }),
			stroke: new ol.style.Stroke({ color: 'white', width: 2 })
		}),
		latLabelPosition: 0.992
	});

	// Création de la carte OpenLayers
	var map = new ol.Map({
		controls: [scaleControl,], // Utilisation correcte de defaults()
		target: 'map', // Assurez-vous que l'élément HTML existe
		layers: [
			new ol.layer.Tile({
				source: new ol.source.OSM({
					crossOrigin: 'anonymous' // ← ajoute cette ligne ici
				})
			})
		],
		view: new ol.View({
			// center: ol.proj.fromLonLat([47.472930, -18.921720]), // Convertir en EPSG:3857
			center: ol.proj.fromLonLat([46.38451, -25.040571]), // Convertir en EPSG:3857
			zoom: 18,
		}),
		layers: [Ortho, titre_Fianara, titre, FN_Fianara, demande, cadastre, fokontany, commune, reperage_prealable, reperage_second, carouillage]
	});

	function refreshAllLayers(map) {
		function refreshLayer(layer) {
			if (layer instanceof ol.layer.Group) {
				layer.getLayer().forEach(refreshLayer);
			} else {
				const source = layer.getSource()
				if (!source) return

				if (source instanceof ol.source.Vector) {
					source.clear();
					source.refresh();
				}

				else if (source instanceof ol.source.TileWMS || source instanceof ol.source.ImageWMS) {
					source.updateParams({ 't': Date.now() })
				}
			}
		}
		map.getLayers().forEach(refreshLayer);
	}

	// Fonction pour gérer l'affichage des couches WMS
	function toggleLayer(layer, checkboxId) {
		var checkbox = document.getElementById(checkboxId);
		if (checkbox.checked) {
			map.addLayer(layer);
		} else {
			map.removeLayer(layer);
		}
	}

	// Déclare une seule fois la couche et la source en dehors de la fonction
	let reperageSource = new ol.source.Vector();
	let reperageLayer = new ol.layer.Vector({
		source: reperageSource,
		style: new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'black',
				width: 1.5
			}),
			fill: new ol.style.Fill({
				color: 'rgba(0, 0, 0, 0.7)'
			})
		})
	});

	// Ajouter la couche une seule fois
	map.addLayer(reperageLayer);

	function projectArrayXY(latlngs) {
		return latlngs.map(coord => ol.proj.transform(coord, 'EPSG:4326', 'EPSG:29702'));
	}

	function unprojectXY(xy) {
		return ol.proj.transform(xy, 'EPSG:29702', 'EPSG:4326');
	}

	function unprojectArrayXY(xyArray) {
		return xyArray.map(xy => unprojectXY(xy));
	}

	map.on('pointermove', function (event) {
		var coord = ol.proj.toLonLat(event.coordinate);

		// Conversion en projection EPSG:29702 (Laborde)
		var projected = ol.proj.transform(coord, 'EPSG:4326', 'EPSG:29702');

		document.getElementById('X').innerText = projected[0].toFixed(5);
		document.getElementById('Y').innerText = projected[1].toFixed(5);
	});

	// Créer la source et la couche vectorielle pour les marqueurs
	var markerSource = new ol.source.Vector();
	var markerLayer = new ol.layer.Vector({
		source: markerSource
	});

	// Définir un style pour les marqueurs (cercle bleu non transparent)
	var markerStyle = new ol.style.Style({
		image: new ol.style.Circle({
			radius: 5, // Rayon du cercle (taille du marqueur)
			fill: new ol.style.Fill({
				color: 'green' // Couleur du fond (bleu)
			}),
			stroke: new ol.style.Stroke({
				color: 'white', // Couleur du contour du cercle (optionnel)
				width: 1.5 // Largeur du contour (optionnel)
			})
		})
	});

	// Ajouter la couche vectorielle à la carte
	map.addLayer(markerLayer); // Cette ligne fonctionne si 'map' est bien une carte OpenLayers

	//Fonction de recherche avec conversion des coordonnées
	function recherche() {
		// Récupérer et convertir les coordonnées depuis les champs X et Y
		var xy = [
			[parseFloat($("#x").val()), parseFloat($("#y").val())]
		];

		// Mettre à jour les valeurs affichées dans le DOM
		document.getElementById('X').innerText = parseFloat($("#x").val());
		document.getElementById('Y').innerText = parseFloat($("#y").val());

		// Convertir les coordonnées en EPSG:29702 à EPSG:4326 (longitude, latitude)
		var ret = unprojectArrayXY(xy);  // Assurez-vous que unprojectArrayXY fonctionne correctement

		// Effacer tous les marqueurs existants
		markerSource.clear();

		// Créer un nouveau point avec les coordonnées converties
		var newMarker = new ol.Feature({
			geometry: new ol.geom.Point(ol.proj.fromLonLat(ret[0]))
		});

		// Appliquer le style au marqueur
		newMarker.setStyle(markerStyle);

		// Ajouter le point à la source vectorielle pour qu'il s'affiche sur la carte
		markerSource.addFeature(newMarker);

		// Centrer la carte sur le nouveau marqueur
		map.getView().setCenter(ol.proj.fromLonLat(ret[0]));
		map.getView().setZoom(18);
	}
	$("#form_reperage").submit(function (event) {
		event.preventDefault(); // Bloque la soumission par défaut
		recherche();
	});

	//div mapiseo ny info du partielle
	function generateInfoBox(keys, properties) {
		let keys_restricted = ['id', 'obs', 'echelle', 'id_titre', , 'id_demande', 'id_geometre_historique', 'id_geometre',
			'feuille', 'partie',
			'iddossier', 'type_partielle',
			'type_empietement', 'type_reperage'];

		let tableau1Filtré = keys.filter(élément =>
			!keys_restricted.map(élément => élément.toLowerCase()).includes(élément.toLowerCase())
		);
		let checkboxesHtml = "";
		for (let i = 0; i < tableau1Filtré.length; i++) {
			checkboxesHtml += `
			<strong>${tableau1Filtré[i]}:</strong> ${properties[tableau1Filtré[i]]}<hr>	
		`;
		}

		let content = `
			<div class="row align-items-baseline">
				<div class="col-10">
					<h5>
						INFORMATION
					</h5>
				</div>
				<div class="col-2">
					<button type="button" class="btn-close" aria-label="Close" onclick="closeInfoBox(event)"></button>
				</div>
			</div>
			<hr>
			${checkboxesHtml}
			<button class="btn btn-primary btn-sm w-100 mt-auto" data-bs-toggle="modal"
				data-bs-target="#visualisationModal">
				Visualiser les fichiers
			</button>
		`;
		const num = properties["TITRE_REQ"];
		const title_modal_file_view = document.getElementById("title_modal_file_view");
		title_modal_file_view.textContent = num;
		let lien = base_url + "get_files_archive";
		let extension = '';
		$.ajax({
			url: lien,
			type: 'POST',
			data: { num: num },
			dataType: 'json',
			success: function (response) {
				let list_files_archive = $('#list_files_archive');
				list_files_archive.empty();
				let html_administratif = '';
				let content = '';
				if (typeof response.data['administratif'] !== 'undefined') {
					response.data['administratif']['file'].forEach(file => {
						let parts = file.split(".");
						console.log();
						let extension = parts.length > 1 ? parts.pop().toLowerCase() : "";
						let file_name = parts[0];

						let type = extension;
						if (["jpg", "jpeg", "png"].includes(extension)) {
							type = "image";
						} else if (extension === "pdf") {
							type = "pdf";
						}
						html_administratif += `
						<li>
							${file_name}
							<i class="fas fa-eye btn btn-sm btn-outline-primary view-file"
								data-file="${response.data['administratif']['path']}/${file_name}"
								data-type="${type}">
							</i>
						</li>
					`;
					});
					content += `
						<li>
							<span class = "caret"><i class="mdi mdi-folder text-warning"></i>Administratif</span>
							<ul class="nested">
								${html_administratif}
							</ul>
						</li>
					`;
				}
				let html_plan = '';
				if (typeof response.data['plan'] !== 'undefined') {
					response.data['plan']['file'].forEach(file => {
						let parts = file.split(".");
						let extension = parts.length > 1 ? parts.pop().toLowerCase() : "";
						let file_name = parts[0];

						let type = extension;
						if (["jpg", "jpeg", "png"].includes(extension)) {
							type = "image";
						} else if (extension === "pdf") {
							type = "pdf";
						}

						html_plan += `
						<li>
							${file_name}
							<i class="fas fa-eye btn btn-sm btn-outline-primary view-file"
								data-file="${response.data['plan']['path']}/${file}"
								data-type="${type}">
							</i>
						</li>
					`;
					});
					content += `
						<li>
							<span class = "caret"><i class="mdi mdi-folder text-warning"></i>Plan</span>
							<ul class="nested">
								${html_plan}
							</ul>
						</li>
					`;
				}

				list_files_archive.append(content);
				var toggler = document.getElementsByClassName("caret");
				for (var i = 0; i < toggler.length; i++) {
					toggler[i].addEventListener("click", function () {
						this.parentElement.querySelector(".nested").classList.toggle("active");
						this.classList.toggle("caret-down");
						var icon = this.querySelector('i');

						if (this.parentElement.querySelector(".nested").classList.contains("active")) {
							icon.classList.remove('mdi-folder');
							icon.classList.add('mdi-folder-open');
						} else {
							icon.classList.remove('mdi-folder-open');
							icon.classList.add('mdi-folder');
						}
					});
				}
				const filePreview = document.getElementById("filePreview");
				filePreview.innerHTML = "";
				document.querySelectorAll(".view-file").forEach((button) => {
					button.addEventListener("click", function () {
						const filePath = this.getAttribute("data-file");
						const fileType = this.getAttribute("data-type");
						filePreview.innerHTML = '<p class="text-muted">Chargement du fichier...</p>';

						if (fileType === "pdf") {
							filePreview.innerHTML = `
								<embed src="${filePath}" type="application/pdf" width="100%" height="100%">
							`;
						} else if (fileType === "image") {
							filePreview.innerHTML = `
								<img src="${filePath}" alt="Aperçu de l'image" style="width: 100%; height: auto;">
							`;
						} else if (fileType === "docx") {
							filePreview.innerHTML = `
								<p class="text-muted">Les fichiers DOCX ne peuvent pas être affichés directement. <a href="${filePath}" target="_blank">Télécharger</a>.</p>
							`;
						} else {
							filePreview.innerHTML = `
								<p class="text-muted">Type de fichier non supporté pour la visualisation.</p>
							`;
						}
					});
				});
			},
		});
		$('#infoBox').html(content);
	}

	map.on('singleclick', function (e) {
		if (!state.drawing) {
			const layerObj = [
				"E-topo:titre_fianara",
				"E-topo:reperage",
				"E-topo:fn_fianara",
				"E-topo:demande",
				"E-topo:titre",
				"E-topo:cadastre",
			];

			const urlLayers = layerObj.join();

			const extent3857 = map.getView().calculateExtent(map.getSize()); // projection afa mintsy oany open layer
			const extent4326 = ol.proj.transformExtent(extent3857, 'EPSG:3857', 'EPSG:4326');
			// Maintenant c'est bien en [minLon, minLat, maxLon, maxLat]
			const BBOX = `${extent4326[0]},${extent4326[1]},${extent4326[2]},${extent4326[3]}`;
			const WIDTH = map.getSize()[0];
			const HEIGHT = map.getSize()[1];
			const X = Math.round(e.pixel[0]);
			const Y = Math.round(e.pixel[1]);

			// Construire l'URL de la requête WMS GetFeatureInfo
			const URL = `http://localhost:8080/geoserver/E-topo/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&
			LAYERS=${urlLayers}&QUERY_LAYERS=${urlLayers}&STYLES=&BBOX=${BBOX}&FEATURE_COUNT=5&HEIGHT=${HEIGHT}&WIDTH=${WIDTH}&
			FORMAT=image%2Fpng&INFO_FORMAT=application%2Fjson&SRS=EPSG:4326&X=${X}&Y=${Y}`;

			// Effectuer une requête AJAX pour obtenir les données WMS
			$.ajax({
				url: URL,
				dataType: 'json',
				success: function (data) {
					if (data.features && data.features.length > 0) {
						const info = data.features[0];
						const keys = Object.keys(info.properties);
						generateInfoBox(keys, info.properties);
						document.getElementById('infoBox').style.display = 'block';
					}
				},
				error: function () {
					$('#infoBox').html("Erreur de chargement des informations.");
				}
			});
		}
	});

	// tracage
	var currentLineWidth = 1.5;

	// Source et couche pour les polygones
	var sourcePolygons = new ol.source.Vector({ wrapX: false });
	var layerPolygons = new ol.layer.Vector({
		source: sourcePolygons,
		style: function (feature) {
			return new ol.style.Style({
				stroke: new ol.style.Stroke({ color: 'blue', width: currentLineWidth }),
				fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.1)' })
			});
		}
	});
	map.addLayer(layerPolygons);

	// Source et couche pour les sommets (points d'accrochage) - Non visible
	var sourceVertices = new ol.source.Vector({ wrapX: false });
	var layerVertices = new ol.layer.Vector({
		source: sourceVertices,
		style: new ol.style.Style({
			image: new ol.style.Circle({
				radius: 5,
				fill: new ol.style.Fill({ color: 'red' }),
				stroke: new ol.style.Stroke({ color: 'black', width: 1 })
			})
		})
	});

	// Interaction pour dessiner un polygone
	var draw = new ol.interaction.Draw({
		source: sourcePolygons,
		type: 'Polygon'
	});

	// Interaction d'accrochage (Snap) pour aligner les sommets
	var snap = new ol.interaction.Snap({ source: sourceVertices });

	// Interaction de sélection
	var select = new ol.interaction.Select({
		layers: [layerPolygons], // Sélectionner uniquement les polygones
		hitTolerance: 5 // Tolérance au clic (en pixels)
	});

	// Interaction de modification des sommets
	var modify = new ol.interaction.Modify({
		source: sourcePolygons
	});

	document.addEventListener("DOMContentLoaded", function () {
		const buttons = document.querySelectorAll(".btn-custom-rep");

		buttons.forEach(button => {
			button.addEventListener("click", function () {
				if (this.classList.contains("btn-active")) {
					this.classList.remove("btn-active");
				} else {
					document.querySelector(".btn-active")?.classList.remove("btn-active");
					this.classList.add("btn-active");
				}
			});
		});

		function deactivateAllInteractions() {
			map.removeInteraction(draw);
			map.removeInteraction(snap);
			map.removeInteraction(select);
			map.removeInteraction(modify);
			document.body.style.cursor = "default";
			state.drawing = false;
			state.selection = false;
			state.modifying = false;
			document.querySelector(".btn-active")?.classList.remove("btn-active");
		}

		document.getElementById('drawButton')?.addEventListener('click', function () {
			if (state.drawing) {
				deactivateAllInteractions();
			} else {
				deactivateAllInteractions();
				map.addInteraction(draw);
				map.addInteraction(snap);
				document.body.style.cursor = "crosshair";
				state.drawing = true;
				this.classList.add("btn-active");
			}
		});

		document.getElementById('selectButton')?.addEventListener('click', function () {
			if (state.selection) {
				deactivateAllInteractions();
			} else {
				deactivateAllInteractions();
				map.addInteraction(select);
				state.selection = true;
				this.classList.add("btn-active");
			}
		});

		function detect_polygone_sup(polygon_supp) {
			return Promise.all(partielTab).then(results => {
				let indice_sup = -1;

				for (let h = 0; h < results.length; h++) {
					const polygon = results[h].polygon;

					if (polygon.length === polygon_supp.length) {
						let isSame = polygon.every((point, index) =>
							point.lat === polygon_supp[index].lat && point.lon === polygon_supp[index].lon
						);

						if (isSame) {
							indice_sup = h;
						}
					}
				}

				if (indice_sup > -1) {
					results.splice(indice_sup, 1); // Supprime l'élément dans la liste résolue
				}

				console.log("Tableau mis à jour :", results);
				return results; // Retourne le tableau mis à jour
			}).catch(error => {
				console.error("Erreur lors de la résolution des promesses :", error);
			});
		}

		document.getElementById('deleteButton')?.addEventListener('click', function () {
			var selectedFeatures = select.getFeatures();

			if (selectedFeatures.getLength() > 0) {
				var selectedFeature = selectedFeatures.item(0);
				var selectedGeometry = selectedFeature.getGeometry();
				var coordinates = selectedGeometry.getCoordinates()[0];

				// Transformer les coordonnées au format lat/lon
				var polygon_supp = coordinates.map(coord => {
					var lonLat = ol.proj.toLonLat(coord);
					return { lat: lonLat[1], lon: lonLat[0] };
				});

				//console.log("Coordonnées :", polygon_supp);

				// Attendre la mise à jour de partielTab
				detect_polygone_sup(polygon_supp).then(updatedPartielTab => {
					partielTab = updatedPartielTab; // Met à jour la variable globale

					//console.log("Resultat :", partielTab);

					// Supprimer le polygone
					sourcePolygons.removeFeature(selectedFeature);
					selectedFeatures.clear();
				});
			} else {
				console.warn("Aucun polygone sélectionné.");
			}
		});

		document.getElementById('modifyButton')?.addEventListener('click', function () {
			if (state.modifying) {
				deactivateAllInteractions();
			} else {
				deactivateAllInteractions();
				map.addInteraction(modify);
				state.modifying = true;
				this.classList.add("btn-active");
			}
		});
	});


	// Capturer l'événement de fin de dessin
	draw.on('drawstart', function () {
		// Mettre à jour l'épaisseur de la ligne au moment du début du tracé
		draw.setActive(true); // Assurer que l'interaction est active pour le tracé
	});

	function prepare_reperage(polygonCoords) {
		// Créer l'objet Polygon en OpenLayers
		let polygon = new ol.geom.Polygon([polygonCoords]);

		// Créer une feature avec ce polygone
		let polygonFeature = new ol.Feature({
			geometry: polygon
		});

		// Ajouter la feature à la source existante
		sourcePolygons.addFeature(polygonFeature);

		visual_data(polygonFeature);
	}

	function visual_data(feature) {
		var coordinates = feature.getGeometry().getCoordinates()[0];
		// Transformer les coordonnées au format lat/lon
		var transformedCoords = coordinates.map(coord => {
			var lonLat = ol.proj.toLonLat(coord);
			return { lat: lonLat[1], lon: lonLat[0] };
		});

		// Ajouter les coordonnées au tableau global
		project_nonLabord.push(transformedCoords);

		let result = empietement(transformedCoords)

		if (result != null) {
			feature.set('info', result); // Stocker l'info dans la feature
			partielTab.push(result);
			// Ajouter les sommets à la couche d'accrochage (non affichés)
			transformedCoords.forEach(coord => {
				let vertexFeature = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([coord.lon, coord.lat])));
				sourceVertices.addFeature(vertexFeature);
			});
			//console.log(project_nonLabord);
		}

		if (result instanceof Promise) {
			result.then(info => {
				showPopupPersiste(info.message.message, info.etat, info.allFeatures)
			});
		}
	}

	// Gestionnaire d'événement pour le dessin du polygone
	draw.on('drawend', function (event) {
		var feature = event.feature;
		visual_data(feature);
	});

	map.on('click', function (evt) {
		map.forEachFeatureAtPixel(evt.pixel, function (feature) {
			let infoPromise = feature.get('info');

			if (infoPromise instanceof Promise) {
				infoPromise.then(info => {
					showPopupPersiste(info.message.message, info.etat, info.allFeatures)
					//console.log("✅ Info récupérée");
				});
			}
		});
	});

	function convertToLabordeProjection(coordArray) {
		return coordArray.map(polygon =>
			polygon.map(coord => {
				// Transformer les coordonnées WGS84 (EPSG:4326) -> Laborde (EPSG:29702)
				let transformed = ol.proj.transform([coord.lon, coord.lat], 'EPSG:4326', 'EPSG:29702');
				return { lat: transformed[1], lon: transformed[0] };
			})
		);
	}

	// Convertir un tableau de coordonnées en format WKT
	function convertToWKT(coordinates) {
		// Convertir les coordonnées de EPSG:4326 (WGS84) à EPSG:29702 (Laborde) avant de créer le WKT
		let transformedCoords = coordinates.map(coord => {
			// Convertir (lat, lon) de WGS84 (EPSG:4326) vers Laborde (EPSG:29702)
			let transformed = ol.proj.transform([coord.lon, coord.lat], 'EPSG:4326', 'EPSG:29702');
			return { lat: transformed[1], lon: transformed[0] };
		});

		// Créer le WKT à partir des coordonnées transformées
		let wkt = "POLYGON((" + transformedCoords.map(coord => `${coord.lon} ${coord.lat}`).join(", ") + "))";
		return wkt;
	}

	function convertLonLatToLatLon(coordonnees) {
		return coordonnees.map(coord => ({ lat: coord[1], lon: coord[0] }));
	}

	function switchCoordinates(polygon) {
		return polygon.map(coord => [coord[0], coord[1]]);
	}

	function switchCoordinatesWithLatLon(coords) {
		return coords.map(point => [point.lon, point.lat]); // Vérifie que lon et lat sont bien extraits
	}

	function calculatePolygonArea(coords) {
		// Assurez-vous que les coordonnées sont sous la forme [lng, lat]
		const vertices = coords.map(([lat, lng]) => [lng, lat]);
		const n = vertices.length;

		// Application de la formule de Shoelace
		let area = 0;
		for (let i = 0; i < n - 1; i++) {
			area += vertices[i][0] * vertices[i + 1][1];
			area -= vertices[i + 1][0] * vertices[i][1];
		}
		area += vertices[n - 1][0] * vertices[0][1];
		area -= vertices[0][0] * vertices[n - 1][1];

		// La surface est positive, donc prendre la valeur absolue et diviser par 2
		area = Math.round(Math.abs(area) / 2.0);

		return isNaN(area) ? 0 : area;
	}

	/**
	 * Vérifie si un polygone est totalement à l'intérieur d'un autre, sinon retourne leur intersection.
	 */
	function getIntersection(origin, poly) {
		return turf.booleanContains(origin, poly) ? poly : turf.intersect(origin, poly);
	}

	/**
	 * Extrait les coordonnées des polygones d'empiètement pour les ajouter à la liste d'affichage.
	 */
	function extractCoordinates(empiete, coordList) {
		if (empiete.geometry.type === "MultiPolygon") {
			empiete.geometry.coordinates.forEach(poly => poly.forEach(ring => coordList.push(ring)));
		} else if (empiete.geometry.type === "Polygon") {
			empiete.geometry.coordinates.forEach(ring => coordList.push(ring));
		}
	}

	/**
	 * Dessine tous les polygones d'empiètement en noir avec une opacité de 0.7.
	 */
	function drawAllEmpietements(coord_empiete) {
		coord_empiete.forEach(coords => drawPolygon(coords, 'Black', 0.7));
	}

	/**
	 * Assigne la surface des empiètements aux propriétés des polygones en effectuant la transformation de projection.
	 */
	function assignAreasToPolygons(polygon, list_empiete) {
		var projected, area_temp = 0, lab = [];
		for (let i = 0; i < list_empiete.length; i++) {
			for (let a = 0; a < list_empiete[i].length; a++) {
				for (let b = 0; b < list_empiete[i][a].length; b++) {
					if (list_empiete[i][a][b].length > 2) {
						for (let c = 0; c < list_empiete[i][a][b].length; c++) {
							projected = ol.proj.transform([list_empiete[i][a][b][c][0], list_empiete[i][a][b][c][1]], 'EPSG:4326', 'EPSG:29702');
							lab.push(projected)
						}
					} else {
						projected = ol.proj.transform([list_empiete[i][a][b][0], list_empiete[i][a][b][1]], 'EPSG:4326', 'EPSG:29702');
						lab.push(projected)
					}
				}
				area_temp += calculatePolygonArea(lab)
				lab = []
			}
			polygon[i].properties.area = area_temp;
			area_temp = 0
		}
	}

	function draw_polygone_empietement(projection_non_lab, polygon) {
		let intersect_origin, intersect_poly, empiete;
		let list_empiete = [], coord_empiete = [];

		for (let i = 0; i < polygon.length; i++) {
			const geom = polygon[i].geometry;
			let coordonne;

			if (geom.type === 'Polygon') {
				coordonne = geom.coordinates[0]; // Premier anneau
			} else if (geom.type === 'MultiPolygon') {
				coordonne = geom.coordinates[0][0]; // Premier polygone > premier anneau
			} else {
				console.warn('Type de géométrie non supporté :', geom.type);
				continue;
			}
			// Switch les coordonnées (GeoServer peut inverser lat/lon)
			coordonne = switchCoordinates(coordonne);
			// Préparation des polygones Turf
			const temp = switchCoordinatesWithLatLon(projection_non_lab);
			intersect_origin = turf.polygon([temp]);
			intersect_poly = turf.polygon([coordonne]);

			// Calcul de l'intersection
			empiete = getIntersection(intersect_origin, intersect_poly);

			if (empiete) {
				list_empiete.push(empiete.geometry.coordinates);
				extractCoordinates(empiete, coord_empiete);
			}
		}

		assignAreasToPolygons(polygon, list_empiete);
		drawAllEmpietements(coord_empiete);
	}


	function drawPolygon(coordonnees, color, opacity) {
		const transformedCoordinates = coordonnees.map(coord => ol.proj.fromLonLat(coord));

		// Créer un nouveau polygone
		let polygonFeature = new ol.Feature({
			geometry: new ol.geom.Polygon([transformedCoordinates])
		});

		// Appliquer un style spécifique si besoin
		polygonFeature.setStyle(new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: color,
				width: currentLineWidth
			}),
			fill: new ol.style.Fill({
				color: `rgba(0, 0, 0, ${opacity})`
			})
		}));

		// Ajouter la nouvelle feature à la source existante
		reperageSource.addFeature(polygonFeature);
	}

	function empietement_type(projection_non_lab, polygon) {
		var color = 'White', etat = { message: 'Pas d\'empietement', value: 1 }

		projection_non_lab = switchCoordinatesWithLatLon(projection_non_lab)
		intesect_origin = turf.polygon([projection_non_lab])

		if (polygon != null) {
			for (let i = 0; i < polygon.length; i++) {
				const geom = polygon[i].geometry;
				let coordonne;

				if (geom.type === 'Polygon') {
					coordonne = geom.coordinates[0]; // Premier anneau
				} else if (geom.type === 'MultiPolygon') {
					coordonne = geom.coordinates[0][0]; // Premier polygone > premier anneau
				} else {
					console.warn('Type de géométrie non supporté :', geom.type);
					continue;
				}

				intersect_poly = turf.polygon([coordonne])

				//origine est entierement contenue dans intersect_poly ou intersect_poly est entieremnt contenue dans origine
				if (turf.booleanWithin(intesect_origin, intersect_poly) || turf.booleanContains(intesect_origin, intersect_poly)) {
					color = 'Transparent'
					etat = { message: 'Empietement total', value: 2 }
					break;
				} else if (turf.booleanOverlap(intesect_origin, intersect_poly)) {
					etat = { message: 'Empietement partiel', value: 3 }
				}
			}
		}

		return etat;
	}

	// Vérifier l'empietement entre le polygone dessiné et les couches WMS
	async function empietement(projection_non_lab) {
		let wktPolygon = convertToWKT(projection_non_lab);
		let rootUrl = 'http://localhost:8080/geoserver/E-topo/ows';
		let filtre = `INTERSECTS(the_geom,${wktPolygon})`;

		let layers = Object.keys(layersConfig).join(',');

		// Construire l'URL avec toutes les couches
		let url = new URL(rootUrl);
		url.search = new URLSearchParams({
			service: 'WFS',
			version: '1.0.0',
			request: 'GetFeature',
			typeName: layers, // Lister toutes les couches
			CQL_FILTER: filtre,
			outputFormat: 'application/json',
			srsName: 'EPSG:4326'
		});

		try {
			let response = await fetch(url);
			if (!response.ok) {
				console.error("Erreur lors de la requête WFS.");
				return;
			}

			let etat = 0;
			let allFeatures = [];
			let data = await response.json();

			// Vérifier si des features sont présentes
			if (data.features && data.features.length > 0) {
				draw_polygone_empietement(projection_non_lab, data.features);
				etat = 1;
				allFeatures = allFeatures.concat(data.features);
			}

			// Analyser le type d'empietement
			let message = empietement_type(projection_non_lab, allFeatures);

			return {
				'polygon': projection_non_lab,
				'message': message,
				'etat': etat,
				'allFeatures': allFeatures
			};
		} catch (error) {
			console.error("Erreur lors de la requête d'empietement :", error);
		}
	}


	function mention_reperage_initializer() {
		let html = '';
		// Résoudre toutes les promesses avec Promise.all()
		Promise.all(partielTab).then(resolvedPartielTab => {
			// console.log(resolvedPartielTab);
			// Maintenant resolvedPartielTab contient des objets, pas des Promesses
			resolvedPartielTab.forEach((result, index) => {
				html += construct_td(index + 1, result.message.message, result.message.value);
			});

			$("#attQryTableEmp").html(html);
		});
	}

	function construct_td(numero, empietement, value) {
		return `
		<tr>
			<td>${numero} <input type="hidden" name="partiel[]" value = "${numero}"> </td>
			<td>${empietement} <input type="hidden" name="empt[]" value = "${value}"></td>
		</tr>`
	}

	$("#formIdReperage").submit(function (event) {
		event.preventDefault(); // Empêcher le rechargement de la page

		let tempCoord = convertToLabordeProjection(project_nonLabord);
		let formData = $(this).serializeArray(); // Récupérer les données du formulaire sous forme de tableau d'objets

		// Ajouter les coordonnées transformées sous forme JSON
		formData.push({ name: "coord", value: JSON.stringify(tempCoord) });

		var lien = base_url + "validate_reperage";

		$.ajax({
			url: lien,
			type: "POST",
			data: $.param(formData), // Convertir en format x-www-form-urlencoded
			success: function (result) {
				result = JSON.parse(result);
				if (result.status === 'success') {
					console.log(result);
					showPopup(result.message, 'success');
					HideModalReperage();
				} else {
					showPopup('Error: ' + result.message, 'error');
				}
			},
			error: function (xhr, status, error) {
				showPopup('Error:' + status + " " + error, 'error');
			}
		});
	});

	function HideModalReperage() {
		var myModalEl = document.getElementById('mention-reperage');
		var modal = bootstrap.Modal.getInstance(myModalEl);
		modal.hide();
	}

	const reperage_check = document.getElementById('reperage-check-input');
	if (reperage_check) {
		reperage_check.addEventListener('change', function () {
			toggleLayer(layerPolygons, 'reperage-check-input');
			toggleLayer(reperage_prealable, 'reperage-check-input');
			toggleLayer(reperage_second, 'reperage-check-input');
			toggleLayer(reperageLayer, 'reperage-check-input');
		});
	}

	const titre_check = document.getElementById('titre-check-input');
	if (titre_check) {
		titre_check.addEventListener('change', function () {
			toggleLayer(titre_Fianara, 'titre-check-input');
			toggleLayer(titre, 'titre-check-input');
		});
	}

	const cadastre_check = document.getElementById('cadastre-check-input')
	if (cadastre_check) {
		cadastre_check.addEventListener('change', function () {
			toggleLayer(cadastre, 'cadastre-check-input');
		});
	}

	const demande_check = document.getElementById('demande-check-input');
	if (demande_check) {
		demande_check.addEventListener('change', function () {
			toggleLayer(FN_Fianara, 'demande-check-input');
			toggleLayer(demande, 'demande-check-input');
		});
	}

	const fokontany_check = document.getElementById('fokontany-check-input')
	if (fokontany_check) {
		fokontany_check.addEventListener('change', function () {
			toggleLayer(fokontany, 'fokontany-check-input');
		});
	}

	const commune_check = document.getElementById('commune-check-input')
	if (commune_check) {
		commune_check.addEventListener('change', function () {
			toggleLayer(commune, 'commune-check-input');
		});
	}

	// Fonction pour récupérer la valeur de l'élément en fonction de son id
	function getValue(id) {
		const element = document.getElementById(id);
		return element ? element.value : null;
	}

	// Mettre à jour les styles en fonction du cube sélectionné
	function updateStyle() {
		// Récupérer les valeurs pour chaque couche
		const color = getValue("colorPickertitre");
		const fill = getValue("fillColortitre");
		const width = getValue("widthSlidertitre");
		const opacity = getValue("opacitetitre");  // Récupère la valeur de l'opacité
		console.log("Valeurs récupérées :", { color, fill, width, opacity });

		// Tableau des styles mis à jour en fonction du cube sélectionné
		const updatedStyles = {};

		// Vérifier quel cube est sélectionné et mettre à jour les styles de la couche correspondante
		if (selectedCube === cubetitre) {
			updatedStyles["E-topo:titre_fianara"] = { couleur: color, remplissage: fill, largeur: width, opacite: opacity };
			updatedStyles["E-topo:titre"] = { couleur: color, remplissage: fill, largeur: width, opacite: opacity };
		} else if (selectedCube === cubefn) {
			updatedStyles["E-topo:fn_fianara"] = { couleur: color, remplissage: fill, largeur: width, opacite: opacity };
			updatedStyles["E-topo:demande"] = { couleur: color, remplissage: fill, largeur: width, opacite: opacity };
		} else if (selectedCube === cubecd) {
			updatedStyles["E-topo:cadastre"] = { couleur: color, remplissage: fill, largeur: width, opacite: opacity };
		}

		// Mettre à jour les paramètres de chaque couche en fonction du nom
		map.getLayers().forEach((layer) => {
			if (layer instanceof ol.layer.Tile) {  // Vérifier le type de la couche (TileWMS)
				const wmsSource = layer.getSource();
				if (wmsSource instanceof ol.source.TileWMS) {
					const layerName = layer.get("name"); // Récupérer le nom de la couche

					if (updatedStyles[layerName]) {
						// Mettre à jour les paramètres dynamiques pour chaque couche
						const { couleur, remplissage, largeur, opacite } = updatedStyles[layerName];
						wmsSource.updateParams({
							env: `couleur:${couleur};remplissage:${remplissage};largeur:${largeur};opacite:${opacite}`
						});

						// Réinitialiser la couche (forcera la mise à jour)
						map.removeLayer(layer);
						const newLayer = createWMSLayer(layerName);  // Assurez-vous que createWMSLayer fonctionne correctement
						map.addLayer(newLayer);
					}
				}
			}
		});
	}

	// Ajouter des événements pour mettre à jour les styles dynamiques pour chaque couche
	["colorPickertitre", "fillColortitre", "widthSlidertitre", "opacitetitre"].forEach(id => {
		const element = document.getElementById(id);
		if (element) {
			element.addEventListener("input", updateStyle);
		}
	});

	// Rendre la fonction accessible depuis le fichier PHP
	window.updateStyle = updateStyle;

	let selectedCube = null;  // Variable pour suivre quel cube a été sélectionné

	// Sélection des éléments
	const modal = document.getElementById("proprietesModal");
	const cubetitre = document.getElementById("cubetitre");
	const cubefn = document.getElementById("cubefn");
	const cubecd = document.getElementById("cubecd");
	const closeModal = document.querySelector("#close");
	const okButton = document.querySelector("#ok-btn");

	const fillColorInput = document.getElementById("fillColortitre");
	const strokeColorInput = document.getElementById("colorPickertitre");
	const borderWidthInput = document.getElementById("widthSlidertitre");
	const opacityInput = document.getElementById("opacitetitre");

	if (closeModal) {
		closeModal.addEventListener("click", () => { modal.style.display = "none"; });
	}

	function openModalForCube(cube) {
		modal.style.display = "block";
		fillColorInput.value = rgbToHex(cube.style.backgroundColor);
		strokeColorInput.value = rgbToHex(cube.style.borderColor);
		borderWidthInput.value = parseInt(cube.style.borderWidth) || 1;
		opacityInput.value = cube.style.opacity || 1;  // Récupère l'opacité du cube
	}

	// Ouvrir le modal au clic sur cubetitre
	if (cubetitre) {
		cubetitre.addEventListener("click", function () {
			selectedCube = cubetitre;
			openModalForCube(cubetitre);
		});
	}

	if (cubefn) {
		// Ouvrir le modal au clic sur cubefn
		cubefn.addEventListener("click", function () {
			selectedCube = cubefn;
			openModalForCube(cubefn);
		});
	}

	if (cubecd) {
		// Ouvrir le modal au clic sur cubecd
		cubecd.addEventListener("click", function () {
			selectedCube = cubecd;
			openModalForCube(cubecd);
		});
	}

	// Fonction pour convertir RGB en Hex
	function rgbToHex(rgb) {
		if (!rgb) return "#ff0000";
		const result = rgb.match(/\d+/g);
		return result
			? "#" +
			((1 << 24) + (parseInt(result[0]) << 16) + (parseInt(result[1]) << 8) + parseInt(result[2]))
				.toString(16)
				.slice(1)
			: "#ff0000";
	}

	if (okButton) {
		// Bouton OK : Mettre à jour la couleur, l'épaisseur, et l'opacité du cube + couche WMS
		okButton.addEventListener("click", function () {
			const color = strokeColorInput.value;
			const width = borderWidthInput.value;
			const fill = fillColorInput.value;
			const opacity = opacityInput.value;  // Récupère la valeur d'opacité

			// Vérifier si les valeurs existent
			if (!color || !width || !fill || !opacity) {
				console.error("Valeurs de couleur, largeur ou opacité invalides.");
				return;
			}

			// 🔴 Changer la couleur, l'opacité et la bordure du cube
			selectedCube.style.backgroundColor = fill;
			selectedCube.style.borderColor = color;
			selectedCube.style.border = `${width}px solid ${color}`;


			// 🌍 Mettre à jour la couche WMS avec les nouvelles valeurs
			map.getLayers().forEach((layer) => {
				if (layer instanceof ol.layer.Tile) {  // Vérifier le type correct de la couche
					const wmsSource = layer.getSource();
					if (wmsSource instanceof ol.source.TileWMS) {  // Vérifier la source correcte
						const layerName = layer.get("name");
						console.log(`Mise à jour du style pour ${layerName}: couleur=${color}, remplissage=${fill}, largeur=${width}, opacité=${opacity}`);

						if (selectedCube === cubetitre && (layerName === "E-topo:titre_fianara" || layerName === "E-topo:titre")) {
							wmsSource.updateParams({
								env: `couleur:${color};remplissage:${fill};largeur:${width};opacite:${opacity}`
							});
						}
						else if (selectedCube === cubefn && (layerName === "E-topo:fn_fianara" || layerName === "E-topo:demande")) {
							wmsSource.updateParams({
								env: `couleur:${color};remplissage:${fill};largeur:${width};opacite:${opacity}`
							});
						}
						else if (selectedCube === cubecd && layerName === "E-topo:cadastre") {
							wmsSource.updateParams({
								env: `couleur:${color};remplissage:${fill};largeur:${width};opacite:${opacity}`
							});
						}
					}
					wmsSource.refresh();  // Rafraîchir la source de la couche
				}
			});

			// ✅ Fermer le modal
			modal.style.display = "none";
		});
	}

	// Liste des options
	const options = ["1:100", "1:200", "1:500", "1:1000", "1:1500", "1:2000", "1:2500", "1:5000"];

	const input = document.getElementById("dropdownInput");
	const menu = document.getElementById("dropdownMenu");

	// Fonction pour afficher les options
	function updateDropdown(filter = "") {
		menu.innerHTML = ""; // Réinitialise la liste
		const filteredOptions = options.filter(option => option.toLowerCase().includes(filter.toLowerCase()));

		if (filteredOptions.length > 0) {
			filteredOptions.forEach(option => {
				const li = document.createElement("li");
				li.innerHTML = `<a class="dropdown-item" href="#">${option}</a>`;
				li.addEventListener("click", function () {
					input.value = option; // Remplit l'input avec la valeur sélectionnée
					menu.classList.remove("show"); // Ferme le dropdown
					process_echelle();
					let scale = option
					var scale_html = document.getElementById("scale-info")
					if (scale_html) {
						scale_html.innerText = "Échelle : " + supprimerEspaces(scale); // Mettre à jour l'affichage
					}
				});
				menu.appendChild(li);
			});

			// Forcer l'affichage du dropdown
			menu.classList.add("show");
		} else {
			menu.classList.remove("show");
		}
	}

	// Affiche les options dès qu'on clique sur l'input
	if (input) {
		input.addEventListener("focus", function () {
			updateDropdown();
		});

		// Filtre les options pendant la saisie
		input.addEventListener("input", function () {
			updateDropdown(this.value);
		});
	}

	// Ferme le menu si l'utilisateur clique ailleurs
	document.addEventListener("click", function (event) {
		if (input) {
			if (!input.contains(event.target) && !menu.contains(event.target)) {
				menu.classList.remove("show");
			}
		}
	});

	// Empêcher la soumission du formulaire
	let formID_echelle = document.getElementById("formID-echelle")
	if (formID_echelle) {
		formID_echelle.addEventListener("submit", function (event) {
			event.preventDefault();
			process_echelle();
			let scale = $('#dropdownInput').val()
			var scale_html = document.getElementById("scale-info")
			if (scale_html) {
				scale_html.innerText = "Échelle : " + supprimerEspaces(scale); // Mettre à jour l'affichage
			}
		});
	}

	function process_echelle() {
		let echelle = document.getElementById("dropdownInput").value
		let valeur = echelle.split(':')[1]; // Divise la chaîne et prend la seconde partie
		let enKilometre = (parseFloat(valeur) / 1000)
		setScale(enKilometre);
	}

	function setScale(enKilometre) {
		const scaleResolution = enKilometre / ol.proj.getPointResolution(map.getView().getProjection(), 1 / 0.28, map.getView().getCenter());
		map.getView().setResolution(scaleResolution);
	};
}