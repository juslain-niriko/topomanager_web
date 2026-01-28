let currentPage = 1;
let totalPages = 1;
const limit = 9;
let mots_cle = "";
const table_ge = $('#attQryTableGe');
const title_modal = $('#staticBackdropLabel');
const num_ordre = $('#num_ordre');
const nom_prenom = $('#nom_prenom');
const adresse_cabinet = $('#adresse_cabinet');
const tel = $('#tel');
const e_mail = $('#e_mail');
const image_ = $('#image');
const file = $('#file');
let action_post = "";
const action_ = $('#ajout_ge');

allerPage('debut');

function getGeById(id_geometre) {
    var lien = base_url + "get_ge/" + encodeURIComponent(id_geometre);

    $.ajax({
        url: lien,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            title_modal.html('Modification Geomètre');
            $.each(data, function (i, obj) {
                num_ordre.val(obj.numero_ordre);
                nom_prenom.val(obj.nom_prenom);
                adresse_cabinet.val(obj.adresse_cabinet);
                tel.val(obj.tel);
                e_mail.val(obj.mail);
                image_.attr('src', obj.path_photo);
                action_post = base_url + "edit_ge" + parseInt(obj.id_geometre);
                action_.attr('action', action_post);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('AJAX request failed:', jqXHR, textStatus, errorThrown);
            let tr = `<tr><td colspan="6" class="text-muted h5" style="text-align:center;">Aucun Résultat</td></tr>`;
            table_ge.html(tr);
        }
    });
};

function clearFields() {
    title_modal.html('Nouveau Geomètre');
    num_ordre.val('');
    nom_prenom.val('');
    adresse_cabinet.val('');
    tel.val('');
    e_mail.val('');
    image_.attr('src', '#');
    file.val('');
    action_post = base_url + "add_ge";
    action_.attr('action', action_post);
};

function deleteGe(id_geometre) {
    let result = confirm("Souhaitez-vous vraiment supprimer le Géomètre?");
    if (result == true) {
        var lien = base_url + "delete_ge/" + encodeURIComponent(id_geometre);
        $.ajax({
            url: lien,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                window.location.href = base_url + 'list_ge/1';
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('AJAX request failed:', jqXHR, textStatus, errorThrown);
            }
        });
    }
};

var image = document.getElementById("image");

// La fonction previewPicture
var previewPicture = function (e) {
    const [picture] = e.files

    if (picture) {
        image.src = URL.createObjectURL(picture)
    }
};

//numero ordre existant on non 
function check_ge() {
    var num_ordre = $('#num_ordre').val();
    let Datas = new FormData();
    Datas.append("num_ordre", num_ordre);
    lien = base_url + "check_ge";

    if (num_ordre != '' && actual_num_ordre != num_ordre) {
        $.ajax({
            url: lien,
            type: "POST",
            data: Datas,
            cache: false,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (data) {
                if (data == 1) {
                    $('#alertLog').html("Ce numero d'ordre est déja utilisé.");
                    $('#enregistrer_geometre').attr('disabled', 'disabled');
                } else {
                    $('#alertLog').html('');
                    $('#enregistrer_geometre').removeAttr('disabled');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('AJAX request failed:', jqXHR, textStatus, errorThrown);
            }
        });
    }
};

function fetchData(page) {
    $.ajax({
        url: base_url + "get_Data_ge",
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
    table_ge.html('');
    if (data.length >= 1) {
        data.forEach(row => {
            let tr = `<tr>`;
            for (let val in row) {
                if (val != 'id_geometre') {
                    tr += `<td>${row[val]}</td>`;
                }
            }
            tr += `
                <td class="text-center">
                    <button type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                        class="btn btn-outline-primary btn-sm"
                        onclick="getGeById(${row['id_geometre']})">
                        <i class="mdi mdi-square-edit-outline"></i>
                    </button>
                </td>
            `;
            tr += '</tr>';
            table_ge.append(tr);
        });
    } else {
        let tr = `<tr><td class="text-muted h6" colspan="6" style="text-align:center;color: #0f3659;">Aucun Résultat</td></tr>`;
        table_ge.append(tr);
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

function find_ge() {
    mots_cle = $("#search_ge").val();

    if (mots_cle.trim() === "") {
        allerPage("debut");
    } else {
        fetchData(1);
    }
}