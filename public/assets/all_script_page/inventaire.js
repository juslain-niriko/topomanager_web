let currentPage = 1;
let totalPages = 1;
const limit = 8;
let mots_cle = "";
const table_invent_calque = $('#list_event_calque');


allerPage('debut');
function fetchData(page) {
    $.ajax({
        url: base_url + "get_Data_calque",
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
    table_invent_calque.html('');
    if (data.length >= 1) {
        data.forEach(row => {
            let tr = `
                <tr>
                <td>${row['nom_calque']}</td>
                <td>${row['section']}</td>
                <td>${row['canton']}</td>
                <td>${row['lieu_dit']}</td>
                <td>${row['num_parcelle']}</td>               
                <td class="text-center">
                        <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal"
                            data-bs-target="#modal_modification"
                            onclick="getCalqueById(${row['id_calque']})">
                            <i class="mdi mdi-square-edit-outline"></i>
                        </button>
                    </td>
                </tr>
            `;
            table_invent_calque.append(tr);
        });
    } else {
        let tr = `<tr><td class="text-muted h6" colspan="5" style="text-align:center;color: #0f3659;">Aucun Résultat</td></tr>`;
        table_invent_calque.append(tr);
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

function find_calque() {
    mots_cle = $("#search_calque").val();
    if (mots_cle.trim() === "") {
        allerPage("debut");
    } else {
        fetchData(1);
    }
}

//FONCTION DE RECUPERATION DE DONNE
function getCalqueById(id) {
    $.ajax({
        url: base_url + "get_calque_id",
        type: "POST",
        data: { id: id },
        dataType: "json",
        success: function (data) {
            if (data) {
                $('#modalmodifLabel').text("MODIFICATION CALQUE");
                $('#id_calque').val(data.id_calque);
                $('#nom_calque_modif').val(data.nom_calque);
                $('#section_modif').val(data.section);
                $('#canton_modif').val(data.canton);
                $('#lieu_dit_modif').val(data.lieu_dit);
                $('#num_parcelle_modif').val(data.num_parcelle);
                $('#modal_modification').modal('show');
                // console.log("Données reçues :", data);
            } else {
                alert("Aucune donnée trouvée.");
            }
        },
        error: function () {
            alert("Erreur lors de la récupération.");
        }
    });
}


//SUBMIT
$('#form_calque').on('submit', function (e) {
    e.preventDefault(); // empêche le rechargement de la page
    AjoutEtModif();
});
//FUNCTION D UPDATE ET AJOUT
function AjoutEtModif() {
    const id_calque = $('#id_calque').val();
    const nom_calque = $('#nom_calque_modif').val();
    const section = $('#section_modif').val();
    const canton = $('#canton_modif').val();
    const lieu_dit = $('#lieu_dit_modif').val();
    const num_parcelle = $('#num_parcelle_modif').val();
    const regexInvalide = /[<*>=+≤≥=≈≠≡±_×÷⁄%‰″∂∏∑√∞¬∩]/
    const champ = [nom_calque, section, canton, lieu_dit, num_parcelle];
    let invalide = false;

    for (let i = 0; i <= champ.length; i++) {
        $(`#invalid-feedback${i}`).hide();
    }

    for (let i = 0; i <= champ.length; i++) {
        if (regexInvalide.test(champ[i])) {
            $(`#invalid-feedback${i + 1}`).show();
            invalide = true;
        }
    }

    if (invalide) {
        console.log('Erreur : données invalides');
        return;
    }

    let url = "";
    if (id_calque === "") {
        url = base_url + "add_calque";
    } else {
        url = base_url + "update_calque";
    }
    // Envoi AJAX
    $.ajax({
        url: url,
        type: 'POST',
        data: {
            id_calque: id_calque,
            nom_calque: nom_calque,
            section: section,
            canton: canton,
            lieu_dit: lieu_dit,
            num_parcelle: num_parcelle
        },
        dataType: "json",
        success: function (response) {
            if (response.status == "success") {
                Swal.fire({
                    toast: true,
                    position: 'top',
                    icon: 'success',
                    title: 'Action effectué',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true
                });
            } else if (response.status == "error") {
                Swal.fire({
                    toast: true,
                    position: 'top',
                    icon: 'success',
                    title: ' Elément déjà éxistant',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true
                });
            }
            $('#modal_modification').modal('hide');
            allerPage("debut");
        },
        error: function () {
            alert("Erreur lors de la modification ou l insertion ou dossier  ");
        }
    });
}


//function d ouverture de modal ajout vide 
function openAddModal() {
    $('#modalmodifLabel').text("AJOUT CALQUE");
    $('#id_calque').val('');
    $('#nom_calque_modif').val('');
    $('#section_modif').val('');
    $('#canton_modif').val('');
    $('#lieu_dit_modif').val('');
    $('#num_parcelle_modif').val('');
    $('#modal_modification').modal('show');
}


$('#form_calqueInput').on('submit', function (e) {
    e.preventDefault(); // empêche le rechargement de la page
    Import();
});

function Import() {
    let form = $('#form_calqueInput')[0];
    let formData = new FormData(form);

    Swal.fire({
        title: 'Importation en cours...',
        didOpen: () => {
            Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false
    });

    $.ajax({
        url: base_url + 'import_calque',
        type: 'POST',
        data: formData,
        dataType: "json",
        processData: false, // Ne pas transformer les données
        contentType: false,
        success: function (reponse) {
            Swal.fire({
                toast: true,
                position: 'top',
                icon: reponse.status === 'success' ? 'success' : 'error',
                title: reponse.message,
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true
            });
            if (reponse.status === 'success') {
                $('#modalinput').modal('hide');
                $('#form_calqueInput')[0].reset();
                allerPage("debut");
            }
            if (reponse.status === 'error') {
                $('#modalinput').modal('hide');
                $('#form_calqueInput')[0].reset();
                allerPage("debut");
            }

        },
        error: function () {
            alert("Erreur lors de la modification ou l insertion ou dossier  ");
        },
    });
}