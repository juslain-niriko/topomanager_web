let currentPage = 1;
let totalPages = 1;
const limit = 9;
let mots_cle = "";
const table_cir = $('#attQryTableCir');

allerPage('debut');

function clearFields() {
    $('#parametre_label').html('Ajout Circonscription');
    $('#label').val("");
    $('#code').val("");
    $('#service').html("");
    list_service.forEach(function (service) {
        $('#service').append(`
        <option value="${service.id}">${service.label}</option>
       `);
    });
    let action_post = base_url + "new_cir";
    $('#form_cir').attr('action', action_post);
};

async function getCirById(id) {
    var lien = base_url + "edit_circonscription/" + encodeURIComponent(id);

    $.ajax({
        url: lien,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#parametre_label').html('Modification Circonscription');
            $('#service').html("");
            $.each(data, function (i, obj) {
                $('#label').val(obj.label);
                $('#code').val(obj.code);
                var id_service = obj.id_service;
                list_service.forEach(function (service) {
                    if (id_service == service.id) {
                        $('#service').append(`
                            <option value="${service.id}" selected>${service.label}</option>
                        `);
                    } else {
                        $('#service').append(`
                            <option value="${service.id}">${service.label}</option>
                        `);
                    }
                });
                var action_post = base_url + "update_circonscription/" + parseInt(obj.id);
                $('#form_cir').attr('action', action_post);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('AJAX request failed:', jqXHR, textStatus, errorThrown);
        }
    });
};

function fetchData(page) {
    $.ajax({
        url: base_url + "get_Data_cir",
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
    table_cir.html('');
    if (data.length >= 1) {
        data.forEach(row => {
            let tr = `
                <tr> 
                    <td>${row['label']}</td>   
                    <td>${row['code']}</td>   
                    <td>${row['srt']}</td>   
                    <td class="text-center">
                        <button type="button" data-bs-toggle="modal" data-bs-target="#modal_parametre"
                            class="btn btn-outline-primary btn-sm"
                            onclick="getCirById(${row['id']})">
                            <i class="mdi mdi-square-edit-outline"></i>
                        </button>
                    </td>
                </tr>
            `;
            table_cir.append(tr);
        });
    } else {
        let tr = `<tr><td class="text-muted h6" colspan="6" style="text-align:center;color: #0f3659;">Aucun Résultat</td></tr>`;
        table_cir.append(tr);
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

function find_cir() {
    mots_cle = $("#search_cir").val();

    if (mots_cle.trim() === "") {
        allerPage("debut");
    } else {
        fetchData(1);
    }
}



