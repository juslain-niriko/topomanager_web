$("#formSearchAllDossier").submit(function (event) {
    event.preventDefault();
    find_dossier_rtx($('#rtx_all_dossier').val(), $('#dm_search').val(), $('#type-traitement').val(), $('#date_debut').val(), $('#date_fin').val(), $('#type-procedure').val());
});

function find_dossier_rtx(rtx, dm, type_traitement, date_debut, date_fin, procedure) {
    const table = $('#attQryTableDossier');
    table.html('');
    var lien = base_url + "find_dossier_rtx_all_utilisateur";
    var detail_url = base_url + "detail_suivie_dossier/";

    $.ajax({
        url: lien,
        type: 'POST',
        data: {
            mot_cle: rtx,
            demandeur: dm,
            type_traitement: type_traitement,
            date_debut: date_debut,
            date_fin: date_fin,
            procedure: procedure,
        },
        dataType: 'json',
        success: function (data) {
            if (data.length === 0) {
                table.html('<tr><td class="text-muted h6" colspan="11" style="text-align:center;color: #0f3659;">Aucun Résultat</td></tr>');
            } else {
                $("#attQryTableDossier").empty();
                $.each(data, function (i, obj) {
                    var demandeurs = typeof obj.demandeurs === 'string' ? JSON.parse(obj.demandeurs) : obj.demandeurs;
                    var nom_prenom = "";
                    if (demandeurs.length > 1) {
                        nom_prenom = demandeurs[0].nom + ' ' + demandeurs[0].prenoms + ' (...)'
                    } else {
                        nom_prenom = demandeurs[0].nom + ' ' + demandeurs[0].prenoms
                    }

                    let tr = `
                        <tr onclick="window.location.href='${detail_url}${obj.iddossier}';" style="cursor: pointer;">
                            <td class="py-1">${obj.rtx}</td>
                            <td class="py-1">${obj.numero_origine}</td>
                            <td class="py-1">${obj.num_att}</td>
                            <td class="py-1">${obj.nom_propriete}</td>
                            <td class="py-1">${obj.labeltraitement}</td>
                            <td class="py-1">${obj.labelproc}</td>
                            <td class="text-center">${obj.delai}</td>
                            <td >${nom_prenom}</td>
                            <td class="py-1">${obj.duree}</td>
                            <td class="py-1">${obj.dateentree}</td>
                            <td style="background-color:${obj.color};">${obj.info}</td>
                        </tr>
                    `;
                    table.append(tr);
                });
            }
        },
        error: function (textStatus, errorThrown) {
            table.html('<tr><td colspan="3">Une erreur est survenue!</td></tr>');
            console.error('AJAX request failed:', textStatus, errorThrown);
        }
    });
}

function debounce(func, delay) {
    let timer;
    return function () {
        const context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(context, args), delay);
    };
}

const debouncedSearch = debounce(() => {
    find_dossier_rtx(
        $('#rtx_all_dossier').val(),
        $('#dm_search').val(),
        $('#type-traitement').val(),
        $('#date_debut').val(),
        $('#date_fin').val(),
        $('#type-procedure').val()
    );
}, 500);

// Sur tous les champs :
$('#rtx_all_dossier, #type-traitement, #date_debut, #date_fin ,#type-procedure').on('input change', debouncedSearch);
$('#dm_search').on('change', debouncedSearch); // select2 déclenche 'change'
