function DisableButton() {
    const saveButton = document.getElementById('savebuton');
    const closeButton = document.getElementById('closebuton');
    saveButton.disabled = true;
    closeButton.disabled = true;
    saveButton.textContent = 'Chargement...';
}
function EnableButton() {
    const saveButton = document.getElementById('savebuton');
    const closeButton = document.getElementById('closebuton');
    saveButton.disabled = true;
    closeButton.disabled = false;
    saveButton.textContent = 'Enregistrer';
}

function HideModal() {
    var myModalEl = document.getElementById('unifiedModal');
    var modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
}

function PayementAction() {
    DisableButton();
    // Transformer le tableau sérialisé en un objet clé-valeur
    var formData = {};
    $('#unifiedForm').serializeArray().forEach(field => {
        formData[field.name] = field.value;
    });

    var lien = base_url + "payer_dossier";

    // Envoyer les données au serveur
    fetch(lien, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // Convertir les données en JSON
    })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                EnableButton();
                HideModal();
                showPopup(result.message, 'success');
            } else {
                showPopup('Error: ' + result.message, 'error');
            }
        })
        .catch(error => {
            showPopup('Erreur lors de la connexion avec le serveur. Veuillez réessayer plus tard.', 'error');
            console.error('Error:', error); // Pour un débogage plus détaillé
        });
}

function ImpressionFactureAction() {
    DisableButton()
    var formDataArray = $('#unifiedForm').serializeArray();
    var lien = base_url + "print_recu";
    // Envoyer les données au serveur
    fetch(lien, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataArray) // Convertir les données en JSON
    })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                EnableButton();
                HideModal();
                showPopup(result.message, 'success');
                var newWindow = window.open();
                newWindow.document.open();
                newWindow.document.write(result.data);
                newWindow.document.close();
            } else {
                showPopup('Error: ' + result.message, 'error');
            }

        })
        .catch(error => {
            showPopup('Erreur lors de la connexion avec le serveur. Veuillez réessayer plus tard.', 'error');
            console.error('Error:', error); // Pour un débogage plus détaillé
        });
};

function integrationAction(){
    DisableButton()
    var formDataArray = $('#unifiedForm').serializeArray();
    //console.log(formDataArray);
    var lien = base_url + "integration";
    // Envoyer les données au serveur
    fetch(lien, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataArray) // Convertir les données en JSON
    })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                EnableButton();
                HideModal();
                showPopup(result.message, 'success');
            } else {
                showPopup('Error: ' + result.message, 'error');
            }
        })
        .catch(error => {
            showPopup('Erreur lors de la connexion avec le serveur. Veuillez réessayer plus tard.', 'error');
            console.error('Error:', error); // Pour un débogage plus détaillé
        });
}

function VerificationAction() {
    DisableButton()
    var formDataArray = $('#unifiedForm').serializeArray();
    //console.log(formDataArray);
    var lien = base_url + "validate_verification";
    // Envoyer les données au serveur
    fetch(lien, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataArray) // Convertir les données en JSON
    })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                EnableButton();
                HideModal();
                showPopup(result.message, 'success');
            } else {
                showPopup('Error: ' + result.message, 'error');
            }
        })
        .catch(error => {
            showPopup('Erreur lors de la connexion avec le serveur. Veuillez réessayer plus tard.', 'error');
            console.error('Error:', error); // Pour un débogage plus détaillé
        });
};

function GeometreAction() {
    DisableButton()
    var formDataArray = $('#unifiedForm').serializeArray();
    var lien = base_url + "validate_geometre";
    //console.log(formDataArray);
    // Envoyer les données au serveur
    fetch(lien, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataArray) // Convertir les données en JSON
    }).then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                EnableButton();
                HideModal();
                showPopup(result.message, 'success');
            } else {
                showPopup('Error: ' + result.message, 'error');
            }
        })
        .catch(error => {
            showPopup('Erreur lors de la connexion avec le serveur. Veuillez réessayer plus tard.', 'error');
            console.error('Error:', error); // Pour un débogage plus détaillé
        });
};

function VisaAction() {
    DisableButton();
    var formDataArray = $('#unifiedForm').serializeArray();
    var lien = base_url + "validate_visa";

    var formData = {};

    // Convertir formDataArray en un objet JSON correct
    formDataArray.forEach(function (item) {
        if (item.name.endsWith("[]")) {
            let key = item.name.replace("[]", ""); // Enlever les crochets []
            if (!formData[key]) {
                formData[key] = [];
            }
            formData[key].push(item.value);
        } else {
            formData[item.name] = item.value;
        }
    });

    fetch(lien, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // Envoyer les données sous forme d'objet structuré
    }).then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                EnableButton();
                HideModal();
                showPopup(result.message, 'success');
            } else {
                showPopup('Error: ' + result.message, 'error');
            }
        })
        .catch(error => {
            showPopup('Erreur lors de la connexion avec le serveur. Veuillez réessayer plus tard.', 'error');
            console.error('Error:', error);
        });
};

function SatisfactionAction() {
    DisableButton()
    var formDataArray = $('#unifiedForm').serializeArray();
    var lien = base_url + "validate_satisfaction";
    // Envoyer les données au serveur
    // console.log(formDataArray);
    fetch(lien, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataArray) // Convertir les données en JSON
    }).then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                EnableButton();
                HideModal();
                showPopup(result.message, 'success');
            } else {
                showPopup('Error: ' + result.message, 'error');
            }
        })
        .catch(error => {
            showPopup('Erreur lors de la connexion avec le serveur. Veuillez réessayer plus tard.', 'error');
            console.error('Error:', error); // Pour un débogage plus détaillé
        });
};

function VerificationPiecesAction() {
    DisableButton()
    var formDataArray = $('#unifiedForm').serializeArray();
    var lien = base_url + "validate_verif_avt_remise";
    // Envoyer les données au serveur
    var formData = {};

    formDataArray.forEach(function (item) {
        if (formData[item.name]) {
            if (!Array.isArray(formData[item.name])) {
                formData[item.name] = [formData[item.name]];
            }
            formData[item.name].push(item.value);
        } else {
            formData[item.name] = item.value;
        }
    });

    fetch(lien, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // Convertir les données en JSON
    }).then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                EnableButton();
                HideModal();
                showPopup(result.message, 'success');
            } else {
                showPopup('Error: ' + result.message, 'error');
            }
        })
        .catch(error => {
            showPopup('Erreur lors de la connexion avec le serveur. Veuillez réessayer plus tard.', 'error');
            console.error('Error:', error); // Pour un débogage plus détaillé
        });
};

//fonction pour l'import DXF pas toucher
function transformCoordinates(data) {
    if (!data || !data.length || !data[0].coordinates) return [];

    return data[0].coordinates.map(point => [
        parseFloat(point.X),
        parseFloat(point.Y)
    ]);
}

function unprojectXYToMercator(xy) {
    return ol.proj.transform(xy, 'EPSG:29702', 'EPSG:3857');
}

function unprojectArrayXYToMercator(xyArray) {
    return xyArray.map(xy => unprojectXYToMercator(xy));
}

function zoomToCoordinates(map, coordinates) {
    if (coordinates.length === 0) return;
    const extent = ol.extent.boundingExtent(coordinates);
    map.getView().fit(extent, { duration: 1000, padding: [150, 150, 150, 150] });
    refreshAllLayers(map);
}

function zoomToAllCoordinates(map, allCoordinates) {
    if (allCoordinates.length === 0) return;

    let mergedCoordinates = allCoordinates.flat();
    const extent = ol.extent.boundingExtent(mergedCoordinates);

    let highlightSource = new ol.source.Vector();
    let highlightLayer = new ol.layer.Vector({ source: highlightSource });

    map.addLayer(highlightLayer);

    allCoordinates.forEach(coords => {
        let feature = new ol.Feature(new ol.geom.Polygon([coords]));
        highlightSource.addFeature(feature);
    });

    let colors = ['rgba(8, 159, 8, 0.7)', 'rgba(8, 159, 8, 0)']; // Alternance entre jaune et transparent
    let i = 0;

    let interval = setInterval(() => {
        let style = new ol.style.Style({
            fill: new ol.style.Fill({ color: colors[i % 2] }),
            stroke: new ol.style.Stroke({ color: 'white', width: 2 })
        });
        highlightLayer.setStyle(style);
        i++;
    }, 500); // Change toutes les 500ms

    map.getView().fit(extent, { duration: 1000, padding: [150, 150, 150, 150] });

    setTimeout(() => {
        clearInterval(interval);
        map.removeLayer(highlightLayer);
    }, 7000);
}

function closePolygon(coords) {
    if (coords.length > 0) {
        // Vérifier si le premier et le dernier point sont déjà identiques
        if (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1]) {
            coords.push([...coords[0]]); // Ajouter une copie du premier point à la fin
        }
    }
    return coords;
}

function ImportDxfAction() {
    DisableButton();
    var formElement = $('#unifiedForm')[0];
    var formDataArray = new FormData(formElement);
    var lien = base_url + "import_dxf";
    $.ajax({
        url: lien,
        type: 'POST',
        data: formDataArray,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.status === 'success') {
                // Activer le bouton et cacher le modal
                EnableButton();
                HideModal();
                showPopup(response.message, 'success');
                
                // Transformation des coordonnées (en supposant qu'elles sont dans une projection autre que EPSG:3857)
                let projectedCoords = transformCoordinates(response.object);
                // Reprojection des coordonnées transformées (de EPSG:29702 à EPSG:3857)
                let unprojectedCoords = unprojectArrayXYToMercator(projectedCoords);
                unprojectedCoords = closePolygon(unprojectedCoords);

                zoomToCoordinates(map, unprojectedCoords);
                
            } else {
                showPopup('Error: ' + response.message, 'error');
            }            
        },
        error: function (xhr, status, error) {
            showPopup('Error: ' + error, 'error');
        }
    })
};

function SendDossierAction() {
    // var formDataArray = $('#unifiedForm').serializeArray();
    // console.log(formDataArray);
};
function remiseAction() {
    // var formDataArray = $('#unifiedForm').serializeArray();
    // console.log(formDataArray);
};
function ImportPiecesAction() {
    DisableButton();
    var formElement = $('#unifiedForm')[0];
    var formDataArray = new FormData(formElement);
    var lien = base_url + "rattacher_pj";
    $.ajax({
        url: lien,
        type: 'POST',
        data: formDataArray,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.status === 'success') {
                EnableButton();
                HideModal();
                showPopup(response.message, 'success');
            } else {
                EnableButton();
                showPopup('Error: ' + response.message, 'error');
            }
        },
        error: function (xhr, status, error) {
            EnableButton();
            showPopup('Error: ' + error, 'error');
        }
    })
};

function rtxAction() {
    DisableButton();
    var formElement = $('#unifiedForm')[0];
    var formDataArray = new FormData(formElement);
    var lien = base_url + "rtx";
    $.ajax({
        url: lien,
        type: 'POST',
        data: formDataArray,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.status === 'success') {
                $('#num_rtx_label').html('Dossier suivant : ' + response.rtx);
                EnableButton();
                HideModal();
                showPopup(response.message, 'success');
            } else {
                EnableButton();
                showPopup('Erreur: ' + response.message, 'error');
            }
        },
        error: function (xhr, status, error) {
            EnableButton();
            showPopup('Error ('+status+'): ' + error, 'error');
        }
    })
}
function RenvoieGeoAction() {
    DisableButton();
    var formElement = $('#unifiedForm')[0];
    var formDataArray = new FormData(formElement);
    var lien = base_url + "remise_geo";
    $.ajax({
        url: lien,
        type: 'POST',
        data: formDataArray,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.status === 'success') {
                EnableButton();
                HideModal();
                showPopup(response.message, 'success');
            } else {
                EnableButton();
                showPopup('Erreur: ' + response.message, 'error');
            }
        },
        error: function (xhr, status, error) {
            EnableButton();
            showPopup('Error ('+status+'): ' + error, 'error');
        }
    })
};
function AttrubutionAction() {
    DisableButton();
    var formElement = $('#unifiedForm')[0];
    var formDataArray = new FormData(formElement);
    var lien = base_url + "maj_dossier";
    $.ajax({
        url: lien,
        type: 'POST',
        data: formDataArray,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.status === 'success') {
                EnableButton();
                HideModal();
                showPopup(response.message, 'success');
            } else {
                EnableButton();
                showPopup('Error: ' + response.message, 'error');
            }
        },
        error: function (xhr, status, error) {
            EnableButton();
            showPopup('Error: ' + error, 'error');
        }
    })
};
document.getElementById("formDXFrep").addEventListener("submit", function(event) {
    event.preventDefault();
    dxfreperage(this);
}); 

function dxfreperage(formElement) {
    var formData = new FormData(formElement); // Récupère les données du formulaire, y compris le fichier

    // Vérifier si un fichier a bien été sélectionné
    var fileInput = $('#fileUpload')[0].files;
    if (fileInput.length === 0) {
        showPopup('Veuillez sélectionner un fichier DXF.', 'error');
        return;
    }

    $.ajax({
        url: base_url + "import_dxf_rep", // L'URL du serveur où envoyer la requête
        type: 'POST',
        data: formData,
        dataType: 'json', // Attente d'une réponse JSON
        processData: false, // Ne pas traiter les données (car c'est un fichier)
        contentType: false, // Ne pas définir le contentType (car c'est un fichier)
        beforeSend: function() {
            // Désactiver le bouton pour éviter plusieurs envois
            $('#formDXFrep button[type="submit"]').prop('disabled', true).text('En cours...');
        },
        success: function(response) {
            if (response.status === 'success') {
                //showPopup(response.message, 'success');

                // Si besoin, traiter les données de la réponse (ex: transformation des coordonnées)
                if (response.object) {
                    const projectedCoords = transformCoordinates(response.object);
                    var unprojectedCoords = unprojectArrayXYToMercator(projectedCoords);
                    unprojectedCoords = closePolygon(unprojectedCoords);
                    //console.log("Coordonnées reprojetées en EPSG:3857 :", unprojectedCoords);
                    
                    // Zoom sur les coordonnées
                    zoomToCoordinates(map, unprojectedCoords);
                    prepare_reperage(unprojectedCoords);
                }

                // Optionnel : Fermer le modal après succès
                $('#import-dxf-rep').modal('hide');
            } else {
                showPopup('Erreur : ' + response.message, 'error');
            }
        },
        error: function(xhr, status, error) {
            showPopup('Erreur AJAX : ' + status + ' - ' + error, 'error');
        },
        complete: function() {
            // Réactiver le bouton après traitement
            $('#formDXFrep button[type="submit"]').prop('disabled', false).text('Enregistrer');
        }
    });
};

$(window).on("load", function() {
    $.ajax({
        url: base_url + "polygone",
        type: "GET",
        data: { iddossier: document.getElementById('iddossier').value },
        success: function(response) {
            try {
                // Vérifier si la réponse est une chaîne JSON et la convertir
                let data = typeof response === "string" ? JSON.parse(response) : response;

                if (Array.isArray(data) && data.length > 0) {
                    //console.log(data);

                    // Transformer et reprojeter chaque polygone séparément
                    let allProjectedCoords = data.map(polygon => unprojectArrayXYToMercator(polygon));

                    // Zoomer sur l'ensemble des polygones
                    zoomToAllCoordinates(map, allProjectedCoords);
                }
            } catch (error) {
                console.error("Erreur lors de la conversion JSON :", error);
            }
        },
        error: function(xhr, status, error) {
            console.error("Erreur AJAX :", error);
        }
    });
});
