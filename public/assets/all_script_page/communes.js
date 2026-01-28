let currentPage = 1;
let totalPages = 1;
const limit = 9;
let mots_cle = "";
const table_commune = $('#attQryTableCommune');

allerPage('debut');

function getCommuneById(idcommune) {
    var lien = base_url + "update_commune";
    $('#traitement_commune').html('Modification Commune');

    $.ajax({
        url: lien,
        type: 'POST',
        data: { id: idcommune },
        dataType: 'json',
        success: function (data) {
            $('#nom_commune').val(data.nomcommune);
            $('#code').val(data.codecommune);
            let action_post = base_url + "edit_commune/" + parseInt(data.idcommune);
            $('#form_commune').attr('action', action_post);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('AJAX request failed:', jqXHR, textStatus, errorThrown);
        }
    });
}

function clearFields() {
    $('#traitement_commune').html('Nouveau commune');
    $('#nom_commune').val('');
    $('#code').val('');
    let action_post = base_url+"add_commune";
    $('#form_commune').attr('action', action_post);
};

function fetchData(page) {
    $.ajax({
        url: base_url + "get_data_commune",
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
    table_commune.html('');
    if (data.length > 1) {
        data.forEach(row => {
            let tr = `  
                <tr style="cursor: pointer; ">
                    <td>${row['nomcommune']}</td>
                    <td class="text-center">${row['codecommune']}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal"
                            data-bs-target="#modal_commune"
                            onclick="getCommuneById(${row['idcommune']})">
                            <i class="mdi mdi-square-edit-outline"></i>
                        </button>
                    </td>
                </tr>        
            `;
            table_commune.append(tr);
        });
    } else {
        let tr = `<tr><td class="text-muted h6" colspan="3" style="text-align:center;color: #0f3659;">Aucun Résultat</td></tr>`;
        table_commune.append(tr);
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

function find_commune() {
    mots_cle = $("#search_commune").val();

    if (mots_cle.trim() === "") {
        allerPage("debut");
    } else {
        fetchData(1);
    }
}