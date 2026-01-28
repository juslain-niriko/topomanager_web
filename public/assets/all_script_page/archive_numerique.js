$(document).ready(function () {
    function performSearch() {
        let searchTerm = $('#search_titre').val().toUpperCase();
        let selectedCommune = $('#select_commune').val(); // Récupérer la commune sélectionnée

        $.ajax({
            url: searchUrl,
            type: 'POST',
            data: {
                mots_cle: searchTerm,
                commune: selectedCommune // Envoyer la commune sélectionnée
            },
            dataType: 'json',
            success: function (data) {
                let liste = $('#liste_dossier');
                liste.empty(); // Nettoyage avant d'ajouter les nouveaux résultats

                if (data.length === 0) {
                    liste.append('<p class="text-center text-muted h5 py-4">Aucun résultat trouvé.</p>');
                    return;
                }

                $.each(data, function (index, item) {
                    let dossierHtml = `
                        <div class="col-md-3 mb-4">
                            <a href="${baseUrl}${item}" class="text-decoration-none">
                                <div class="folder-card">
                                    <i class="fas fa-folder folder-icon"></i>
                                    <h6 class="mt-3">${item}</h6>
                                </div>
                            </a>
                        </div>
                    `;
                    liste.append(dossierHtml);
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Erreur AJAX :', textStatus, errorThrown);
            }
        });
    }

    // Lancer la recherche lors de la saisie dans le champ texte
    $('#search_titre').on('keyup', performSearch);

    // Lancer la recherche lors du changement de la sélection
    $('#select_commune').on('change', performSearch);
});