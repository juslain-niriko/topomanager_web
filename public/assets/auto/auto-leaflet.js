var plan = []
//plan selectionner
let idPlanSelect = null;
//tous les variable utiliser
let currentAngle = 0; // variable pour les rotation
var mapContainer = document.getElementById('map'); // div de la map
var rotateCheckbox = document.getElementById('btn-check-rotation-right');
var dragCheckBox = document.getElementById('btn-check-deplace');
const rotDiv = document.getElementById('rot-div'); // le div noire de la rotation
const dragDiv = document.getElementById('drag-div'); // div de la deplacement
// ImageLayer sur la carte
L.RotateImageLayer = L.ImageOverlay.extend({
    options: { rotation: 0 },

    initialize: function (url, bounds, options) {
        L.setOptions(this, options);
        L.ImageOverlay.prototype.initialize.call(this, url, bounds, options);
    },

    onAdd: function (map) {
        L.ImageOverlay.prototype.onAdd.call(this, map);
        this._reset();
    },

    _reset: function () {
        L.ImageOverlay.prototype._reset.call(this);
        this._updateRotation();
    },

    _updateRotation: function () {
        if (this._image) {
            let rotation = this.options.rotation;
            let transform = this._image.style.transform || '';

            // Supprime d'anciennes rotations et applique la nouvelle
            transform = transform.replace(/rotate\([^)]+\)/, '');
            transform += ` rotate(${rotation}deg)`;

            this._image.style.transform = transform;
        }
    },

    setRotation: function (angle) {
        this.options.rotation = angle;
        this._updateRotation();
    },
});

// Création d'une instance de la couche d'image avec rotation
L.rotateImageLayer = function (url, bounds, options) {
    return new L.RotateImageLayer(url, bounds, options);
};

// button check du foncd Image
document.getElementById('btn-check-ecw').addEventListener('change', function() {
    if (this.checked) {
        mapContainer.style.visibility = 'visible';
    } else {
        mapContainer.style.visibility = 'hidden';
    }
});

//button check de la transposition d
document.querySelector('.btn-transposition').addEventListener('click', function () {
    if(idPlanSelect != null){
        const inputRange = document.getElementById('inputRange');
        if (inputRange.style.display === 'none') {
            inputRange.style.display = 'block'; // Afficher
            inputRange.value = plan[idPlanSelect]._opacityValue // Afficher
        } else {
            inputRange.style.display = 'none'; // Masquer
        }
    }

});

var map = L.map('map', {
    center: [-18.919205, 47.475404], // Position par défaut [Y,X]
    zoom: 18,
    zoomControl: false // Désactiver les icônes de zoom
});

var Ortho = L.tileLayer.wms('http://localhost:8080/geoserver/E-topo/wms', {
    layers: 'E-topo:Fianarantsoa',
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
    maxZoom: 26,
}).addTo(map);

function imageBound(imageWidthMetre, imageHeightMetre, y, x) {
    const latitudeDegree = imageHeightMetre / 111314; // 1 degré de latitude ≈ 111,32 km
    const longitudeDegree = imageWidthMetre / (111314 * Math.cos(y * Math.PI / 180)); // y est la latitude

    const topLeft = [y, x]; 
    const topRight = [y, x + longitudeDegree]; 
    const bottomLeft = [y - latitudeDegree, x]; 
    const bottomRight = [y - latitudeDegree, x + longitudeDegree];

    return [
        topLeft, topRight, bottomRight, bottomLeft
    ];
}

function ObjectImage() {
    const inputFile = document.getElementById('imageInput');
    const x = parseFloat(document.getElementById('coordX').value || map.getCenter().lng);
    const y = parseFloat(document.getElementById('coordY').value || map.getCenter().lat);
    const echelle = parseFloat(document.getElementById('echelle').value);
    const contenance = parseFloat(document.getElementById('contenance').value || 0);
    const dpi = parseFloat(document.getElementById('dpi').value || 300);

    // Vérifier si un fichier a été sélectionné
    if (!inputFile.files || inputFile.files.length === 0 || inputFile.files.length == null) {
        throw new Error("Aucune image sélectionnée. Veuillez choisir une image.");
    }

    // Vérifier si l'échelle est valide
    if (isNaN(echelle) || echelle <= 0) {
        throw new Error("Échelle invalide");
    }

    if (isNaN(dpi) || dpi <= 0 || dpi > 300 ){
        throw new Error("Verifier bien votre DIP");
    }

    return {
        inputFile : inputFile,
        _x: x,
        _y: y,
        _echelle: echelle,
        _contenance: contenance,
        _dpi : dpi
    };
}

function ParameterToMetre(pixel, dpi, echelle){
    distanceCM = (pixel/dpi)*2.54; // Pouce à centimètre
    distanceTerrain = distanceCM * ((echelle/100)); 
    return distanceTerrain;
}

// return dernier value dans le tableau
function returnDernierLignePlan(){
    return plan.length - 1;
}

//Selection de layer
function getSelectedValue() {
    const selectElement = document.getElementById("layer-plan");
    const selectedValue = selectElement.value; // Récupère la valeur sélectionnée
    return selectedValue;
}

//selection le dernier value ajouter dans le select
function selectOptionById(optionValue) {
    const selectElement = document.getElementById("layer-plan");
    if (selectElement) {
        selectElement.value = optionValue; // Sélectionne l'option correspondante à la valeur
        selectElement.dispatchEvent(new Event('change')); // Déclenche l'événement 'change' si nécessaire
    }
}

//function qui uncheck les check box voulue
function uncheckCheckboxes() {
    if (rotateCheckbox) rotateCheckbox.checked = false;  // Décocher la case rotation
    if (dragCheckBox) dragCheckBox.checked = false;     // Décocher la case déplacement
}


//listener de selection de layer
document.getElementById("layer-plan").addEventListener("change", function() {
    idPlanSelect = getSelectedValue();   
    uncheckCheckboxes();
    rotDiv.style.display = 'none'; // supprimmer la div de la rotation
    dragDiv.style.display = 'none'; // supprimmer la div de la drag
});

function populateSelect(object) {
    var select = document.getElementById("layer-plan");

    //ajoute de l'element dans le tableau d'object
    plan.push(object);

    // Vider le select au cas où il y a déjà des options
    select.innerHTML = "";

    // Boucle sur les objets du tableau plan
    plan.forEach(function(item, index) {
        var option = document.createElement("option");
        option.value = index;                    // Valeur de l'option (index du tableau)
        option.textContent = item._image_name;  // Texte affiché dans la liste déroulante
        select.appendChild(option);             // Ajout de l'option au select
    });
}

function addImage() {
    try {
        const image = ObjectImage(); // Tente d'obtenir l'image et ses paramètres

        if (image.inputFile.files && image.inputFile.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                try {
                    const imageUrl = e.target.result; // URL de l'image chargée
                    // Charger l'image pour obtenir ses dimensions
                    const img = new Image();
                    img.src = imageUrl;

                    img.onload = function () {
                        try {
                            const imageWidthMetre = ParameterToMetre(img.width, image._dpi, image._echelle); // Largeur en mètres
                            const imageHeightMetre = ParameterToMetre(img.height, image._dpi, image._echelle); // Hauteur en mètres
                        
                            const newBounds = imageBound(imageWidthMetre, imageHeightMetre, image._y, image._x);
                            
                            // Ajout de l'image avec rotation
                            const overlay = L.rotateImageLayer(
                                img.src, 
                                newBounds, 
                                { rotation: 0 } // Prend en compte l'angle de rotation
                            );

                            // Ajouter l'overlay à la carte avec map.addLayer()
                            map.addLayer(overlay);

                            //cree des objet a afficher
                            const object_plan = {
                                _image_name : image.inputFile.files[0].name,
                                _img : img,
                                _overlay : overlay,
                                _newBounds : newBounds,
                                _definitAngle : 0, 
                                _orgX : image._x,
                                _orgY : image._y,
                                _imageWidthMetre : imageWidthMetre,
                                _imageHeightMetre : imageHeightMetre,
                                _draggableImage : false,
                                _isRotateImage : false,
                                _opacityValue : 100,
                            }

                            populateSelect(object_plan)
                            idPlanSelect = returnDernierLignePlan()
                            selectOptionById(idPlanSelect)
                        } catch (error) {
                            console.error("Erreur lors du chargement de l'image :", error);
                            alert("Erreur lors du traitement de l'image.");
                        }
                    };
                } catch (error) {
                    console.error("Erreur lors de la lecture du fichier :", error);
                    alert("Erreur lors de la lecture du fichier image.");
                }
            };

            reader.readAsDataURL(image.inputFile.files[0]);
        } else {
            alert("Veuillez sélectionner une image à importer.");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de l'image :", error);
        alert(error.message); // Affiche le message d'erreur levé par `ObjectImage`
    }
}

document.getElementById('inputRange').addEventListener('input', function () {
    if (idPlanSelect != null) { // Vérifier si l'overlay existe
        plan[idPlanSelect]._opacityValue = this.value / 100; // Convertir la valeur (0-100) en opacité (0.0-1.0)
        plan[idPlanSelect]._overlay.setOpacity(plan[idPlanSelect]._opacityValue); // Utiliser la méthode Leaflet pour mettre à jour l'opacité
    }
});

dragCheckBox.addEventListener('change', function () {
    if(idPlanSelect != null){
        if (rotateCheckbox){
            rotateCheckbox.checked = false;  // Décocher la case rotation
            plan[idPlanSelect]._isRotateImage = false;
            activeAllAction() // function qui reactive tous les action sur la carte
        } 
        if (this.checked) {
            plan[idPlanSelect]._draggableImage = true;
            dragDiv.style.display = 'block'; // Afficher la div de déplacement
            rotDiv.style.display = 'none'; // supprimmer la div de la rotation
        } else {
            //gere toutes les variable
            plan[idPlanSelect]._draggableImage = false;
            dragDiv.style.display = 'none'; // supprimmer la div de déplacement
            rotDiv.style.display = 'none'; // supprimmer la div de la rotation
        }
    } 
});

function desactiveAllAction(){ //function qui desactive toutes les actions sur la carte
    map.dragging.disable(); // Désactiver le déplacement de la carte
    map.scrollWheelZoom.disable(); // Désactiver le zoom à la molette de la souris
    map.doubleClickZoom.disable(); // Désactiver le zoom au double-clic
    map.touchZoom.disable(); // Désactiver le zoom tactile
}

function activeAllAction(){ //function qui active toutes les action sur la carte
    map.dragging.enable(); // Active le déplacement de la carte
    map.scrollWheelZoom.enable(); // Active le zoom à la molette de la souris
    map.doubleClickZoom.enable(); // Active le zoom au double-clic
    map.touchZoom.enable(); // Active le zoom tactile
}

function traceLeDivNoirRotation(){
    // Récupérer les coordonnées géographiques de l'imageOverlay
    if(idPlanSelect != null){
        const bounds = plan[idPlanSelect]._overlay.getBounds();
        const topLeft = map.latLngToContainerPoint(bounds.getNorthWest()); // Coin supérieur gauche
        const bottomRight = map.latLngToContainerPoint(bounds.getSouthEast()); // Coin inférieur droit

        // Calculer la largeur et la hauteur en pixels
        const width = bottomRight.x - topLeft.x;
        const height = bottomRight.y - topLeft.y;

        // Rendre la div visible
        rotDiv.style.display = 'block';

        // Appliquer la rotation et positionner la div
        rotDiv.style.transform = `rotate(${currentAngle}deg)`;

        rotDiv.style.position = 'absolute';
        rotDiv.style.left = `${topLeft.x}px`;
        rotDiv.style.top = `${topLeft.y}px`;
        rotDiv.style.width = `${width}px`;
        rotDiv.style.height = `${height}px`;
    }
    
}

rotateCheckbox.addEventListener('change', function () {
    if(idPlanSelect != null){
        if (dragCheckBox){
            dragCheckBox.checked = false; // Décocher la case déplacement
            plan[idPlanSelect]._draggableImage = false;
        } 
        if(rotateCheckbox.checked){
            plan[idPlanSelect]._isRotateImage = true;
            //enleve si le div de deplacement est la 
            dragDiv.style.display = 'none'; // supprimmer la div de déplacement
            desactiveAllAction() // function qui desactive tous les action sur la carte
            traceLeDivNoirRotation() //function qui trace le div noir de la rotation
        }else{
            plan[idPlanSelect]._isRotateImage = false;
            // Réactiver les interactions de la carte
            activeAllAction() // function qui reactive tous les action sur la carte
            // Cacher la div lorsqu'on décoche la case
            rotDiv.style.display = 'none';
        }
    }
});

// Ajout du contrôle de rotation avec la souris
document.addEventListener('mousemove', (e) => {
    if(idPlanSelect != null){
        if (plan[idPlanSelect]._isRotateImage) {
            plan[idPlanSelect]._draggableImage = false
            // Convertir les coordonnées de orgX, orgY en pixels sur l'écran
            const centerPoint = map.latLngToContainerPoint([plan[idPlanSelect]._orgY,plan[idPlanSelect]._orgX]);
    
            const mapRect = document.getElementById('map').getBoundingClientRect(); // Remplacez par l'ID de votre div de carte, s'il est différent

            // Coordonnées de la souris
            const mouseX = e.clientX - mapRect.left;
            const mouseY = e.clientY - mapRect.top;
    
            // Calculer la différence entre la souris et le centre de rotation
            const deltaX = mouseX - centerPoint.x;
            const deltaY = mouseY - centerPoint.y;
    
            // Calculer l'angle en radians puis le convertir en degrés
            currentAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
            // Appliquer la rotation à la div
            rotDiv.style.transform = `rotate(${currentAngle}deg)`;
            console.log(currentAngle);
        }
    }
});

// debut de fonction deplacer
map.on('mousemove', (e) => {
    if(idPlanSelect != null){
        if (plan[idPlanSelect]._draggableImage) {
            plan[idPlanSelect]._isRotateImage = false;
            // Appliquer la même rotation à la div que l'image
            dragDiv.style.transform = `rotate(${plan[idPlanSelect]._definitAngle}deg)`;

            // Obtenir la position de la souris sur la carte
            const latLng = e.latlng;
            
            // Convertir la position lat/lon en pixels à partir du coin supérieur gauche de la carte
            const point = map.latLngToContainerPoint(latLng);
             // Appliquer la position de la div
             dragDiv.style.left = `${point.x}px`;
             dragDiv.style.top = `${point.y}px`;
    
             // Récupérer les coordonnées géographiques de l'imageOverlay
            const imageElement = plan[idPlanSelect]._overlay.getElement();
            // Récupérer les dimensions de l'image (en pixels)
            let width = imageElement.width;
            let height = imageElement.height;
        
            // Appliquer les dimensions de l'image à la div noire
            dragDiv.style.width = `${width}px`;
            dragDiv.style.height = `${height}px`;
    
        }
    }
});

map.on('click', (e) => {
    if(idPlanSelect != null){
        if (plan[idPlanSelect]._draggableImage) {
            plan[idPlanSelect]._orgX = e.latlng.lng
            plan[idPlanSelect]._orgY =  e.latlng.lat
            // Nouvelle position du coin supérieur gauche de l'image en fonction du clic
            plan[idPlanSelect]._newBounds = imageBound(plan[idPlanSelect]._imageWidthMetre, plan[idPlanSelect]._imageHeightMetre, plan[idPlanSelect]._orgY, plan[idPlanSelect]._orgX);
            // Mettre à jour les coordonnées de l'image superposée avec la nouvelle position
    
            map.removeLayer(plan[idPlanSelect]._overlay); // Supprimer l'ancien overlay
            // Créer et ajouter le nouvel overlay
            plan[idPlanSelect]._overlay = L.rotateImageLayer(plan[idPlanSelect]._img.src, plan[idPlanSelect]._newBounds, { rotation: plan[idPlanSelect]._definitAngle });
            map.addLayer(plan[idPlanSelect]._overlay);
            
            // Mettre à jour les dimensions de la div noire pour correspondre à la nouvelle image superposée
            // Récupérer les coordonnées géographiques de l'imageOverlay
            // Obtenir la position de la souris sur la carte
            const latLng = e.latlng;
            
            // Convertir la position lat/lon en pixels à partir du coin supérieur gauche de la carte
            const point = map.latLngToContainerPoint(latLng);
            // Appliquer la position de la div
            dragDiv.style.left = `${point.x}px`;
            dragDiv.style.top = `${point.y}px`;

            const bounds = plan[idPlanSelect]._overlay.getBounds();
            const topLeft = map.latLngToContainerPoint(bounds.getNorthWest()); // Coin supérieur gauche
            const bottomRight = map.latLngToContainerPoint(bounds.getSouthEast()); // Coin inférieur droit

            // Calculer la largeur et la hauteur en pixels
            const width = bottomRight.x - topLeft.x;
            const height = bottomRight.y - topLeft.y;

            // Appliquer les dimensions de l'image à la div noire
            dragDiv.style.width = `${width}px`;
            dragDiv.style.height = `${height}px`;

            // Appliquer la même rotation à la div que l'image
            dragDiv.style.transform = `rotate(${plan[idPlanSelect]._definitAngle}deg)`;
        }
        if(plan[idPlanSelect]._isRotateImage){    
            plan[idPlanSelect]._definitAngle = currentAngle
    
            map.removeLayer(plan[idPlanSelect]._overlay); // Supprimer l'ancien overlay
    
            // Créer et ajouter le nouvel overlay
            plan[idPlanSelect]._overlay = L.rotateImageLayer(plan[idPlanSelect]._img.src, plan[idPlanSelect]._newBounds, { rotation: plan[idPlanSelect]._definitAngle });
            map.addLayer(plan[idPlanSelect]._overlay);
        }
        plan[idPlanSelect]._overlay.setOpacity(plan[idPlanSelect]._opacityValue); // Utiliser la méthode Leaflet pour mettre à jour l'opacité
        console.log(plan[idPlanSelect]);
    }
    
});

//fin fonction deplacement
// Intégration de leaflet-draw pour ajouter le traçage du polygone
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
// Configuration du contrôle de dessin
var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polygon: {
            shapeOptions: {
                color: '#3388ff', // Couleur de la ligne
                weight: 1,       // Épaisseur de la ligne en pixels
                opacity: 1,      // Opacité de la ligne
                fillColor: 'transparent', // Couleur de remplissage pour les polygones
            }
        },
        polyline: {
            shapeOptions: {
                color: 'red', // Couleur de la ligne
                weight: 1,       // Épaisseur de la ligne en pixels
                opacity: 1      // Opacité de la ligne
            }
        },
        rectangle: false, // Désactive le dessin des rectangles
        circlemarker: false, // Désactive le dessin des cercles
        circle: false, // Désactive le dessin des cercles
        marker: false // Désactive le dessin des marqueurs
    }
});

// Ajout du contrôle de dessin à la carte
map.addControl(drawControl);

// Gestion des éléments dessinés
map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;
    drawnItems.addLayer(layer);
});

// Récupération du conteneur du contrôle de dessin
var drawControlContainer = drawControl.getContainer();

// Ajout du conteneur du contrôle de dessin à la div personnalisée
document.getElementById('custom-draw-control').appendChild(drawControlContainer);

map.on('draw:created', function(e) {
    var layer = e.layer;
    drawnItems.addLayer(layer); // Ajouter le polygone à la carte
    var polygonCoordinates = layer.getLatLngs();
    console.log('Coordonnées du polygone :', polygonCoordinates);
});


// visualisation de l'image sur le modal insertion
const imageUpload = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');

imageUpload.addEventListener('change', function(event) {

    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            imagePreview.innerHTML = ''; // Vider le contenu précédent
            const img = document.createElement('img');
            img.src = e.target.result;

            let zoomLevel = 1;          // Niveau de zoom initial
            let isDragging = false;     // Vérifie si l'utilisateur déplace l'image
            let startX, startY;         // Position initiale de la souris
            let offsetX = 0, offsetY = 0; // Décalage de l'image

            // Gestion du zoom avec la molette de la souris
            imagePreview.addEventListener('wheel', (event) => {
                event.preventDefault();
                const zoomStep = 0.1;

                if (event.deltaY < 0) {
                    // Zoom avant
                    zoomLevel += zoomStep;
                } else {
                    // Zoom arrière sans aller en dessous de 1
                    zoomLevel = Math.max(1, zoomLevel - zoomStep);
                    if (zoomLevel === 1) {
                        offsetX = 0;
                        offsetY = 0;
                    }
                }

                img.style.transform = `scale(${zoomLevel}) translate(${offsetX}px, ${offsetY}px)`;
            });

            // Début du déplacement (drag start)
            imagePreview.addEventListener('mousedown', (event) => {
                if (zoomLevel > 1) {
                    isDragging = true;
                    startX = event.clientX - offsetX;
                    startY = event.clientY - offsetY;
                    imagePreview.style.cursor = 'grabbing';
                }
            });

            // Déplacement fluide de l'image (dragging)
            imagePreview.addEventListener('mousemove', (event) => {
                if (isDragging && zoomLevel > 1) {
                    const currentX = event.clientX;
                    const currentY = event.clientY;

                    offsetX = currentX - startX;
                    offsetY = currentY - startY;

                    // Appliquer la transformation en temps réel
                    requestAnimationFrame(() => {
                        img.style.transform = `scale(${zoomLevel}) translate(${offsetX}px, ${offsetY}px)`;
                    });
                }
            });

            // Fin du déplacement (drag end)
            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    imagePreview.style.cursor = 'grab';
                }
            });

            imagePreview.appendChild(img);
        };

        reader.readAsDataURL(file);
    } else {
        imagePreview.innerHTML = '<span>Aucune image chargée</span>';
    }
});
var crs = new L.Proj.CRS('EPSG:29702',
    '+proj=omerc +lat_0=-18.9 +lonc=44.10000000000001 +alpha=18.9 +k=0.9995000000000001 +x_0=400000 +y_0=800000 +gamma=18.9 +ellps=intl +towgs84=-189,-242,-91,0,0,0,0 +pm=paris +units=m +no_defs', {
    resolutions: [
        8192, 4096, 2048, 1024, 512, 256, 128
    ],
    origin: [0, 0]
});

//function projection laborder
function projectXY(latlng) {
    latlng = {lat:latlng[0], lng:latlng[1] }
    var point = crs.project(latlng);
    return [point.x, point.y];
}

// Ajout de l'événement mousemove pour afficher les coordonnées dans la projection Laborde
map.on('mousemove', function (e) {
    var projected = projectXY([e.latlng.lat, e.latlng.lng]);
    document.getElementById('X').innerText = projected[0].toFixed(2);
    document.getElementById('Y').innerText = projected[1].toFixed(2);
});

//export JWG
document.getElementById('export').onclick = function() {
    if (idPlanSelect != null) {
        // Transformation des coordonnées
        let laborde = projectXY([plan[idPlanSelect]._orgY, plan[idPlanSelect]._orgX]);

        // Calcul des facteurs d'échelle
        let my = plan[idPlanSelect]._imageHeightMetre / plan[idPlanSelect]._img.height;
        let mx = plan[idPlanSelect]._imageWidthMetre / plan[idPlanSelect]._img.width;

        // Conversion de l'angle de rotation en radians
        let t = plan[idPlanSelect]._definitAngle * (Math.PI / 180);

        // Facteur de cisaillement le long de l'axe des x (k)
        //let k = Math.tan(plan[idPlanSelect]._shearAngle * (Math.PI / 180));  // Assurez-vous que _shearAngle est défini dans le plan
        let k = 1;
        // Calcul des coefficients avec cisaillement
        //let A = mx * Math.cos(t);
        let B = my * (k * Math.cosh(t) - Math.sinh(t));
        let D = mx * Math.sinh(t);
        //let E = -my * (k * Math.sin(t) + Math.cos(t));

        let A = mx;
        let E = -my
        // Construction du contenu du fichier .jgw avec les sauts de ligne explicites
        let jgw = `${A}\n` +  // Résolution en X
                  `${D}\n` +  // Rotation en X
                  `${B}\n` +  // Rotation en Y (avec cisaillement)
                  `${E}\n` +  // Résolution en Y (négatif pour inverser l'axe Y)
                  `${laborde[0]}\n` +  // Coordonnée X du coin supérieur gauche
                  `${laborde[1]}`;      // Coordonnée Y du coin supérieur gauche

        // Affichage dans la console pour vérification
        console.log(jgw);

        // Génération du fichier texte .jgw
        genererFichierTexte(jgw, remplacerExtension(plan[idPlanSelect]._image_name));
    } else {
        console.error("Aucun plan sélectionné pour l'export.");
    }
};

//generation du fichier jwg
function remplacerExtension(nomFichier) {
    // On divise le nom du fichier en utilisant le point (.) comme séparateur
    let parties = nomFichier.split(".");

    // Si le fichier contient un point, on remplace l'extension après le point par "jwg"
    if (parties.length > 1) {
        // On remplace l'extension par "jwg" et on recrée le nom du fichier
        return parties[0] + ".jgw";
    }

    // Si le nom du fichier ne contient pas de point, on ajoute "jwg" à la fin
    return nomFichier + ".jgw";
}


// Fonction pour générer un fichier texte
function genererFichierTexte(contenu, nomFichier) {
    // Création d'un blob avec le contenu et le type "text/plain"
    const blob = new Blob([contenu], { type: "text/plain" });

    // Création du lien de téléchargement
    const lien = document.createElement("a");
    
    // Création d'une URL pour le fichier blob
    lien.href = URL.createObjectURL(blob);
    
    // Nom du fichier à télécharger
    lien.download = nomFichier;

    // Ajout du lien au document et déclenchement du clic pour télécharger
    document.body.appendChild(lien);
    lien.click();

    // Nettoyage : suppression du lien après téléchargement
    document.body.removeChild(lien);
}

