let currentPage = 1;
let totalPages = 1;
const limit = 6;
var lineiscreated = false;
let mots_cle = "";


function fetchData(page) {
    $.ajax({
        url: base_url_demandeur + "get_Data",
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
    const table = $('#attQryTableDemandeur');
    table.html('');
    data.forEach(row => {
        let checked = "";
        let style_row = "";

        if (line_checked.some(requerant => requerant[2] === row["id"])) {
            checked = "checked";
            style_row = "selected_row";
        }

        let tr = `
            <tr class="${style_row}" style="cursor: pointer; ">
            <input type="hidden" value="${row["id"]}" name="id_demandeur">
            <td class="py-1">
                <input class="form-check-input select-button" type="checkbox" name="check" ${checked}>
            </td>`
            ;
        for (let val in row) {
            if (val != 'id') {
                tr += `<td>${row[val]}</td>`;
            }
        }
        tr += `
            <td>
                <button type="button" class="btn btn-outline-primary btn-sm edit-button"
                    onclick="edit_demandeur(this)">
                    <i class="mdi mdi-pencil-box-outline"></i>
                </button>
            </td>`
            ;
        tr += '</tr>';
        table.append(tr);
    });
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

function find_demandeur() {
    const table = $('#attQryTableDemandeurs');
    mots_cle = $("#search_demandeurs").val();

    if (mots_cle.trim() === "") {
        allerPage("debut");
    } else {
        fetchData(1);
    }
}

function add_requerant() {
    const btn_add_to_dossier = $('#ajoute_req_dossier').is(':checked');
    const new_nom = $('#new_nom').val();
    const new_prenom = $('#new_prenom').val();
    const new_Adresse = $('#new_Adresse').val();
    const new_cin = $('#new_cin').val();
    const new_date = $('#new_date').val();
    const new_lieu_cin = $('#new_lieu_cin').val();
    const new_tel = $('#new_tel').val();
    const new_email = $('#new_email').val();
    $.ajax({
        url: base_url_demandeur + "add_demandeur_json",
        type: 'POST',
        data: {
            nom: new_nom,
            prenom: new_prenom,
            adresse: new_Adresse,
            cin: new_cin,
            date: new_date,
            lieu_cin: new_lieu_cin,
            tel: new_tel,
            email: new_email
        },
        dataType: 'json',
        success: function (response) {
            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'success',
                title: 'Enregistrement effectué',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true
            });

            if (btn_add_to_dossier) {
                var infos = [];
                const id = response.id.toString();
                infos.push(new_nom);
                infos.push(new_prenom);
                infos.push(id);
                line_checked.push(infos);
            }
            $('#new_nom').val('');
            $('#new_prenom').val('');
            $('#new_Adresse').val('');
            $('#new_cin').val('');
            $('#new_date').val('');
            $('#new_lieu_cin').val('');
            $('#new_tel').val('');
            $('#new_email').val('');
            allerPage('debut');
            $('#close_modal_add_req').click();

        },
        error: function () {
            alert("Une Erreur est survenu lors de l'insertion du requérant.");
        }
    });
}

function convertCellsToInputs(row) {
    const cells = row.querySelectorAll('td:not(:last-child)');
    cells[1].innerHTML = `<td><input type="text" placeholder="Nom" class="form-control form-control-sm" value="${cells[1].textContent.trim()}"></td>`;
    cells[2].innerHTML = `<td><input type="text" placeholder="Prénom" class="form-control form-control-sm" value="${cells[2].textContent.trim()}"></td>`;
    cells[3].innerHTML = `<td><input type="text" placeholder="Adresse" class="form-control form-control-sm" value="${cells[3].textContent.trim()}"></td>`;
    cells[4].innerHTML = `<td><input type="text" placeholder="CIN" class="form-control form-control-sm" value="${cells[4].textContent.trim()}"></td>`;
    cells[5].innerHTML = `<td><input type="date" class="form-control form-control-sm" value="${cells[5].textContent.trim()}"></td>`;
    cells[6].innerHTML = `<td><input type="text" placeholder="Fait à" class="form-control form-control-sm" value="${cells[6].textContent.trim()}"></td>`;
    cells[7].innerHTML = `<td><input type="text" placeholder="Téléphone" class="form-control form-control-sm" value="${cells[7].textContent.trim()}"></td>`;
    cells[8].innerHTML = `<td><input type="text" placeholder="Email" class="form-control form-control-sm" value="${cells[8].textContent.trim()}"></td>`;
}


function convertInputsToCells(row) {
    const inputs = row.querySelectorAll('td:not(:last-child) input');
    const data = [row.querySelector('input[type="hidden"]').value];

    inputs.forEach(input => {
        const cell = input.closest('td');
        if (input.type === 'checkbox') {
            cell.innerHTML = `<input class="form-check-input select-button" type="checkbox" name="check" ${input.checked ? 'checked' : ''}>`;
        } else {
            cell.textContent = input.value;
            data.push(input.value);
        }
    });

    return data;
}

function edit_demandeur(button) {
    if (!button) return;
    const row = button.closest('tr');
    const id_demandeur = row.querySelector('input[type="hidden"]').value;
    var lien = base_url_demandeur + "update_demandeur_json";

    if (button.classList.contains('btn-outline-primary')) {
        convertCellsToInputs(row);
        button.classList.remove('btn-outline-primary');
        button.classList.add('btn-outline-success');
        button.innerHTML = `<i class="mdi mdi-check"></i>`;
    } else {
        const data = convertInputsToCells(row);

        fetch(lien, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        button.classList.remove('btn-outline-success');
        button.classList.add('btn-outline-primary');
        button.innerHTML = `<i class="mdi mdi-pencil-box-outline"></i>`;
    }
}

$(document).on('click', '#attQryTableDemandeur tr', function (e) {
    const row = this;
    const checkbox = $(row).find('.select-button')[0];
    const hiddenInputValue = row.querySelector('input[type="hidden"]').value;
    const nom = row.children[2].textContent.trim();
    const prenom = row.children[3].textContent.trim();
    const tel = row.children[8].textContent.trim();
    const email = row.children[9].textContent.trim();
    const isSelected = row.dataset.selected === 'true';
    var infos = [];

    if (isSelected) {
        line_checked = line_checked.filter((line) => line[2] !== hiddenInputValue);
        row.dataset.selected = 'false';
        row.classList.remove('selected_row');
        if (checkbox) checkbox.checked = false;
    } else {
        infos.push(nom);
        infos.push(prenom);
        infos.push(hiddenInputValue);
        infos.push(tel);
        infos.push(email);

        line_checked.push(infos);
        row.dataset.selected = 'true';
        row.classList.add('selected_row');
        if (checkbox) checkbox.checked = true;
    }
});

// Validation de la sélection
function valider_selection() {
    if (line_checked.length === 0) {
        return;
    }
    const id = $("#iddossier").val();
    const list_demandeur_dossier = $('#list_demandeur_dossier');

    $.ajax({
        url: base_url_demandeur + "update_req_dossier",
        type: 'POST',
        data: {
            iddossier: id,
            iddemandeur: line_checked,
        },
        dataType: 'json',
        success: function (response) {
            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'success',
                title: 'Modification Requérant effectué',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true
            });
            list_demandeur_dossier.empty();
            for (let requerant of line_checked) {
                const email = requerant[4] ? requerant[4] : '<span class="text-muted">(email non renseigné)</span>';
                const tel = requerant[3] ? requerant[3] : '<span class="text-muted">Non disponible</span>';
                let info_demandeur = `  
                        <div class="row align-items-center mb-2">
                            <div class="col-auto">
                                <i class="fas fa-user-circle fa-2x text-muted"></i>
                            </div>
                            <div class="col">
                                <h6 class="mb-1 fw-bold">${requerant[0]} ${requerant[1]}</h6>
                                <div class="d-flex flex-wrap gap-3">
                                    <small class="text-muted">
                                        <i class="fas fa-envelope me-1 text-danger"></i> ${email} 
                                    </small>
                                    <small class="text-muted">
                                        <i class="fas fa-phone me-1 text-success"></i> ${tel} 
                                    </small>
                                </div>
                            </div>
                            <div class="col">
                                <button type="button" onclick="remove_selection(this)" class="btn btn-outline-danger btn-sm">Supprimer</button>
                            </div>
                        </div>      
                    `;
                list_demandeur_dossier.append(info_demandeur);
            }
        },
        error: function () {
            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'error',
                title: 'Une erreur est survenus lors de la modification.\nVeuillez réessayer plus tard.',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true
            });
        }
    });
}

$('#new_nom').on({

    keypress: function (key) {
        if ((key.charCode < 65 || key.charCode > 90) && (key.charCode < 97 || key.charCode >
            122) && key.charCode != 32) {
            $('#alertNom').html('<small>le nom ne doit contenir que des lettres!</small>');
            setTimeout(() => {
                $('#alertNom').html('');
            }, 1500);

            return false;
        } else {
            $('#alertNom').html('');
        }

    },
    keyup: function () {
        $(this).val($(this).val().toUpperCase());
    }
});

$('#new_prenom').on('input', function () {
    let val = $(this).val();
    if (/[^a-zA-Z\s]/.test(val)) {
        $('#alertPrenom').html('<small>Le prénom ne doit contenir que des lettres !</small>');
        setTimeout(() => {
            $('#alertPrenom').html('');
        }, 1500);
        val = val.replace(/[^a-zA-Z\s]/g, '');
    } else {
        $('#alertPrenom').html('');
    }
    val = val.replace(/\b\w/g, function (l) { return l.toUpperCase(); });
    $(this).val(val);
});
