var map = L.map('map').setView([48.8566, 2.3522], 13);
map.dragging.disable();
map.doubleClickZoom.disable();
const canvas = document.getElementById('map');
var drawLayer = L.layerGroup().addTo(map);
var tempPolygonPoints = []; // Tableau pour stocker temporairement un polygone en cours de trçage
let selectedPolygon = null; // Réinitialiser la sélection
let savedShapes = []; // Tableau pour stocker les formes dessinées
var drawing = false;
const snapThreshold = 13;

document.querySelectorAll('.toolbar .btn').forEach((button, index) => {
    button.addEventListener('click', () => {
        map.dragging.disable();
        currentShape = index;
        drawing = true;
        if (currentShape == 0) {
            canvas.style.cursor = 'default';
        }
        else if (currentShape == 1) {
            canvas.style.cursor = 'default';
        }
        else if (currentShape == 2) {
            canvas.style.cursor = 'crosshair';
        }
        else if (currentShape == 3) {
            canvas.style.cursor = 'move';
            map.dragging.enable();
        }
    });
});

map.on('click', function (e) {
    if (!drawing) return;

    if (currentShape == 0) {
        savedShapes.forEach((polygon) => {
            if (isPointInPolygon(e.latlng, polygon.points)) {
                selectedPolygon = polygon; // Sélectionner le polygone
                drawPolygon(selectedPolygon.points,"#2eb3df");
            }
        });
    }
    if (currentShape == 2) {
        tempPolygonPoints.push(e.latlng);
        drawLayer.clearLayers();
        drawSavedShapes();
        eventDrawPolygon();
        drawVertices(tempPolygonPoints,"green");
    }
});

map.on('mousemove',function(e){
    if(!drawing) return;

    if(currentShape == 1){
        var latlng = e.latlng;
        handleMouseMove(latlng, selectedPolygon.points);
    }
});

map.on('contextmenu', function (e) {
    e.preventDefault;
    var latlng = e.latlng;
    if (tempPolygonPoints.length < 1) {
        L.popup()
            .setLatLng(latlng)
            .setContent('<button class="btn btn-outline-secondary btn-sm" disabled>Finir le traçage</button>')
            .openOn(map);
    } else {
        L.popup()
            .setLatLng(latlng)
            .setContent('<button class="btn btn-outline-primary btn-sm" id="fermer" onclick="fermer_polygon()" >Finir le traçage</button>')
            .openOn(map);
    }
});



function eventDrawPolygon() {
    if (tempPolygonPoints.length > 1 && tempPolygonPoints.length < 3) {
        drawPolyline(tempPolygonPoints);
    } else {
        drawPolygon(tempPolygonPoints, 'black');
    }
}



