document.addEventListener("DOMContentLoaded", function() {
    const select = document.querySelector("#type_couche_selected");
    const rechercheInside = document.getElementById("recherche_inside");

    if(select != null){
        select.addEventListener("change", function() {
            let newContent = "";
    
            switch (this.value) {
                case "0": // Titre
                    newContent = `
                        <div class="row mb-2">
                            <div class="col-4">Numero Titre</div>
                            <div class="col-8">
                                <input type="text" class="form-control" id="numero" name="numero">
                            </div>
                        </div>
                    `;
                    break;
                case "1": // Demande
                    newContent = `
                        <div class="row mb-2">
                            <div class="col-4">Numero FN</div>
                            <div class="col-8">
                                <input type="text" class="form-control" id="numero" name="numero">
                            </div>
                        </div>
                    `;
                    break;
                case "2": // Cadastre
                    newContent = `
                        <div class="row mb-2">
                            <div class="col-4">Parcelle</div>
                            <div class="col-8">
                                <input type="text" class="form-control" id="parcelle" name="parcelle">
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-4">Section</div>
                            <div class="col-8">
                                <input type="text" class="form-control" id="section" name="section">
                            </div>
                        </div>
                    `;
                    break;
                default:
                    newContent = `<p class="text-muted">Veuillez sélectionner un type de couche.</p>`;
            }
    
            rechercheInside.innerHTML = newContent;
        });
    }
});
// Mappage des couches et colonnes de filtre
const params = [
    ['E-topo:titre_fianara', 'E-topo:titre'],
    ['E-topo:fn_fianara', 'E-topo:demande'],
    ['E-topo:cadastre']
];

const columnMapping = {
    'E-topo:titre_fianara': {
        columns: {
            numero: 'TITRE_REQ' // Colonne pour le numéro
        },
        generateFilter: function(data) {
            if (data.numero) { // Vérifiez si le numéro est défini
                return `${this.columns.numero} ILIKE '${data.numero}%'`;
            }
            return ""; // Retourner une chaîne vide si le numéro n'est pas défini
        }
    },
    'E-topo:titre': {
        columns: {
            numero: 'numero' // Une autre colonne pour le numéro
        },
        generateFilter: function(data) {
            if (data.numero) {
                return `${this.columns.numero} ILIKE '${data.numero}%'`;
            }
            return "";
        }
    },
    'E-topo:fn_fianara': {
        columns: {
            numero: 'FN' // Colonne pour FN
        },
        generateFilter: function(data) {
            if (data.numero) {
                return `${this.columns.numero} ILIKE '${data.numero}%'`;
            }
            return "";
        }
    },
    'E-topo:cadastre': {
        columns: {
            parcelle: 'Parcelle', // Colonne pour Parcelle
            section: 'Section' // Colonne pour Section
        },
        generateFilter: function(data) {
            const filters = [];
            if (data.parcelle) {
                filters.push(`${this.columns.parcelle} ILIKE '${data.parcelle}%'`);
            }
            if (data.section) {
                filters.push(`${this.columns.section} ILIKE '${data.section}%'`);
            }
            return filters.join(" AND "); // Combiner avec AND
        }
    }
};

// Fonction pour générer le CQL_FILTER
function generateCQLFilter(layer_name, data) {
    return columnMapping[layer_name].generateFilter(data);
}

function buildMultiLayerFilter(layers, data) {
    return layers.map(layerName => {
        const config = columnMapping[layerName];
        return config ? config.generateFilter(data) : "";
    }).join(";");
}

// Fonction de recherche
function processSearch(data) {
    const select = document.querySelector("#type_couche_selected").value;
    // Récupérer les couches correspondantes
    let couche_search = params[select];

    if (!couche_search) {
        console.warn("⚠️ Aucune couche trouvée pour cette sélection.");
        return;
    }

    const joinedLayers = couche_search.join(',');
    const cqlFilter = buildMultiLayerFilter(couche_search, data);

    // Boucler sur les couches et les ajouter à la carte
    const layer = createWFSLayer(joinedLayers, cqlFilter, customStyle, data);
    map.addLayer(layer);
}

// Écouteur pour le formulaire de recherche
$("#form_numero_plof").submit(function(event) {
    event.preventDefault(); // Bloque la soumission par défaut
    searchInAllLayers();
});
// Écouteur pour le formulaire de recherche date
$("#form_date_plof").submit(function(event) {
    event.preventDefault(); // Bloque la soumission par défaut
    fitre_reperage_entre_2_date($('#date_deb_rep').val(), $('#date_fin_rep').val())
});

// Fonction de recherche dans toutes les couches
function searchInAllLayers() {
    let formData = {}; // Objet pour stocker les valeurs des inputs

    // Sélectionner tous les inputs présents dans le formulaire
    document.querySelectorAll("#form_numero_plof input").forEach(input => {
        formData[input.name] = input.value.trim(); // Ajouter la valeur avec le nom comme clé
    });

    // Vérifier si au moins un champ est rempli
    if (Object.values(formData).every(value => value === "")) {
        showPopup("Veuillez remplir au moins un champ pour la recherche.", "error");
        return;
    }

    // Ici, appeler la logique de recherche avec `formData`
    processSearch(formData);
}

// Fonction pour créer une couche WFS (GeoJSON)
function createWFSLayer(layerName, cqlFilter = '', customStyle = null, data) {
    let requestUrl = `${urlWFS}?service=WFS&version=1.0.0&request=GetFeature&typeName=${layerName}&outputFormat=application/json&srsName=EPSG:4326`;

    if (cqlFilter) {
        requestUrl += `&CQL_FILTER=${encodeURIComponent(cqlFilter)}`;
    }

    const vectorSource = new ol.source.Vector({
        url: requestUrl,
        format: new ol.format.GeoJSON({
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        })
    });

    // Créer la couche
    const vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: customStyle
    });

    // Attendre que les données soient chargées pour effectuer le zoom
    vectorSource.once('change', function () {
        if (vectorSource.getState() === 'ready') {
            const extent = vectorSource.getExtent();
            if (!ol.extent.isEmpty(extent)) {
                map.getView().fit(extent, { duration: 1000, padding: [50, 50, 50, 50] });
                const cartoche = document.getElementsByClassName("cartouche-content")
                if(cartoche){
                    cartouche(data, function (information) {
                        //console.log(information);
                        if(information.dossier){
                            displayCartoucheData(information);
                        }
                    });
                }
            } else {
                alert("⚠️ Aucune entité trouvée pour le filtre:");
            }
        }
    });

    return vectorLayer;
}

function supprimerEspaces(texte) {
    return texte.replace(/\s+/g, ''); // Supprime tous les espaces
}

function cartouche(data, callback) {
    let lein = base_url + "info_numero";

    $.ajax({
        url: lein,
        type: 'GET',
        data: data,
        dataType: 'json',
        success: function (response) {
            callback(response); // Appelle la fonction callback avec la réponse AJAX
        },
        error: function (xhr, status, error) {
            console.error('Erreur AJAX:', error);
        }
    });
}

    function equalsIgnoreCase(str1, str2) {
        if (!str1 || !str2) return false; // Gérer les valeurs null ou undefined
        return str1.toLowerCase() === str2.toLowerCase();
    }

    // Récupérer l'échelle depuis le ScaleLine
    function getScaleFromControl(scaleControl) {
        // Accéder à l'élément texte du ScaleLine
        var scaleText = document.querySelector('.ol-scale-text').innerText
        return scaleText;
    }

    // Fonction pour mettre à jour l'échelle dans le HTML
    function updateScale() {
        var scale = getScaleFromControl(scaleControl); // Récupérer l'échelle actuelle
        var scale_html = document.getElementById("scale-info")
        if(scale_html){
            scale_html.innerText = "Échelle : " + supprimerEspaces(scale); // Mettre à jour l'affichage
        }  
    }

    map.getView().on('change:resolution', function () {
        updateScale();
    });

    // Fonction pour encoder les caractères HTML
    function htmlspecialchars(str) {
        var element = document.createElement('div');
        if (str) {
            element.innerText = str;
            element.textContent = str;
        }
        return element.innerHTML;
    }

    function displayCartoucheData(information) {
        var data = information.dossier;
        var type_dossier = information.geoserver
        var origine = "";
        var parameter_cartouche = {
            en_tete: 'Propriété dite:',
            name_: data.nom_propriete
        }
        if (equalsIgnoreCase(type_dossier, 'demande')) {
            parameter_cartouche.en_tete = 'Demandeur:';
            parameter_cartouche.name_ = data.nom_demandeur;
        }

        if (data.origine) {
            origine = " de : " + data.origine;
        }

        var cartoucheContainer = $('#cartouche');

        if (data) {
            var scale = getScaleFromControl(scaleControl); // Obtenir l'échelle

            var cartoucheHtml = `
                <div class="bordur-cartouche p-1">
                    <div class="cartouche-content p-2 text-center">
                        <p style="margin-bottom: 0px;">${htmlspecialchars(parameter_cartouche.en_tete)}</p>
                        <label style="font-size: 60px;font-family: 'Edwardian Script ITC', cursive; font-weight: bold;">${htmlspecialchars(parameter_cartouche.name_)}</label>
                        <label>${htmlspecialchars(data.labeltraitement)} ${htmlspecialchars(origine)}</label>
                        <label>Située à  ${htmlspecialchars(data.nomfokontany)}, ${htmlspecialchars(data.nomcommune)}, district Atsimondrano, region Analamanga</label>
                        <p class="m-1" style="font-size: 20px;" id="numero-cartouche">${htmlspecialchars(data.numero)}</p>
                        <label id="scale-info">Échelle : ${scale}</label>
                        <p style="margin-bottom: 0px;">Feuille unique</p>
                        <label>Effectué par le Gomètre Expert ${htmlspecialchars(data.nom_prenom)}</label>
                        <label>le ${htmlspecialchars(data.date_previsionnel_descente)}</label>
                    </div>
                </div>
                <div class="mt-3 text-center">
                    <p> Legende: </p>
                    <div class = 'row align-items-baseline'>
                        <div class = 'col-4 text-end'>
                            <div class = "limite-cartouche"></div>
                        </div>
                        <div class = 'col-8'>
                            <p>Limite de la propriété </p> 
                        </div>      
                    </div>
                    <p>
                        <strong>Contenance :</strong> ${htmlspecialchars(data.surface)}
                    </p>
                    <p>
                        <strong>REPRODUCTION OFFICIELLE</strong>
                    </p>
                    ${htmlspecialchars(data.rtx)} ${htmlspecialchars(data.dateentree)}
                    <p>Délivrée sur demande de</p>
                    <ul style="padding-left: 20px;">`;
                        try {
                            var demandeursArray = JSON.parse(data.demandeurs);
                            demandeursArray.forEach(d => {
                                cartoucheHtml += `<li>${htmlspecialchars(d.nom)} ${htmlspecialchars(d.prenoms)}</li>`;
                            });
                        } catch (e) {
                            cartoucheHtml += '<li>Erreur lors de l’affichage des demandeurs</li>';
                        }

                        cartoucheHtml += `
                    </ul>
                </div>`;
            cartoucheContainer.html(cartoucheHtml);
        } else {
            cartoucheContainer.html('<p>Aucune donnée disponible</p>');
        }
    }
    
    // Appliquer le motif hachuré au style
    const customStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: createHatchPattern() // Utilisation du motif hachuré
        }),
        stroke: new ol.style.Stroke({
            color: 'black', // Bordure noire
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({ color: 'red' }),
            stroke: new ol.style.Stroke({ color: 'white', width: 2 })
        })
    });

    function createHatchPattern() {
        const canvas = document.createElement('canvas');
        const size = 10; // Taille du motif
        canvas.width = size;
        canvas.height = size;
        
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'rgba(0, 0, 0, 1)'; // Couleur des hachures (noir semi-transparent)
        ctx.lineWidth = 2;

        // Dessiner des lignes en diagonale
        ctx.beginPath();
        ctx.moveTo(0, size);
        ctx.lineTo(size, 0);
        ctx.stroke();

        return ctx.createPattern(canvas, 'repeat');
    }

    function fitre_reperage_entre_2_date(date_deb, date_fin) {
        var filter = "date_reperage BETWEEN '" + date_deb + "' AND '" + date_fin + "'";
    
        // Suppression des anciennes couches de repérage avant d'ajouter la nouvelle
        map.getLayers().forEach(function (layer) {
            if (layer.get('name') === 'reperage_layer') {
                map.removeLayer(layer);
            }
        });
    
        let layer = createWFSLayer('E-topo:reperage', filter, customStyle);
        layer.set('name', 'reperage_layer'); // Permet d'identifier facilement la couche
    
        // Vérification si des entités sont chargées dans la couche
        layer.getSource().once('featuresloadend', function(event) {
            let features = event.target.getFeatures();
    
            if (features.length === 0) {
                showPopup("Il n'y a pas encore de repérage entre ces dates", "error");
            } else {
                map.addLayer(layer);
            }
        });
    
        // Ajout du layer à la carte pour déclencher le chargement des données
        map.addLayer(layer);
    }

    // URL du serveur GeoServer pour WFS
	var urlWFS = 'http://localhost:8080/geoserver/wfs';