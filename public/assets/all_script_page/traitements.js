let currentPage = 1;
let totalPages = 1;
let mots_cle = "";
const limit = 9;
const table_procedures = $('#list_procedures');
const table_traitement = $('#attQryTableTraitement');
const transaction = $('#transaction');
const transaction_element = $('#custom_vvt');
const majoration = $('#majoration');
const majoration_element = $('#custom_majoration');
allerPage('debut');

document.addEventListener("DOMContentLoaded", function () {
    const form = $('#form_traitement');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(form);
        fetch(form.getAttribute('action'), {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    message = data.message;
                    showPopup(message, 'success');
                    var myModalEl = $('#modal_traitement');
                    var modal = bootstrap.Modal.getInstance(myModalEl);
                    modal.hide();
                } else {
                    alert('Erreur lors de l\'enregistrement : ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Une erreur est survenue lors de l\'envoi des données.');
            });
    });
});

async function getTraitementById(id_type_traitement) {
    try {
        table_procedures.html('');

        const traitementResponse = await fetch(base_url + "edit_type_traitement/" + encodeURIComponent(id_type_traitement));
        if (!traitementResponse.ok) throw new Error('Failed to fetch traitement data');
        const traitementData = await traitementResponse.json();

        $('#traitement_label').html('Modification Traitement');
        let liste_proc = [];

        $('#nom_traitement').val(traitementData[0].labeltraitement);
        $('#droit_fixe').val(traitementData[0].droitfixe);
        $('#droit_conservation').val(traitementData[0].droitconservation);
        $('#pu_plan').val(traitementData[0].pu_plan);
        $('#p_fourniture').val(traitementData[0].p_fourniture);

        if (traitementData[0].transaction === 't') {
            $("#transaction").prop("checked", true);
            $('#vvt').val(traitementData[0].vvt);
            $('#custom_vvt').css("display", "block");
        }

        if (traitementData[0].majorationprix > 0) {
            $("#majoration").prop("checked", true);
            $('#prix_majoration').val(traitementData[0].majorationprix);
            $('#surface_majore').val(traitementData[0].majorationsurface_hectare);
            $('#custom_majoration').css("display", "block");
        }

        traitementData.forEach(obj => {
            liste_proc.push(obj.idproc);
        });

        const proceduresResponse = await fetch(base_url + "all_procedure");
        if (!proceduresResponse.ok) throw new Error('Failed to fetch procedures data');
        const proceduresData = await proceduresResponse.json();

        proceduresData.forEach(obj => {
            const checked = liste_proc.includes(obj.idproc) ? "checked" : "";
            table_procedures.append(
                `<label class="col-sm-5 mt-2">
                    <input class="form-check-input" type="checkbox" name="check[]" value="${obj.idproc}" ${checked}>
                    ${obj.labelproc}
                </label>
                <div class="col-sm-1 mt-2">
                    <input type="text" name="delai_${obj.idproc}"
                        value="${obj.delai}" class="form-control form-control-sm">
                </div>`
            );
        });

        const action_post = base_url + "update_type_traitement/" + parseInt(traitementData[0].idtraitement);
        $('#form_traitement').attr('action', action_post);

    } catch (error) {
        console.error('Error:', error);
    }
}

async function clearFields() {
    $('#traitement_label').html('Ajout Traitement');
    $('#nom_traitement').val("");
    table_procedures.html("");

    const proceduresResponse = await fetch(base_url + "all_procedure");
    if (!proceduresResponse.ok) throw new Error('Failed to fetch procedures data');
    const proceduresData = await proceduresResponse.json();

    proceduresData.forEach(obj => {
        table_procedures.append(
            `<label class="col-sm-5 mt-2">
                    <input class="form-check-input" type="checkbox" name="check[]" value="${obj.idproc}">
                    ${obj.labelproc}
            </label>
            <div class="col-sm-1 mt-2">
                <input type="text" name="delai_${obj.idproc}"
                    value="${obj.delai}" class="form-control form-control-sm">
            </div>`
        );
    });
    let action_post = base_url + "new_type_traitement";
    $('#form_traitement').attr('action', action_post);
};

// Écouteur d'événement pour détecter les changements d'état
transaction.addEventListener('change', function () {
    if (transaction.checked) {
        transaction_element.style.display = "block";
    } else {
        transaction_element.style.display = "none";
    }
});

// Écouteur d'événement pour détecter les changements d'état
majoration.addEventListener('change', function () {
    if (majoration.checked) majoration_element.style.display = "block";
    else majoration_element.style.display = "none";
});

//Gestion affichage liste et recherche avec pagination
function fetchData(page) {
    $.ajax({
        url: base_url + "get_data_traitement",
        type: 'GET',
        data: { page: page, limit: limit, search: mots_cle },
        dataType: 'json',
        success: function (response) {
            totalPages = Math.ceil(response.total / limit);
            currentPage = page;
            renderTable(response.data);
            updatePaginationControls();
        },
        error: function () {
            alert("Erreur lors du chargement des données.");
        }
    });
}

function renderTable(data) {
    table_traitement.html('');
    if (data.length >= 1) {
        data.forEach(row => {
            let tr = `
                <tr>
                    <td>${row['labeltraitement']}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal"
                            data-bs-target="#modal_traitement"
                            onclick="getTraitementById(${row['idtraitement']})">
                            <i class="mdi mdi-square-edit-outline"></i>
                        </button>
                    </td>
                </tr>
            `;
            table_traitement.append(tr);
        });
    } else {
        let tr = `<tr><td class="text-muted h6" colspan="2" style="text-align:center;color: #0f3659;">Aucun Résultat</td></tr>`;
        table_traitement.append(tr);
        totalPages = 1;
        updatePaginationControls();
    }
}

function updatePaginationControls() {
    $('#currentPageInput').val(currentPage);
    let select = $('#selectPage');
    select.html('');
    for (let i = 1; i <= totalPages; i++) {
        let selected = i === currentPage ? 'selected' : '';
        select.append(`<option value="${i}" ${selected}>${i}/${totalPages}</option>`);
    }
}

function changerPage(direction) {
    if (direction === 'suivant' && currentPage < totalPages) {
        fetchData(currentPage + 1);
    } else if (direction === 'precedent' && currentPage > 1) {
        fetchData(currentPage - 1);
    }
}

function allerPage(position) {
    if (position === 'debut') fetchData(1);
    else if (position === 'fin') fetchData(totalPages);
}

function allerPageSelect() {
    const page = parseInt($('#selectPage').val());
    fetchData(page);
}

function find_traitement() {
    mots_cle = $("#search_traitement").val();
    if (mots_cle.trim() === "") allerPage("debut");
    else fetchData(1);
}