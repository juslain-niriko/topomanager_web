let currentPage = 1;
let totalPages = 1;
const limit = 8;
var lineiscreated = false;
let mots_cle = "";
var line_checked = [];

allerPage('debut');

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

// Ajout d'une nouvelle ligne
function confirmAddLine() {
    Swal.fire({
        title: "Ajouter un nouveau demandeur ?",
        text: "Voulez-vous vraiment ajouter cette ligne ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, ajouter !",
        cancelButtonText: "Annuler"
    }).then((result) => {
        if (result.isConfirmed) {
            // add_line(); // Si l'utilisateur confirme, on ajoute la ligne
            Swal.fire("Ajouté !", "Une nouvelle ligne a été ajoutée.", "success");
        }
    });
}

function add_line() {
    if (lineiscreated) {
        alert("mokary o");
        return;
    }
    const tableBody = document.getElementById('attQryTableDemandeur');
    if (!tableBody) return;
    lineiscreated = true;
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <input type="hidden"  name="id_demandeur">
        <td class="py-1">
            <input class="form-check-input select-button" type="checkbox" name="check[]">
        </td>
        <td>
            <input type="text" placeholder="Nom" id="nom" class="form-control form-control-sm">
            <span class="text-warning" id="alertNom"></span>
        </td>
        <td>
            <input type="text" placeholder="Prénom" id="prenom" class="form-control form-control-sm">
            <span class="text-warning" id="alertPrenom"></span>
        </td>
            <td><input type="text" placeholder="Adresse" class="form-control form-control-sm"></td>
        <td>
            <input type="text" placeholder="CIN" id="cin" class="form-control form-control-sm">
            <span class="text-warning" id="alertCin"></span>
        </td>
        <td>
            <input type="date" id="date" class="form-control form-control-sm">
            <span class="text-warning" id="alertDate"></span>
        </td>
        <td><input type="text" placeholder="Fait à" class="form-control form-control-sm"></td>
        <td>
            <input type="text" placeholder="Téléphone" id="tel" class="form-control form-control-sm">
            <span class="text-warning" id="alertTel"></span>
        </td>
        <td>
            <input type="text" placeholder="Email" id="email" class="form-control form-control-sm">
            <span class="text-danger" id="alertEmail"></span>
        </td>
        <td>
        <button type="button" class="btn btn-outline-success btn-sm" onclick="add_demandeur(this)" disabled><i class="mdi mdi-check"></i></button>
        <button type="button" class="btn btn-outline-secondary btn-sm" onclick="cancel(this)" disabled><i class="mdi mdi-close"></i></button>
        </td>
    `;

    tableBody.appendChild(newRow);
    newRow.style.opacity = 0;
    setTimeout(() => {
        newRow.style.opacity = 1;
        newRow.style.transition = "opacity 0.5s ease-in-out";
    }, 100);

    // $('#nom').on({

    //     keypress: function (key) {
    //         if ((key.charCode < 65 || key.charCode > 90) && (key.charCode < 97 || key.charCode >
    //             122) && key.charCode != 32) {
    //             $('#alertNom').html('<small>le nom ne doit contenir que des lettres!</small>');
    //             setTimeout(() => {
    //                 $('#alertNom').html('');
    //             }, 1000);

    //             return false;
    //         } else {
    //             $('#alertNom').html('');
    //         }

    //     },
    //     keyup: function () {
    //         $(this).val($(this).val().toUpperCase());
    //     }
    // });

    // $('#prenom').on({
    //     keypress: function (key) {
    //         if ((key.charCode < 65 || key.charCode > 90) && (key.charCode < 97 || key.charCode >
    //             122) && key.charCode != 32) {
    //             $('#alertPrenom').html('<small>le prenom ne doit contenir que des lettres!</small>');
    //             setTimeout(() => {
    //                 $('#alertPrenom').html('');
    //             }, 1000);
    //             return false;
    //         } else {
    //             $('#alertPrenom').html('');
    //         }

    //     }
    // });

    // $('#cin').on({
    //     keypress: function (key) {
    //         if (key.charCode < 48 || key.charCode > 57) {
    //             $('#alertCin').html('<small>le numero cin ne doit contenir que des chiffres!</small>');
    //             setTimeout(() => {
    //                 $('#alertCin').html('');
    //             }, 1000);
    //             return false;
    //         }
    //         if (($('#cin').val().length > 11)) {
    //             $('#alertCin').html('<small>le numéro cin doit être égale à 11 chiffres</small>');
    //             setTimeout(() => {
    //                 $('#alertCin').html('');
    //             }, 1000);
    //             return false;
    //         }
    //     }
    // });

    // $('#date').on('change', function () {
    //     $('#alertDate').html('');
    //     let birthDate = new Date($(this).val());
    //     let today = new Date();
    //     let age = today.getFullYear() - birthDate.getFullYear();
    //     let monthDiff = today.getMonth() - birthDate.getMonth();
    //     let dayDiff = today.getDate() - birthDate.getDate();

    //     if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    //         age--;
    //     }

    //     if (age < 18) {
    //         $('#alertDate').html("<small>Vous devez avoir au moins 18 ans.</small>");
    //         $(this).val("");
    //     }

    // });

    // $('#tel').on({
    //     keypress: function (key) {
    //         if (key.charCode < 48 || key.charCode > 57) {
    //             $('#alertTel').html('<small>le numero ne doit contenir que des chiffres!</small>');
    //             setTimeout(() => {
    //                 $('#alertTel').html('');
    //             }, 1000);
    //             return false;
    //         }
    //         if (($('#tel').val().length > 9)) {
    //             $('#alertTel').html('<small>le numéro doit être égale à 10 chiffres</small>');
    //             setTimeout(() => {
    //                 $('#alertTel').html('');
    //             }, 1000);
    //             return false;
    //         }
    //     }
    // });

    // $('#email').on('blur', function () {
    //     let email = $(this).val();
    //     let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //     if (email !== '' && !regex.test(email)) {
    //         $('#alertEmail').html('<small style="color: red;">Adresse e-mail invalide.</small>');
    //         $(this).css('border', '2px solid red');
    //     } else {
    //         $('#alertEmail').html('');
    //         $(this).css('border', '2px solid green');
    //     }
    // });

}

//Insertion demandeur
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
                icon: response.status,
                title: response.message,
                showConfirmButton: false,
                timer: 3000,
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
        error: function (response) {
            alert("Une Erreur est survenu lors de l'insertion du requérant.");
        }
    });
}

// Fonction pour convertir les cellules en champs de saisie
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

// Fonction pour désactiver les champs de saisie et restaurer les valeurs dans les cellules
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

// Fonction principale pour gérer l'édition d'un demandeur
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

// Suppression de la sélection
function remove_selection(button) {
    if (!button) return;
    const row = button.closest('tr');

    if (row) {
        const id_usager_ = row.children[0].value;
        line_checked = line_checked.filter((line) => line[2] !== id_usager_.trim());
        document.querySelectorAll('.select-button:checked').forEach(checkbox => {
            const originalRow = checkbox.closest('tr');
            originalRow.classList.remove('selected_row');
            const id_usager_originalRow = originalRow.children[0].value
            if (id_usager_originalRow == id_usager_) {
                checkbox.checked = false;
            }
        });
        row.remove();
    }
}

//setColor row checked
$(document).on('click', '#attQryTableDemandeur tr', function (e) {
    const row = this;
    const checkbox = $(row).find('.select-button')[0];
    const hiddenInputValue = row.querySelector('input[type="hidden"]').value;
    const nom = row.children[2].textContent.trim();
    const prenom = row.children[3].textContent.trim();
    const isSelected = row.dataset.selected === 'true';
    var infos = [];

    if (isSelected) {
        // line_checked = line_checked.filter((line) => line !== hiddenInputValue);
        line_checked = line_checked.filter((line) => line[2] !== hiddenInputValue);
        row.dataset.selected = 'false';
        row.classList.remove('selected_row');
        if (checkbox) checkbox.checked = false;
    } else {
        infos.push(nom);
        infos.push(prenom);
        infos.push(hiddenInputValue);

        // line_checked.push(hiddenInputValue);
        line_checked.push(infos);
        row.dataset.selected = 'true';
        row.classList.add('selected_row');
        if (checkbox) checkbox.checked = true;
    }
});

// Validation de la sélection
function valider_selection() {
    document.querySelector('#selectedRequerantsTable tbody').innerHTML = "";

    for (let requerant of line_checked) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <input type="hidden" value="${requerant[2]}" name="id_demandeur[]">
            <td>${requerant[0]} ${requerant[1]}</td>
            <td><button type="button" onclick="remove_selection(this)" class="btn btn-outline-danger btn-sm">Supprimer</button></td>
        `;
        document.querySelector('#selectedRequerantsTable tbody').appendChild(newRow);
    }
    // document.querySelectorAll('.select-button:checked').forEach(checkbox => {
    //     const row = checkbox.closest('tr');
    //     const newRow = document.createElement('tr');
    //     const hiddenInputValue = row.querySelector('input[type="hidden"]').value;
    //     const nom = row.children[2].textContent.trim();
    //     const prenom = row.children[3].textContent.trim();
    //     newRow.innerHTML = `
    //         <input type="hidden" value="${hiddenInputValue}" name="id_demandeur[]">
    //         <td>${nom} ${prenom}</td>
    //         <td><button type="button" onclick="remove_selection(this)" class="btn btn-outline-danger btn-sm">Supprimer</button></td>
    //     `;
    //     document.querySelector('#selectedRequerantsTable tbody').appendChild(newRow);
    // });
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
