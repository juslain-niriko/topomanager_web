const traitement_dossier = $('#traitement_dossier');
const duree_en_interne_dossier = $('#duree_en_interne_dossier');
const procedure_dossier = $('#procedure_dossier');
const duree_traitement_dossier = $('#duree_traitement_dossier');
const date_entre_dossier = $('#date_entre_dossier');
const btnContainer = $('#btnContainer');
const nom_propriete_dossier = $('#nom_propriete_dossier');
const num_requisition_dossier = $('#num_requisition_dossier');
const origine_dossier = $('#origine_dossier');
const en_cause_dossier = $('#en_cause_dossier');
const commune_dossier = $('#commune_dossier');
const fkt_dossier = $('#fkt_dossier');
const lieu_dit_dossier = $('#lieu_dit_dossier');
const list_demandeur_dossier = $('#list_demandeur_dossier');
$('#editDossierBtn').on('click', enableEditMode);

function get_details() {
    const id = $("#iddossier").val();
    $.ajax({
        url: base_url + 'get_details_dossier',
        type: 'POST',
        data: {
            iddossier: id
        },
        dataType: 'json',
        success: function (data) {
            const origine = data['dossier'].numero_origine ? data['dossier'].numero_origine : data['dossier'].labeltypeorigine;
            traitement_dossier.text(data['dossier'].labeltraitement);
            duree_en_interne_dossier.text(data['dossier'].duree + " jours");
            procedure_dossier.text(data['dossier'].labelproc);
            duree_traitement_dossier.text(data['dossier'].delai + " jours");
            date_entre_dossier.text(formatDateToFrench(data['dossier'].dateentree));
            nom_propriete_dossier.text(data['dossier'].nom);
            num_requisition_dossier.text(data['dossier'].n_requisition);
            origine_dossier.text(origine);
            en_cause_dossier.text(data['dossier'].num_att);
            commune_dossier.text(data['dossier'].nomcommune);
            fkt_dossier.text(data['dossier'].nomfokontany);
            lieu_dit_dossier.text(data['dossier'].lieudit);
            list_demandeur_dossier.empty();
            var infos = [];
            data['demandeur_dossier'].forEach(row => {
                infos.push(row.nom);
                infos.push(row.prenoms);
                infos.push(row.iddemandeur);
                infos.push(row.tel);
                infos.push(row.email);
                line_checked.push(infos);
                const email = row.email ? row.email : '<span class="text-muted">(email non renseigné)</span>';
                const tel = row.tel ? row.tel : '<span class="text-muted">Non disponible</span>';
                let info_demandeur = `  
                <div class="row align-items-center mb-2">
                    <div class="col-auto">
                        <i class="fas fa-user-circle fa-2x text-muted"></i>
                    </div>
                    <div class="col">
                        <h6 class="mb-1 fw-bold">${row.nom + " " + row.prenoms}</h6>
                        <div class="d-flex flex-wrap gap-3">
                            <small class="text-muted">
                                <i class="fas fa-envelope me-1 text-danger"></i> ${email}
                            </small>
                            <small class="text-muted">
                                <i class="fas fa-phone me-1 text-success"></i> ${tel}
                            </small>
                        </div>
                    </div>
                </div>      
            `;
                list_demandeur_dossier.append(info_demandeur);
            });
            allerPage('debut');
        },
        error: function (xhr, status, error) {
            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'error',
                title: 'Impossible de charger les détails du dossier.\nVeuillez réessayer plus tard.',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        }
    });

}
function loadFokontany(id_commune) {
    var lien = base_url + "getFktBy_commune/" + id_commune;
    $.ajax({
        url: lien,
        method: "GET",
        dataType: "json",
    }).done(function (data) {
        const value = fkt_dossier.text().trim();

        const select = $('<select>', {
            class: 'form-select form-select-sm'
        });

        data.forEach(opt => {
            const option = $('<option>', {
                value: opt.idfokontany,
                text: opt.nomfokontany
            });
            if (opt.nomfokontany === value) {
                option.attr('selected', true);
            }
            select.append(option);
        });
        fkt_dossier.html(select);

    }).fail(function (error) {
        Swal.fire({
            toast: true,
            position: 'top',
            icon: 'error',
            title: 'Impossible de charger les fokontany.\nVeuillez réessayer plus tard.',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
    });
}

function enableEditMode() {
    changeToInput(nom_propriete_dossier);
    changeToInput(num_requisition_dossier);
    changeToInput(origine_dossier);
    changeToInput(en_cause_dossier);
    changeToInput(lieu_dit_dossier);
    $.ajax({
        url: base_url + 'get_commune_details_dossier',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            changeToSelect(commune_dossier, data['all_commune']);
            $('#commune_dossier select').on('change', function () {
                const id_commune = parseInt(this.value);
                if (!isNaN(id_commune)) {
                    loadFokontany(id_commune);
                }
            });
        },
        error: function (xhr, status, error) {
            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'error',
                title: 'Impossible de charger les communes.\nVeuillez réessayer plus tard.',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        }
    });

    btnContainer.html(`
        <div class="d-flex gap-2">
            <button id="saveBtn" class="btn btn-sm btn-outline-success d-flex align-items-center">
                <i class="fas fa-check me-1"></i> Valider
            </button>
            <button id="cancelBtn" class="btn btn-sm btn-outline-danger d-flex align-items-center">
                <i class="fas fa-times me-1"></i> Annuler
            </button>
        </div>
    `);

    $('#saveBtn').on('click', saveChanges);
    $('#cancelBtn').on('click', cancelChanges);
}


function saveChanges() {
    const value_nom_propriete_dossier = nom_propriete_dossier.find('input').val();
    const value_num_requisition_dossier = num_requisition_dossier.find('input').val();
    const value_origine_dossier = origine_dossier.find('input').val();
    const value_en_cause_dossier = en_cause_dossier.find('input').val();
    const value_commune_dossier = commune_dossier.find('select').val();
    const value_fkt_dossier = fkt_dossier.find('select').val();
    const value_lieu_dit_dossier = lieu_dit_dossier.find('input').val();
    const id = $("#iddossier").val();
    $.ajax({
        url: base_url + 'update_details_dossier',
        type: 'POST',
        data: {
            iddossier: id,
            nom_propriete: value_nom_propriete_dossier,
            num_requisition: value_num_requisition_dossier,
            origine: value_origine_dossier,
            en_cause: value_en_cause_dossier,
            id_commune: value_commune_dossier,
            id_fkt: value_fkt_dossier,
            lieu_dit_dossier: value_lieu_dit_dossier
        },
        dataType: 'json',
        success: function (data) {
            cancelChanges();
            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'success',
                title: 'Modification effectué',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true
            });
        }, error: function (xhr, status, error) {
            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'error',
                title: 'Une erreur est survenus lors de la modification.\nVeuillez réessayer plus tard.',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        }
    });
}

function cancelChanges() {
    traitement_dossier.empty();
    duree_en_interne_dossier.empty();
    procedure_dossier.empty();
    duree_traitement_dossier.empty();
    date_entre_dossier.empty();
    nom_propriete_dossier.empty();
    num_requisition_dossier.empty();
    origine_dossier.empty();
    en_cause_dossier.empty();
    commune_dossier.empty();
    fkt_dossier.empty();
    lieu_dit_dossier.empty();
    get_details();
    restoreEditButton();
}

function restoreEditButton() {
    btnContainer.html(`
        <button class="btn btn-sm btn-outline-primary d-flex align-items-center" id="editDossierBtn">
            <i class="fas fa-edit me-1"></i>
            <span>Modifier</span>
        </button>
    `);
    $('#editDossierBtn').on('click', enableEditMode);
}

function changeToSelect(span, options) {
    const value = span.text().trim();

    const select = $('<select>', {
        class: 'form-select form-select-sm'
    });

    options.forEach(opt => {
        const option = $('<option>', {
            value: opt.idcommune,
            text: opt.nomcommune
        });
        if (opt.nomcommune === value) {
            loadFokontany(opt.idcommune);
            option.attr('selected', true);
        }
        select.append(option);
    });
    span.html(select);
}


function changeToInput(span) {
    const value = span.text().trim();
    const input = $('<input>', {
        type: 'text',
        class: 'form-control form-control-sm',
        value: value
    });
    span.html(input);
}


function changeToSpan(span) {
    const input = span.find('input');
    const value = input.val().trim();
    span.empty();
    span.text(value);
}


function formatDateToFrench(dateStr) {
    const mois = [
        "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];

    const [year, month, day] = dateStr.split('-');
    const nomMois = mois[parseInt(month) - 1];

    return `${day} ${nomMois} ${year}`;
}
