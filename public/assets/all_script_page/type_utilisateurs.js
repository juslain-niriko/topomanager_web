let currentPage = 1;
let totalPages = 1;
let mots_cle = "";
const limit = 9;
const table_type_user = $('#attQryTableTypeUser');
const title_modal = $('#staticBackdropLabel');
const type = $('#type').val('');
let action_post = "";

allerPage('debut');

function clearFields() {
    title_modal.html('Ajout Type Utilisateur');
    type.val('');
    action_post = base_url + "new_group";
    $('#form_type_user').attr('action', action_post);
};

function getTypeUserById(id_demandeur) {
    var lien = base_url + "edit_group/" + encodeURIComponent(id_demandeur);

    $.ajax({
        url: lien,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            title_modal.html('Modification Type Utilisateur');
            $.each(data, function (i, obj) {
                type.val(obj.labeltype);
                action_post = base_url + "update_group/" + parseInt(obj
                    .idtypeuser);
                $('#form_type_user').attr('action', action_post);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('AJAX request failed:', jqXHR, textStatus, errorThrown);
        }
    });
};

function fetchData(page) {
    $.ajax({
        url: base_url + "get_Data_type_user",
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
    table_type_user.html('');
    if (data.length >= 1) {
        data.forEach(row => {
            tr = `
                <tr>
                    <td>${row['labeltype']}</td>
                    <td class="text-center">
                        <button type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                            class="btn btn-outline-primary btn-sm"
                            onclick="getTypeUserById(${row['idtypeuser']})">
                            <i class="mdi mdi-square-edit-outline"></i>
                        </button>
                    </td>
                </tr>
            `;
            table_type_user.append(tr);
        });
    } else {
        let tr = `<tr><td class="text-muted h6" colspan="2" style="text-align:center;color: #0f3659;">Aucun Résultat</td></tr>`;
        table_type_user.append(tr);
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

function find_type_user() {
    mots_cle = $("#search_type_user").val();
    if (mots_cle.trim() === "") allerPage("debut");
    else fetchData(1);
}