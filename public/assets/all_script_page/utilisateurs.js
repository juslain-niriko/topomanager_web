let currentPage = 1;
let totalPages = 1;
let mots_cle = "";
const limit = 8;
const table_user = $('#attQryTableUser');
const title_modal = $('#staticBackdropLabel');
const nom = $('#nom');
const prenoms = $('#prenoms');
const login = $('#login');
const password = $('#paswoord');
const tel = $('#tel');
const cin = $('#cin');
const mail = $('#mail');
let action_post = "";
const form_action = $('#form_user');
allerPage('debut');

document.querySelector('#password').addEventListener('input', function (event) {
    const message = document.querySelector('#message');

    if (event.target.value.length === 8) {
        message.style.display = 'block';
    } else {
        message.style.display = 'none';
    }
});

function getDemandeurById(id_user) {
    var lien = base_url + "edit_user/" + encodeURIComponent(id_user);

    $.ajax({
        url: lien,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            title_modal.html('Modification Demandeur');
            $.each(data, function (i, obj) {
                nom.val(obj.nom);
                prenoms.val(obj.prenoms);
                login.val(obj.cin);
                password.val(obj.datecin);
                tel.val(obj.lieucin);
                cin.val(obj.tel);
                mail.val(obj.tel);
                action_post = base_url + "update_user/" + parseInt(obj.idutilisateur);
                form_action.attr('action', action_post);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('AJAX request failed:', jqXHR, textStatus, errorThrown);
            table_user.html("");
            table_user.html(
                '<tr><td colspan="6" style="text-align:center;">Aucun Résultat</td></tr>');
        }
    });
};

function clearFields() {
    title_modal.html('Ajout demandeur');
    nom.val("");
    prenoms.val("");
    login.val("");
    password.val("");
    tel.val("");
    cin.val("");
    mail.val("");
    action_post = base_url + "add_user";
    form_action.attr('action', action_post);
};

// Fonction pour activer/désactiver le bouton "Enregistrer"
function toggleSubmitButton() {
    const cinErrors = validatecin($('#cin').value);
    const passwordErrors = validatePassword($('#password').value);
    const submitButton = $('#submitButton');

    // Si des erreurs sont présentes, on désactive le bouton
    if (cinErrors.length > 0 || passwordErrors.length > 0) {
        submitButton.disabled = true;
    } else {
        submitButton.disabled = false;
    }
}

function validatecin(pw) {
    const isOnlyDigits = /^\d+$/.test(pw);
    const isExactly12Digits = /^\d{12}$/.test(pw);
    let errors = [];
    if (!isOnlyDigits) errors.push("seulement des chiffres");
    if (!isExactly12Digits) errors.push("il doit contenir 12 chiffre");
    return errors;
}

$('#cin').addEventListener('input', function () {
    const password = this.value;
    const errors = validatecin(password);
    const feedback = $('#cinFeedback');

    if (errors.length > 0) {
        feedback.textContent = `Le cin est invalide: ${errors.join(',')}.`;
        feedback.className = 'error';
    } else {
        feedback.textContent = 'Le cin est valide.';
        feedback.className = 'valid';
    }
    toggleSubmitButton(); // Vérifier l'état du bouton après chaque modification
});


function validatePassword(pw) {
    const hasUpperCase = /[A-Z]/.test(pw);
    const hasLowerCase = /[a-z]/.test(pw);
    const hasDigit = /\d/.test(pw);
    const hasSpecialChar = /[@#$%^&*]/.test(pw);
    let errors = [];

    if (!hasUpperCase) errors.push("une majuscule");
    if (!hasLowerCase) errors.push("une minuscule");
    if (!hasDigit) errors.push("un chiffre");
    //if (!hasSpecialChar) errors.push("un caractère spécial");

    return errors;
}

$('#password').addEventListener('input', function () {
    const password = this.value;
    const errors = validatePassword(password);
    const feedback = $('#passwordFeedback');

    if (errors.length > 0) {
        feedback.textContent = `Le mot de passe doit contenir : ${errors.join(', ')}.`;
        feedback.className = 'error';
    } else {
        feedback.textContent = 'Le mot de passe est valide.';
        feedback.className = 'valid';
    }
    toggleSubmitButton(); // Vérifier l'état du bouton après chaque modification
});

$('#confirmPassword').addEventListener('input', function () {
    const password = $('#password').value;
    const confirmPassword = this.value;
    const feedback = $('#confirmFeedback');

    if (confirmPassword !== password) {
        feedback.textContent = 'Les mots de passe ne correspondent pas.';
        feedback.className = 'error';
    } else {
        feedback.textContent = 'Les mots de passe correspondent.';
        feedback.className = 'valid';
    }
});

$('#passwordForm').addEventListener('submit', function (event) {
    const password = $('#password').value;
    const confirmPassword = $('#confirmPassword').value;
    const errors = validatePassword(password);

    if (errors.length > 0 || password !== confirmPassword) {
        event.preventDefault();
        alert('Veuillez corriger les erreurs avant de soumettre.');
    }
});

function fetchData(page) {
    $.ajax({
        url: base_url + "get_data_user",
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
    table_user.html('');
    let isvalide = "";
    let action = "";
    if (data.length >= 1) {
        data.forEach(row => {
            if (row['valide'] == 0) {
                isvalide = '<h4><i class="text-danger mdi mdi-lock-outline"></i></h4>';
                action = `
                    <a class="text-success"
                        href="${base_url + 'chgstate_user/1/' + row['idutilisateur']}">
                        <h4><i class="mdi mdi-lock-open-outline"></i></h4>
                    </a>
                `;
            } else {
                isvalide = '<h4><i class="text-success mdi mdi-lock-open-outline"></i></h4>';
                action = `
                    <a class="text-danger"
                        href="${base_url + 'chgstate_user/0/' + row['idutilisateur']}">
                        <h4><i class="mdi mdi-lock-outline"></i></h4>
                    </a>
                `;
            }

            let tr = `  
                <tr>
                    <td>${row['user']}</td>
                    <td class="text-center">${row['cin']}</td>
                    <td class="text-center">${row['mail']}</td>
                    <td class="text-center">${row['labeltype']}</td>
                    <td class="text-center">${isvalide}</td>
                    <td class="text-center">${action}</td>
                </tr>        
            `;

            table_user.append(tr);
        });
    } else {
        let tr = `<tr><td class="text-muted h6" colspan="6" style="text-align:center;color: #0f3659;">Aucun Résultat</td></tr>`;
        table_user.append(tr);
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

function find_user() {
    mots_cle = $("#search_user").val();

    if (mots_cle.trim() === "") {
        allerPage("debut");
    } else {
        fetchData(1);
    }
}