document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.sidebar .nav-link').forEach(function (element) {
        element.addEventListener('click', function (e) {
            let nextEl = element.nextElementSibling;
            let parentEl = element.parentElement;
            if (nextEl) {
                e.preventDefault();
                let mycollapse = new bootstrap.Collapse(nextEl);
                if (nextEl.classList.contains('show')) {
                    mycollapse.hide();
                } else {
                    mycollapse.show();
                    var opened_submenu = parentEl.parentElement.querySelector('.submenu.show');
                    if (opened_submenu) {
                        new bootstrap.Collapse(opened_submenu);
                    }
                }
            }
        });
    })
});

function showPopup(message, type) {
    const popup = document.getElementById('popup');
    let popupMessage = document.getElementById('popup-message');

    // Vérifier si popup-message existe, sinon le recréer
    if (!popupMessage) {
        popup.innerHTML = "";
        popupMessage = document.createElement('div');
        popupMessage.id = 'popup-message';
        popup.appendChild(popupMessage);  
    }

    // Réinitialiser les classes de popup
    popup.classList.remove('popup-success', 'popup-error');

    // Ajouter la classe appropriée
    popup.classList.add(type === 'error' ? 'popup-error' : 'popup-success');

    popupMessage.textContent = message;
    popup.classList.remove('hidden');

    // Cacher le popup après 3 secondes
    setTimeout(() => {
        popup.classList.add('hidden');
    }, 10000);

    // Ajouter l'événement de fermeture
    const closeButton = document.getElementById('close-popup');
    if (closeButton) {
        closeButton.addEventListener('click', function () {
            popup.classList.add('hidden');
        }, { once: true });
    }
}


function getPropertyCaseInsensitive(properties, key) {
    const lowerKey = key;
    for (let prop in properties) {
        if (prop.toLowerCase() === lowerKey.toLowerCase()) {
            return properties[prop]; // Retourne la valeur de la clé trouvée
        }
    }
    return 'N/A'; // Retourne 'N/A' si la clé n'existe pas
}

function showPopupPersiste(message, type, empieter) {
    const popup = document.getElementById('popup');
    const button_close = `<span class="col-6 text-end">
                            <button id="close-popup" class="close-btn">&times;</button>
                        </span>`;
    var en_tete;

    popup.classList.remove('popup-success', 'popup-error');
    
    if (type === 1) {
        en_tete = message;
        popup.classList.add('popup-error');
    } else {
        html = `<div class="row">
                    <div class = "col-10">${message}</div>
                    <div class = "col-2">${button_close}</div>
                </div>`
        popup.classList.add('popup-success');
    }

    const columnMapping = {
        'titre': ['numero', 'nom_propriete'],
        'demande': ['numero', 'nom_demandeur'],
        'titre_fianara': ['titre_req', 'propriete'],
        'fn_fianara': ['fn_fg', 'demandeur'],
        'cadastre': ['parcelle', 'section']
    };
    
    if (type === 1) {
        popup.innerHTML = "";
        let tableRows = '';
        for (let i = 0; i < empieter.length; i++) {
            let layer_name = empieter[i].id.split(".")[0].toLowerCase();
            let columns = columnMapping[layer_name];

            if (!columns) continue; // Évite les erreurs si la couche n'est pas définie

            let titreReq = getPropertyCaseInsensitive(empieter[i].properties, columns[0]);
            let propriete = getPropertyCaseInsensitive(empieter[i].properties, columns[1]);
            let area = getPropertyCaseInsensitive(empieter[i].properties, 'area');

            tableRows += `
            <tr>
                <td>${titreReq}</td>
                <td>${propriete}</td>
                <td>${area}</td>
            </tr>`;
        }
     
        html = `
        <div>
            <div class="card-header row d-flex align-items-baseline">

                <h6 class="col-6 text-center">${en_tete}</h6>

                <span class="col-6 text-end">
                    <button id="close-popup" class="close-btn">&times;</button>
                </span>
            </div>
            <div class="card-body table-responsive">
                <table class="table rounded" style="color:white;">
                    <thead>
                        <tr>
                            <th><strong>Numero</strong></th>
                            <th><strong>Nom</strong></th>
                            <th><strong>Contenance (m2)</strong></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>`;
    }

    popup.innerHTML = html;
    popup.classList.remove('hidden');

    document.getElementById('close-popup').addEventListener('click', function() {
        popup.classList.add('hidden');
    }, { once: true });
}

$("#form_send_email").submit(function (event) {
	event.preventDefault(); // Bloque la soumission par défaut
	send_email(); ///
});

function send_email() {
    var formElement = $('#unifiedForm')[0];
    var formDataArray = new FormData(formElement);
    var lien = base_url + "informe_usage";
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
                showPopup(response.message, 'success');
                var myModalEl = document.getElementById('ModalEmailSend');
                var modal = bootstrap.Modal.getInstance(myModalEl);
                modal.hide();
            } else {
                showPopup('Error: ' + response.message, 'error');
            }
        },
        error: function (xhr, status, error) {
            showPopup('Error: ' + error, 'error');
        }
    })
}