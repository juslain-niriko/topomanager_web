// Fonction pour verifier si deux point est proche
function isNearPoint(point, mouseX, mouseY) {
    const dx = mouseX - point.lng;
    const dy = mouseY - point.lat;
    return Math.sqrt(dx * dx + dy * dy) < snapThreshold;
}


function handleMouseMove(event, polygonePoints) {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLayer.clearLayers();
    drawSavedShapes();
    drawPolygon(selectedPolygon.points,"#2eb3df");
    drawVertices(selectedPolygon.points,"green");


    // const mouseX = event.clientX - rect.left;
    // const mouseY = event.clientY - rect.top;
    // var x = point.lng, y = point.lat;
    var mouseX = event.lng;
    var mouseY = event.lat;

    // startX = 
    //     startY = 
    let snapPoint = null;

    // Vérifier si le curseur est proche d'un des points
    for (let i = 0; i < polygonePoints.length; i++) {
        if (isNearPoint(polygonePoints[i], mouseX, mouseY)) {
            snapPoint = polygonePoints[i];
            break;
        }
    }

    // Si le curseur est proche d'un sommet, afficher un effet visuel ou ajuster
    if (snapPoint) {

        // Ici, tu peux ajouter un effet visuel ou déplacer le point
        // par exemple, changer la couleur du point ou dessiner un cercle autour du sommet
        // ctx.beginPath();
        // ctx.arc(snapPoint.x, snapPoint.y, 5, 0, Math.PI * 2);
        // ctx.fillStyle = 'red'; // Couleur du point "accroché"
        // ctx.fill();

        L.circleMarker((snapPoint), {
            radius: 3,
            color: "red",
            fillOpacity: 1
        }).addTo(drawLayer);
    }
    
    // drawPolygon(se); // Redessiner le polygone après chaque mouvement
}


// Fonction pour terminier une traçage quand on apuie sur
// le boutton fermer dans le menu clique droit
function fermer_polygon() {
    tempPolygonPoints.push(tempPolygonPoints[0]);
    savedShapes.push({ type: 'polygon', points: [...tempPolygonPoints] }); // Ajouter le polygone au tableau des formes
    tempPolygonPoints = []; // Réinitialiser les points du polygone
    drawLayer.clearLayers();
    drawSavedShapes();
    map.closePopup();
}

// Fonction pour dessiner toutes les formes sauvegardées
function drawSavedShapes() {
    savedShapes.forEach(shape => {
        drawPolygon(shape.points, "black");
    });
}

//Fonction de traçage de sommet
function drawVertices(points,color) {
    points.forEach((points, index) => {
        L.circleMarker((points), {
            radius: 3,
            color: color,
            fillOpacity: 1
        }).addTo(drawLayer);
    })
}

// Fonction pour vérifier si un point est dans un polygone
function isPointInPolygon(point, polygon) {
    var x = point.lng, y = point.lat;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].lng, yi = polygon[i].lat;
        const xj = polygon[j].lng, yj = polygon[j].lat;
        const intersect = ((yi > y) != (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

//Fonctin pour tracer des polyline
function drawPolyline(points) {
    L.polyline(
        points, {
        color: 'black'
    }).addTo(drawLayer);
}

//Fonction pour tracer des polygon
function drawPolygon(points, color) {
    var polygon = L.polygon(points, {
        // fillColor: color,
        color: color,
        fillOpacity: 0.1
    }).addTo(drawLayer);
}
