document.addEventListener('DOMContentLoaded', function () {
    var unifiedModal = document.getElementById('unifiedModal');
    var modalTitle = unifiedModal.querySelector('.modal-title');
    var additionalFields = document.getElementById('additionalFields');
    var modal_button = document.getElementById('modal_button');
    var PU_plan,droitFixe_droitConservation_PForuniture,montant_total;

    // Fonctions pour chaque type de bouton
    function setupPayementModal(objet) {
        //console.log(objet);

        modalTitle.textContent = 'Acquittement des droit et frais';
        modal_button.innerHTML = `
          <button type="button" class="btn btn-secondary" id="closebuton" data-bs-dismiss="modal">Fermer</button>
          <button type="button" class="btn btn-primary" id="savebuton" onclick="PayementAction(this)">Enregistrer</button> 
      `;

        PU_plan = `            
            <div class="form-group row  mb-2">
                <div class="col-sm-8 ">
                    <div class="row">
                        <label class="col-sm-6"> 
                            Prix unitaire plan (AR)
                        </label>
                        <div class="col-sm-6">
                            <input type="number"disabled value = "`+objet.pu_plan+`" class="form-control" id="Pplan">
                        </div>
                    </div> 
                </div>
                <div class="col-sm-4">
                    <div class="row">
                        <label class="col-sm-2"> 
                        Nbr
                        </label>
                        <div class="col-sm-10">
                            <input type="number" class="form-control" id="nbr_plan">
                        </div>
                    </div> 
                </div>
            </div>
        `;

        surface = `
        <div class="form-group row  mb-2">
            <label class="col-sm-4"> 
                Surface du terrain (Ha)
            </label>
            <div class="col-sm-8">
                <input type="number" class="form-control" id="surface">
            </div>
        </div>
        `
        transaction = `
        <div class="form-check form-switch mb-2">
            <label class="form-check-label" for="transaction">Avec transaction</label>
            <input class="form-check-input" type="checkbox" id="transaction">
        </div>
        `

        total = `
        <div class="form-group row mb-2">
            <label class="col-sm-4 "> Montant total: </label>
            <div class="col-sm-8">
                <input type="text" readonly="true" value="" class="form-control" id="montant_total" name="montant_total">
            </div>
        </div>
        `

        droitFixe_droitConservation_PForuniture = `
            <div class="form-group row mb-2">
                <label class="col-sm-4 ">Date</label>
                <div class="col-sm-8">
                    <input type="date" name="date_payement" placeholder="Date" class="form-control" value="`+ date + `"required="" readonly="true">
                </div>
            </div>
            <div class="form-group row mb-2">
                <label class="col-sm-4 ">Droit Fixe (AR)</label>
                <div class="col-sm-8">
                    <input type="number"  readonly="true" value = "`+objet.droitfixe+`" class="form-control" id="DroitFixe">
                </div>
            </div>
            <div class="form-group row  mb-2">
                <label class="col-sm-4 ">Droit de conservation (AR)</label>
                <div class="col-sm-8">
                    <input type="number"  readonly="true" value = "`+objet.droitconservation+`" class="form-control" id="DroitConservation">
                </div>
            </div>
            <div class="form-group row  mb-2">
                <label class="col-sm-4 ">Fourniture necessaire (AR)</label>
                <div class="col-sm-8">
                    <input type="number"  readonly="true" value = "`+objet.p_fourniture+`" class="form-control" id="Fourniture">
                </div>
            </div>
        `;

        if(objet.pu_plan != 0){
             droitFixe_droitConservation_PForuniture = droitFixe_droitConservation_PForuniture + PU_plan
        }

        if(objet.majorationprix != 0){
            droitFixe_droitConservation_PForuniture = droitFixe_droitConservation_PForuniture + surface
        }

        droitFixe_droitConservation_PForuniture = droitFixe_droitConservation_PForuniture + total

        if(objet.transaction != 'f'){
            droitFixe_droitConservation_PForuniture = droitFixe_droitConservation_PForuniture + transaction
        } 

        additionalFields.innerHTML = droitFixe_droitConservation_PForuniture;

        calculateMontantTotal(objet);

        document.getElementById("nbr_plan")?.addEventListener("keyup", function () {
            nbr_plan__(objet.PU_plan);
            calculateMontantTotal(objet);
        });

        document.getElementById("surface")?.addEventListener("keyup", function (){
            calculateMontantTotal(objet);
        });
        document.getElementById("transaction")?.addEventListener("change", function(){
            calculateMontantTotal(objet);
        } );
    }

    function setupVerificationPiecesModal(num) {
        modalTitle.textContent = 'Vérification';
        modal_button.innerHTML = `
          <button type="button" class="btn btn-secondary" id="closebuton" data-bs-dismiss="modal">Fermer</button>
          <button type="button" class="btn btn-primary" id="savebuton" onclick="VerificationPiecesAction()">Enregistrer</button>                              
      `;
    
        // Prépare le champ num_verification avec ou sans readonly selon num
        let numVerificationInput = `<input name="num_verification" id="num_verification" type="text" class="form-control"`;
        if (num && num.trim() !== "") {
            numVerificationInput += ` value="${num}" readonly`;
        }
        numVerificationInput += `>`;
    
        let checkboxesHtml = '';
        let lien = base_url + "get_list_pieces";
    
        $.ajax({
            url: lien,
            method: "GET",
            dataType: "json",
        })
        .done(function (response) {
            let data = JSON.stringify(response);
            $.each(JSON.parse(data), function (i, obj) {
                checkboxesHtml += `
                 <div class="col-sm-6 form-check form-check-primary">
                     <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" name="pieces_fournie[]" value="${obj.id_pieces_dossier}">
                     ${obj.label_pieces}<i class="input-helper"></i>
                     </label>
                 </div>`;
            });
    
            additionalFields.innerHTML = `
                <div class="form-group row mt-2">
                    <div class="col-sm-12 mb-2">
                        <h6 class="h6 text-center" style="text-decoration:underline; font-weight:bold;">
                                Les pièces existantes dans le dossier avant vérification (CONDITIONS de recevabilité 8 du dossier)
                        </h6>
                    </div>                                
                    ${checkboxesHtml}
                </div>
                <div class="form-group row">
                    <label class="col-sm-4">Numéro de vérification</label>
                    <div class="col-sm-8">
                        ${numVerificationInput}
                    </div>
                </div>
                <div class="form-group row mt-2">
                    <label class="col-sm-4 ">Date</label>
                    <div class="col-sm-8">
                        <input name="date" type="datetime-local" value="` + date + `" class="form-control" required readonly>
                    </div>
                </div>
                <div class="form-group row mt-2">
                    <label class="col-sm-4 ">Observations</label>
                    <div class="col-sm-8 ">
                        <textarea class="form-control" name="observ" id="exampleTextarea1" rows="1"></textarea>
                    </div>
                </div> 
              `;
        })
        .fail(function (error) {
            alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
        });
    }
    
    function setupImpressionFacture() {
        modalTitle.textContent = 'Impression de facture';
        modal_button.innerHTML = `
        <button type="button" class="btn btn-secondary" id="closebuton" data-bs-dismiss="modal">Refuser</button>
        <button type="button" class="btn btn-primary" id="savebuton" onclick="ImpressionFactureAction()">Valider</button>                              
        `;
        additionalFields.innerHTML = `
        <div class="form-group row">
            <div>
                <p>Voulez vous vraiment faire une impression Facture</p>
            </div>
        </div>
      `;
    }

    function setupSendDossierModal(obs) {
        let action_post = site_url + "/send_dossier";
        $('#unifiedForm').attr('action', action_post);
        modalTitle.textContent = 'Transfert Dossier';
        modal_button.innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            <button type="submit" class="btn btn-primary">Transférer</button>                              
        `;
    
        let ProcedureHtml = "";
        liste_procedure.forEach(function (procedure) {
            ProcedureHtml += `<option value="${procedure.idproc}">${procedure.labelproc}</option>`;
        });
    
        let TypeUserHtml = "";
        type_users.forEach(function (user) {
            TypeUserHtml += `<option value="${user.idtypeuser}">${user.labeltype}</option>`;
        });
    
        additionalFields.innerHTML = `
            <div class="form-group row">
                <label class="col-sm-4">Prochaine étape<span class="text-danger">*</span></label>
                <div class="col-sm-8">
                    <select class="form-control" id="type_proc" name="id_proc">
                        ${ProcedureHtml}
                    </select>
                </div>
            </div>
            <div class="form-group row mt-2">
                <label class="col-sm-4">Date Envoie</label>
                <div class="col-sm-8">
                    <input name="dateenvoie" type="datetime-local" class="form-control" value="${date}" required readonly>
                </div>
            </div>
            <div class="form-group row mt-2">
                <label class="col-sm-4">Fonction prochain responsable<span class="text-danger">*</span></label>
                <div class="col-sm-8">
                    <select class="form-control" id="type_user_1" name="id_type_user">
                        ${TypeUserHtml}
                    </select>
                </div>
            </div>
            <div class="form-group row mt-2">
                <label class="col-sm-4">Prochain responsable<span class="text-danger">*</span></label>
                <div class="col-sm-8">
                    <select class="form-control" id="list_user_1" name="id_user">
                    </select>
                </div>
            </div>
            <div class="form-group row mt-2">
                <label class="col-sm-4">Observations</label>
                <div class="col-sm-8">
                    <textarea class="form-control" name="observ" id="observ" rows="2">${obs}</textarea>
                </div>
            </div>
        `;

        if (current_user_type != 12) {
            $("#type_proc").val("23");
            $("#type_user_1").val("12");
            obs = "Retour du dossier au secretaire technique\n" + obs;
            $("#observ").val(obs);
        }
    
        // Quand on change le type utilisateur
        $("#type_user_1").off("change").on("change", function () {
            $('#list_user_1').html("");
            var id_typeuser = $("#type_user_1").val();
            var lien = base_url + "get_user_type/" + parseInt(id_typeuser);
    
            $.ajax({
                url: lien,
                method: "GET",
                dataType: "json",
            })
            .done(function (response) {
                if (response.length > 0) {
                    $.each(response, function (i, obj) {
                        $('#list_user_1').append("<option value='" + obj.idutilisateur + "'>" + obj.nom_user + "</option>");
                    });
                    // Sélectionner automatiquement le premier utilisateur de la liste
                    $('#list_user_1').val(response[0].idutilisateur);
                }
            })
            .fail(function (error) {
                alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
            });
        });
    
        // Déclenche le chargement de la liste des utilisateurs en fonction du type sélectionné
        $("#type_user_1").trigger("change");
    }
    

    function setupremiseModal() {
        let action_post = site_url+"/remise_dossier";
        $('#unifiedForm').attr('action', action_post);
        modalTitle.textContent = 'Remise Définitive';
        modal_button.innerHTML = `
      <button type="button" class="btn btn-secondary" id="closebuton" data-bs-dismiss="modal">Fermer</button>
      <button type="submit" class="btn btn-primary" id="savebuton" >Enregistrer</button>                              
        `;
        additionalFields.innerHTML = `
        <div class="form-group row">
            <label class="col-sm-4 ">Date</label>
            <div class="col-sm-8">
                <input name="date_remise" value="`+ date + `" type="date" class="form-control" readonly="true">
            </div>
        </div>
        <div class="form-group row mt-2">
            <label class="col-sm-4 ">Observations</label>
            <div class="col-sm-8 ">
                <textarea class="form-control" name="observ" rows="2"></textarea>
            </div>
        </div>
      `;
    }

    function setupSatisfactionModal() {
        modalTitle.textContent = 'Satisfaction des notes';
        modal_button.innerHTML = `
      <button type="button" class="btn btn-secondary" id="closebuton" data-bs-dismiss="modal">Fermer</button>
      <button type="button" class="btn btn-primary" id="savebuton" onclick="SatisfactionAction()">Enregistrer</button>                              
        `;
        additionalFields.innerHTML = `
        <div class="form-group row">
            <label class="col-sm-4 ">Date</label>
            <div class="col-sm-8">
                <input name="date_satisfaction" type="date" value="`+date+`" class="form-control" required="" readonly="true">
            </div>
        </div>
        <div class="form-group row mt-2">
            <label class="col-sm-4 ">Observations</label>
            <div class="col-sm-8 ">
                <textarea style="background-color: #f4f5fa; border:1px solid #c9c8c8;" class="form-control" name="observ" id="exampleTextarea1" rows="2"></textarea>
            </div>
        </div>
      `;
    }

    function setupVisaModal(data) {
        modalTitle.textContent = 'VISA';
        modal_button.innerHTML = `
      <button type="button" class="btn btn-secondary" id="closebuton" data-bs-dismiss="modal">Fermer</button>
      <button type="button" class="btn btn-primary" id="savebuton" onclick="VisaAction()">Enregistrer</button>                              
        `;
        additionalFields.innerHTML = `
        <div class="form-group row">
            <label class="col-sm-4 ">Date</label>
            <div class="col-sm-8">
                <input name="date_visa" type="date" value="`+date+`" class="form-control" required="" readonly="true">
            </div>
        </div>
        <div class="form-group row mt-2">
            <label class="col-sm-4">Type visa</label>
            <div class="col-sm-8" id = "visa_list"></div>
        </div>
        <div class="form-group row mt-2">
            <label class="col-sm-4 ">Note (Observations)</label>
            <div class="col-sm-8 ">
                <textarea class="form-control" name="observ" id="exampleTextarea1" rows="2"></textarea>
            </div>
        </div>
      `;
        // Remplir le tableau avec les données des géomètres
        let visa_list = document.getElementById('visa_list');
        for (let i = 0; i < data.length; i++) {
            let row = `
                <div>
                    <input type="checkbox" id="radio_visa${data[i].id_visa}" name="visa[]" value="${data[i].id_visa}">
                    <label class="p" for="radio_visa${data[i].id_visa}">${data[i].label_visa}</td>
                </div>
            `;
            visa_list.innerHTML += row;
        }
    }

    function setupRenvoieGeoModal() {
        modalTitle.textContent = 'Retour dossier géomètre expert';
        modal_button.innerHTML = `
            <button type="button" class="btn btn-secondary" id="closebuton" data-bs-dismiss="modal">Fermer</button>
            <button type="button" class="btn btn-primary" id="savebuton" onclick="RenvoieGeoAction()">Enregistrer</button>                              
        `;
        additionalFields.innerHTML = ` 
         <div class="form-group row mt-2">
              <label class="col-sm-4 ">Date de retour</label>
            <div class="col-sm-8">
                <input name="date" type="date" placeholder="Date" class="form-control" value="`+ date + `" required readonly="true">
            </div>
        </div>
        <div class="form-group row mt-2">
            <label class="col-sm-4 ">Observations</label>
            <div class="col-sm-8 ">
                <textarea class="form-control" name="obs" rows="2"></textarea>
            </div>
        </div>
      `;
    }

    function prepareEmpietementObservation(features) {
        let texto = ""; // Utilisation de let
    
        if (features.length > 0) {
            let concatText = 'Empieter avec ';
            for (let i = 0; i < features.length; i++) {
                const feature = features[i];
                const properties = feature.properties;
                const title = properties.FN_FG || properties.Titres_Req || 'Inconnu';
                concatText += title + ' / ';
            }
    
            // Supprimer le dernier " / " à la fin
            texto = concatText.slice(0, -3);
        }
    
        return texto;
    }
    
    function setupReperageModal(text) {
        modalTitle.textContent = 'Mention de repérage';
        modal_button.innerHTML = `
      <button type="button" class="btn btn-secondary" id="closebuton" data-bs-dismiss="modal">Fermer</button>
      <button type="button" class="btn btn-primary" id="savebuton" onclick="ReperageAction()">Enregistrer</button>                              
        `;
        additionalFields.innerHTML = `
            <div class="form-group row mt-2">
                <label class="col-4">Type de repérage</label>
                <div class="col-8">
                    <select class="form-control" id="type_reperage" name="type_reperage">
                        <option value="1">Reperage préalable</option>
                        <option value="2">Second Reperage</option>
                        <option value="3">Autres</option>
                    </select>
                    <input name="path_dxf" type="hidden" id="path_dxf" class="form-control" value="`+localStorage.getItem('path')+`"/>
                </div>
            </div>

            <div class="form-group row mt-2" id="autres_rep_id">
                <label class="col-4">Nom du repérage</label>
                <div class="col-8">
                    <input name="autres_reperage" type="text" class="form-control"/>
                </div>
            </div>

            <div class="form-group row mt-2">
                <label class="col-4 ">Date</label>
                <div class="col-8">
                    <input name="date_reperage" id="date_reperage" type="date" value="`+date+`" readonly="true"
                        class="form-control" required />
                </div>
            </div>
            <div class="form-group row mt-2">
                <label class="col-4 ">Numéro</label>
                <div class="col-8">
                    <input name="num_reperage" id="num_reperage" type="text" value="" class="form-control" placeholder="Numéro de repérage" required />
                </div>
            </div>
            <div class="form-group row mt-2">
                <label class="col-4 ">Mention de repérage</label>
                <div class="col-8 ">
                    <textarea class="form-control" name="obs" id="exampleTextarea1" rows="2" value"`+text+`">`+text+`</textarea>
                </div>
            </div>
            <div class="row mt-2">
                <table class="table table-striped">
                    <thead class="table_head">
                        <tr>
                            <th>
                                Partielle N°
                            </th>
                            <th>
                                Type Empietement
                            </th>
                            <th>
                                Numero titre
                            </th>
                        </tr>
                    </thead>
                    <tbody id="attQryTableEmp">
                    </tbody>
                </table>
            </div>
          `;
    }

    function setupImportPiecesModal() {
        modalTitle.textContent = 'Import pièces pour archive';
        modal_button.innerHTML = `
      <button type="button" class="btn btn-secondary" id="closebuton" data-bs-dismiss="modal">Fermer</button>
      <button type="button" class="btn btn-primary" id="savebuton" onclick="ImportPiecesAction()">Télécharger</button>                              
        `;
        additionalFields.innerHTML = `
        <h4 class="card-title">List Pièces</h4>
        <ul>
            <li class="h6">Récépissé, Convocation</li>
            <li class="h6">Fiche technique, PV de bornage</li>
            <li class="h6">Fiche de calcul de Contenance, Réquisition</li>
            <li class="h6">Reçus de payement de droit, Lettre de charge</li>
            <li class="h6">Jugement, Acte de vente ou de partage</li>
        </ul>
        <div class="form-group row mt-2">
            <div class="col-sm-12">
                <input type="file" name="files[]" id="files" multiple="" class="form-control">
            </div>
        </div>
      `;
    }

    async function processVerification(){
        lien = base_url + "verification_num";
        try {
            let response = await $.ajax({
                url: lien,
                method: "GET",
                data: { iddossier: document.getElementById('iddossier').value}, // Ajout du paramètre iddossier
                dataType: "json",
            });
            return response;
        } catch (error) {
            console.error(error);
            alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
        }
    }

    function setupVerificationModal(num) {
        modalTitle.textContent = 'Vérification';
        modal_button.innerHTML = `
            <button type="button" class="btn btn-secondary" id="closebuton" data-bs-dismiss="modal">Fermer</button>
            <button type="button" class="btn btn-primary" id="savebuton" onclick="VerificationAction()">Enregistrer</button>                              
        `;
    
        // Prépare le champ num_verification avec ou sans readonly selon num
        let numVerificationInput = `<input name="num_verification" id="num_verification" type="text" class="form-control"`;
        if (num && num.trim() !== "") {
            numVerificationInput += ` value="${num}" readonly`;
        }
        numVerificationInput += `>`;
    
        additionalFields.innerHTML = `
            <div class="form-group row">
                <label class="col-sm-4 ">Numero de verification</label>
                <div class="col-sm-8">
                    ${numVerificationInput}
                </div>
            </div>
            <div class="form-group row mt-2">
                <label class="col-sm-4 ">Date de verification</label>
                <div class="col-sm-8">
                    <input name="date_verification" id="date_verification" type="date" value="` + date + `" class="form-control" readonly="true">
                </div>
            </div>
            <div class="form-group row mt-2">
                <label class="col-sm-4">Observations</label>
                <div class="col-sm-8">
                    <textarea class="form-control" name="obs_verification" rows="2"></textarea>
                </div>
            </div>`;
    }
    
    function setupGeometreModal(data) {
        //console.log(data);
        modalTitle.textContent = 'Retrait de dossier par le Géomètre Expert';
        modal_button.innerHTML = `
            <button type="button" class="btn btn-secondary" id="closebuton" data-bs-dismiss="modal">Fermer</button>
            <button type="button" class="btn btn-primary" id="savebuton" onclick="GeometreAction()">Enregistrer</button>                              
        `;
        additionalFields.innerHTML = `
            <div class="form-group row mt-2">
                <label class="col-sm-4">Date de retrait du dossier par le GE</label>
                <div class="col-sm-8">
                    <input name="date_envoie" id="date_envoie" type="date" value="`+ date + `" class="form-control">
                </div>
            </div>
            <div class="form-group row mt-2">
                <label class="col-sm-4">Date previsionnel de descente GE</label>
                <div class="col-sm-8">
                    <input name="date_reception_Ge" id="date_reception_Ge" type="date" value="`+ date + `" class="form-control" required="">
                </div>
            </div>
            <div class="form-group row mt-2">
                <label class="col-sm-4">Géomètre</label>
                <div class="col-sm-8">
                    <input name="nom_geom" id="id_geometreExpert" placeholder="Rechercher Géomètre ..." type="text" class="form-control" required="">
                </div>
                <input type="hidden" name="id_geomExpert" id="id_geomExpert" value="">
            </div>
        
           <div class="form-group row mt-2">
                <label class="col-sm-4">Observations </label>
                <div class="col-sm-8">
                   
                    <textarea class="form-control" name="obs_geometre" rows="2" id="obs_geometre_id"></textarea>
             </div>
                <input type="hidden" name="id_geomExpert" id="id_geomExpert" value="">
            </div>
        
            <div class="form-group row mt-2">
                <div class="col-sm-12">
                    <table class="table table-hover rounded">
                        <thead class="table_head">
                            <tr>
                                <th><strong>Nom et Prénom</strong></th>
                                <th><strong>N° Ordre</strong></th>
                                <th><strong>Téléphone</strong></th>
                                <th><strong>Adresse</strong></th>
                            </tr>
                        </thead>
                        <tbody id="attQryTableGeomExpert">
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Remplir le tableau avec les données des géomètres
        let tableBody = document.getElementById('attQryTableGeomExpert');
        for (let i = 0; i < data.length; i++) {
            let row = `
                <tr id="${data[i].id_geometre}">
                    <td>${data[i].nom_prenom}</td>
                    <td>${data[i].numero_ordre}</td>
                    <td>${data[i].tel}</td>
                    <td>${data[i].adresse_cabinet}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        }
    }

    function setupImportDxfModal(data) {
        modalTitle.textContent = 'Import Fichier dxf pour reperage definitive';
        modal_button.innerHTML = `
        <button type="button" class="btn btn-secondary" id="closebuton" data-bs-dismiss="modal">Fermer</button>
        <button type="button" class="btn btn-primary" id="savebuton" onclick="ImportDxfAction()">Télécharger</button>                              
        `;

        // Génération des options pour le select à partir de `data`
        let options = data.map(item => `<option value="${item.idtypeorigine}">${item.labeltypeorigine}</option>`).join("");

        additionalFields.innerHTML = `
        <div class="mb-3">
            <label for="origine_maj" class="form-label">Type</label>
            <select class="form-control" id="origine_maj" name="id_origine">
                ${options}
            </select>
        </div>
        <div class="row" id="input_maj">
            <div class="mb-3">
                <label for="numero_maj" class="form-label">Titre</label>
                <input type="text" class="form-control" name="numero_maj" placeholder="T123BAT">
            </div>
            <div class="mb-3">
                <label for="propriete_dite_maj" class="form-label">Proporiété dite</label>
                <input type="text" class="form-control" name="propriete_dite_maj" placeholder="Proporiété dite">
            </div>
            <div class="mb-3">
                <label for="surface_maj" class="form-label">Surface</label>
                <input type="text" class="form-control" name="surface_maj" placeholder="39000">
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Fichier (format dxf)</label>
            <input type="file" name="fileUpload" accept=".dxf" class="form-control ">
        </div>
      `;

        $('#origine_maj').on('change', function () {
            var selectedValue = $(this).val(); // Récupère la valeur sélectionnée (string)

            // Vérifie si l'élément existe avant de modifier son contenu
            if ($('#input_maj').length) {
                switch (selectedValue) {
                    case "1":
                        $('#input_maj').html(titre_input());
                        break;
                    case "2":
                        $('#input_maj').html(demande_input());
                        break;
                    case "3":
                        $('#input_maj').html(cadastre_input());
                        break;
                    case "4":
                        $('#input_maj').html(cf_input());
                        break;
                    default:
                        $('#input_maj').html(''); // Réinitialisation si aucune correspondance
                        break;
                }
            }
        });
    }

    function rtxModal() {
        modalTitle.textContent = 'Attribution numero RTX';
        modal_button.innerHTML = `
            <button type="button" class="btn btn-secondary" id="closebuton" data-bs-dismiss="modal">Fermer</button>
            <button type="button" class="btn btn-primary" id="savebuton" onclick="rtxAction()">Enregistrer</button>                              
        `;
        additionalFields.innerHTML = `
        <div class="input-group mb-3 row">
            <label class="col-sm-4 ">Numero RTX</label>
            <div class="col-sm-8">
                <div class="input-group">
                    <span class="input-group-text" id="basic-addon1">RTX</span>
                    <input name="rtx" id="rtx_num" type="text" class="form-control" placeholder="124/23" aria-label="124/23" aria-describedby="basic-addon1">
                </div>    
            </div>
        </div>`;
    }

    function setupIntegration(){
        modalTitle.textContent = 'Integration';
        modal_button.innerHTML = `
            <button type="button" class="btn btn-secondary" id="closebuton" data-bs-dismiss="modal">Fermer</button>
            <button type="button" class="btn btn-primary" id="savebuton" onclick="integrationAction()">Enregistrer</button>                              
        `;
        additionalFields.innerHTML = ` 
         <div class="form-group row mt-2">
              <label class="col-sm-4 ">Date</label>
            <div class="col-sm-8">
                <input name="date" type="date" placeholder="Date" class="form-control" value="`+ date + `" required readonly="true">
            </div>
        </div>
        <div class="form-group row mt-2">
            <label class="col-sm-4 ">Observations</label>
            <div class="col-sm-8 ">
                <textarea class="form-control" name="obs" rows="2"></textarea>
            </div>
        </div>
      `;
    }

    // Event listener pour afficher la modale avec le bon contenu
    unifiedModal.addEventListener('show.bs.modal', async function (event) {
        var button = event.relatedTarget;
        var type = button.getAttribute('data-type');

        // Réinitialiser les champs supplémentaires
        additionalFields.innerHTML = '';

        // Appeler la fonction appropriée selon le type
        switch (type) {
            case 'payement':
                var object = await ProcesscalculePaiment();
                setupPayementModal(object);
                break;
            case 'impression':
                setupImpressionFacture();
                break;
            case 'verification':
                const num = await processVerification();
                setupVerificationModal(num);
                break;
            case 'geometre':
                let data = await getAllGeometreExpert();
                setupGeometreModal(data);
                selectionGeometre();
                selectGeometre();
                break;
            case 'visa':
                let data_visa = await getAllTypeVisa();
                setupVisaModal(data_visa);
                break;
            case 'satisfaction':
                setupSatisfactionModal();
                break;
            case 'verif_pieces':
                const num_ = await processVerification();
                setupVerificationPiecesModal(num_);
                break;
            case 'import_dxf':
                setupImportDxfModal(await select_list_origine());
                break;
            case 'transfert':
                const obs = await getObservationAjouterPar_Utilisateur();
                setupSendDossierModal(obs);
                break;
            case 'remise_definitive':
                setupremiseModal();
                break;
            case 'pieces_archivage':
                setupImportPiecesModal();
                break;
            case 'renvoi_geo':
                setupRenvoieGeoModal();
                break;
            case 'rtx':
                rtxModal();
                break;
            case 'integration':
                setupIntegration();
                break;
            default:
                console.error('Type de bouton non reconnu : ' + type);
        }
    });

    //fonction pour le liste type visa
    async function select_list_origine(){
        lien = base_url + "list_origine";
        try {
            let response = await $.ajax({
                url: lien,
                method: "GET",
                dataType: "json",
            });
            return response;
        } catch (error) {
            console.error(error);
            alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
        }
    }

    async function getObservationAjouterPar_Utilisateur(){
        lien = base_url + "observation_dossier";
        try {
            let response = await $.ajax({
                url: lien,
                method: "GET",
                data: { iddossier: document.getElementById('iddossier').value}, // Ajout du paramètre iddossier
                dataType: "json",
            });
            console.log(response);
            return response;
        } catch (error) {
            console.error(error);
            alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
        }
    }

    //fonction pour le liste type visa
    async function getAllTypeVisa(){
        lien = base_url + "list_visa";
        try {
            let response = await $.ajax({
                url: lien,
                method: "GET",
                dataType: "json",
            });
            //console.log(JSON.stringify(response), 'teste_1');
            return response;
        } catch (error) {
            console.error(error);
            alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
        }
    }

    //fonction pour le liste geometre debut
    async function getAllGeometreExpert() {

        lien = base_url + "list_ge_json/1";
        try {
            let response = await $.ajax({
                url: lien,
                method: "GET",
                dataType: "json",
            });
            //console.log(JSON.stringify(response), 'teste_1');
            return response;
        } catch (error) {
            console.error(error);
            alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
        }
    }

    function selectionGeometre() {
        $("#attQryTableGeomExpert tr").css("cursor", "pointer").click(function () {
            $(this).addClass('table-warning').siblings().removeClass('table-warning');
            var value = $(this).find('td:first').html();
            $("#id_geomExpert").val(parseInt($.trim(this.id)));
            $("#id_geometreExpert").val($.trim(value));
        });
    }

    function selectGeometre() {
        $("#id_geometreExpert").on("keyup", function () {
            var param = $("#id_geometreExpert").val();
            var url = base_url + "search_geometre";
            $("#attQryTableGeomExpert").html("");
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                data: { data: param }
            }).done(function (data) {
                var sizeArray = data.length;
                if (sizeArray >= 1) {
                    $.each(data, function (index, value) {
                        $('#attQryTableGeomExpert').append('<tr id=' + value.id_geometre + '>' +
                            '<td class="py-1">' + value.nom_prenom + '</td>' +
                            '<td>' + value.numero_ordre + '</td>' +
                            '<td>' + value.tel + '</td>' +
                            '<td>' + value.adresse_cabinet + '</td>' +
                            '</tr>');
                    });
                    selectionGeometre();
                } else {
                    $('#attQryTableGeomExpert').append(
                        '<tr><td colspan="6" style="text-align:center;">Aucun Résultat</td></tr>'
                    );
                }
            });
        });
    }
    //fin pour le geometre

    //payement debut
    async function ProcesscalculePaiment(){
        lien = base_url + "get_info_traitement";
        try {
            let response = await $.ajax({
                url: lien,
                method: "GET",
                dataType: "json",
                data: { iddossier: document.getElementById('iddossier').value}, // Ajout du paramètre iddossier
            });
            return response;
        } catch (error) {
            console.error(error);
            alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
        }
    }

    // Fin de reperage 

    //modification de la table etape par dossier apres mention de reperage

});
    // Fonction qui effectue le calcul PU_plan
    function nbr_plan__ (pu_plan_) {
        var PUPlan = pu_plan_
        if(parseInt(document.getElementById("nbr_plan").value) == 0 || document.getElementById("nbr_plan").value == ""){
            document.getElementById("Pplan").value = pu_plan_;
        }else{
            PUPlan = parseInt(document.getElementById("Pplan").value) * parseInt(document.getElementById("nbr_plan").value);
        }    
        // Calcul du montant total
        document.getElementById("Pplan").value = PUPlan;
    };

    function calculateMontantTotal(objet) {
        // Récupération des valeurs des champs
        const PUPlan = parseInt(document.getElementById("Pplan")?.value) || 0; // Prix unitaire plan
        const surface_terrain = parseInt(document.getElementById("surface")?.value) || 0; // Surface en hectares
        const DroitFixe = parseInt(document.getElementById("DroitFixe")?.value) || 0; // Droit fixe
        const DroitConservation = parseInt(document.getElementById("DroitConservation")?.value) || 0; // Droit de conservation
        const Fourniture = parseInt(document.getElementById("Fourniture")?.value) || 0; // Fourniture nécessaire
        const transactionChecked = document.getElementById("transaction")?.checked || false; // Checkbox transaction
    
        // Calcul des éléments spécifiques
        const majorationSurface = 0; // Majoration pour la surface, exemple multiplicateur 10,000
    
        // Calcul du total
        let montantTotal = DroitFixe + DroitConservation + Fourniture + PUPlan + majorationSurface;

        if(surface_terrain > parseInt(objet.majorationsurface_hectare)){   
            montantTotal = montantTotal + parseInt(objet.majorationprix)
        }
    
        if(transactionChecked){
            const pourcentage = parseInt(objet.vvt)/ 100
            montantTotal = montantTotal + ( montantTotal * pourcentage)
        }
        // Mise à jour du champ montant total
        document.getElementById("montant_total").value = montantTotal.toLocaleString(); // Formatte le montant avec séparateur de milliers
    }

    function historique(){
        prepare_information_h();
    }

    function prepare_information_h(){
        var lien = base_url + "historique_dossier/"+$('#iddossier').val();
        $.ajax({
            url: lien,
            type: 'POST',
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function (response) {
                afficher_en_tete(response.info_partielle)
                afficher_info_rtx(response.info_dossier_rtx)
                afficher_info_geometre(response.info_geometre)
                afficher_num_verification_date(response.info_num_date_verification)
                afficher_historique(response.info_verification, response.info_visa, response.info_satisfaction)
                afficher_visa(response.list_visa)
                prepare_condition_h(response.list_condition)
                affiche_conclusion_chef(response.info_visa)
                //console.log(response);
            },
            error: function (xhr, status, error) {
                showPopup('Error: ' + error, 'error');
                console.log(error);
            }
        });
    }

    function afficher_num_verification_date(data){
        let text =  `
                <span class="col-6">VERIFICATION N° `+data.num_verification+`  </span>
                <span class="col-6"> en date du `+data.date_observation+`

        `;
        $('#info_num_date_verification').html(text)
    }

    function affiche_conclusion_chef(response) {
        let dernier_visa = response.length - 1; // Utiliser `length - 1` pour obtenir le dernier index
        if (dernier_visa >= 0) { // Vérifier si le tableau n'est pas vide
            $('#visa-chef-conclusion').html(response[dernier_visa].observation);
        }
    }
    
    function afficher_visa(response) {
        $('#visa_check-h').html(""); // Vide l'élément avant d'ajouter du contenu
    
        response.forEach(item => {
            let checkboxHtml = `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="visa_${item.id_visa}" disabled ${item.check_}>
                    <label class="form-check-label" for="visa_${item.id_visa}">
                        ${item.label_visa}
                    </label>
                </div>
            `;
            $('#visa_check-h').append(checkboxHtml); // Ajoute le HTML généré dans l'élément
        });
    }

    function afficher_historique(verfication, visa, satisfaction){
        $('#historique_tr').html(""); //vide alou ny en_tete
        html = "";
        html +=  prepare_verification(verfication)
        html +=  prepare_visa(visa)
        html +=  prepare_satisfaction(satisfaction)
        $('#historique_tr').html(html)
    }

    function afficher_en_tete(response){
        $('#en_tete_h').html(""); //vide alou ny en_tete
        $('#en_tete_h').html(prepare_en_tete_historique(response));
    }

    function afficher_info_rtx(response){
        $('#info_rtx_h').html(""); //vide alou ny en_tete
        $('#info_rtx_h').html(prepare_rtx_info(response))
    }

    function afficher_info_geometre(response){
        $('#info_geomentre_h').html(""); //vide alou ny en_tete
        $('#info_geomentre_h').html(prepare_geometre(response))
    }

    function prepare_satisfaction(data) {
        let html = "", counter = 1;
    
        data.forEach(item => {
            html += `
                <div class="row custom-row-info-plan-2 border">
                    <div class="col-6 p-3 border-end">${counter}<sup>e</sup> Satisfaction<br>(${item.date_observation})</div>
                    <div class="col-6 p-3">${item.observation}</div>
                </div>
            `;
            counter++;
        });
    
        return html;
    }

    function prepare_visa(data) {
        let html = "", counter = 1;
    
        data.forEach(item => {
            html += `
                <div class="row custom-row-info-plan-2 border">
                    <div class="col-6 p-3 border-end">${counter}<sup>e</sup> Visa<br>(${item.date_observation})</div>
                    <div class="col-6 p-3">${item.observation}</div>
                </div>
            `;
            counter++;
        });
    
        return html;
    }

    function prepare_verification(data) {
        let html = "", counter = 1;
    
        data.forEach(item => {
            html += `
                <div class="row custom-row-info-plan-2 border">
                    <div class="col-6 p-3 border-end">${counter}<sup>e</sup> Verification<br>(${item.date_observation})</div>   
                    <div class="col-6 p-3">${item.observation}</div>
                    
                </div>
            `;
            counter++;
        });
    
        return html;
    }
    
    function prepare_geometre(data) {
        let html = "";
        data.forEach(item => {
            html += `
                <div class="row custom-row-info-plan-2">
                    <span class="col"><span class="span_color">Géomètre Expert :</span> ${item.nom_prenom}</span>
                    <span class="col"><span class="span_color">Date de la descente :</span> ${item.date_previsionnel_descente}</span>
                    <span class="col"><span class="span_color">Date de reception dossier :</span> ${item.date_reception} </span>
                </div>
            `;
        });
        return html;
    }
    
    function prepare_rtx_info(data){
        return `
        <span class="col-6">
            <span class="span_color"><b>Numero</b> </span> `+data.rtx+` du `+data.dateentree+`
        </span>
        <span class="col-6">
            <span class="span_color"><b>Nature du travail : </b></span> `+data.labeltraitement+`
        </span>
        `;
    }

    function prepare_en_tete_historique(data) {
        let html = "";
        // Table de correspondance clé → label personnalisé
        const customLabels = {
            num_att: "EN CAUSE",
            nom: "Nom propriété",      
            numero_origine: "Origine",
            dateentree : "Date d'entré",
            rtx : "RTX",
            // Ajoute ici d'autres personnalisations si besoin
        };
    
        for (let key in data) {
            if (
                data.hasOwnProperty(key) &&
                !key.startsWith("id") &&
                !key.startsWith("lieu_dit ") &&
                !key.startsWith("last_num") &&
                !key.startsWith("rtx") &&
                !key.startsWith("etat") &&
                !key.startsWith("lieudit")
            ) {
                // Si un label personnalisé existe, on l’utilise, sinon on formate automatiquement
                let label = customLabels[key] || key.replace(/_/g, " ")
                                                    .toLowerCase()
                                                    .replace(/^\w/, c => c.toUpperCase());
    
                let value = data[key] ? data[key] : "-";
    
                html += `
                    <span class="col mb-1">
                        <span class="span_color"><b>${label} </b>:</span> 
                        <span>${value}</span>
                    </span>
                `;
            }
        }
    
        return html;
    }
    
    function prepare_condition_h(data) {
        let container = $('#checkbox-container-historique'); 
        container.html(""); // Vider le conteneur avant d'ajouter les cases à cocher
    
        if (Array.isArray(data) && data.length > 0) {
            $.each(data, function (index, item) {
                if (item.label_pieces) { // Vérifie si label_pieces existe et n'est pas vide
                    let checkboxHtml = `
                        <div class="col-sm-6 form-check form-check-primary">
                            <label class="form-check-label">
                                <input type="checkbox" class="form-check-input" name="pieces_fournie[]" value="${item.label_pieces}" checked disabled>
                                ${item.label_pieces}
                                <i class="input-helper"></i>
                            </label>
                        </div>
                    `;
                    container.append(checkboxHtml);
                }
            });
        }else{
            container.html("<span>Liste des pièces non vérifier</span>")
        }
    }

    function prepare_cartouche(data) {
        let html = "";
    
        // Boucle sur chaque clé et valeur de l'objet data
        for (let key in data) {
            if (data.hasOwnProperty(key) && !key.startsWith("id_")) {
                let label = key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()); // Met en majuscule chaque mot
                let value = data[key] ? data[key] : "-"; // Gérer les valeurs nulles ou vides
    
                html += `
                    <div class="row">
                        <label class="col-sm-6 col-form-label fw-bold"><b>${label}</label>
                        <div class="col-sm-6">
                            <input type="text" readonly class="form-control-plaintext" value="${value}">
                        </div>
                    </div>
                `;
            }
        }
    
        return html; // Retourne le HTML généré
    }
    
    function titre_input() {
        return `
        <div class="mb-3">
            <label for="numero_maj" class="form-label">Titre</label>
            <input type="text" class="form-control" name="numero_maj" placeholder="T123BAT">
        </div>
        <div class="mb-3">
            <label for="propriete_dite_maj" class="form-label">Propriété dite</label>
            <input type="text" class="form-control" name="propriete_dite_maj" placeholder="Propriété dite">
        </div>
        <div class="mb-3">
            <label for="surface_maj" class="form-label">Surface</label>
            <input type="text" class="form-control" name="surface_maj" placeholder="39000">
        </div>
        `; 
    }

    function demande_input() {
        return `
        <div class="mb-3">
            <label for="numero_maj" class="form-label">Numéro</label>
            <input type="text" class="form-control" name="numero_maj" placeholder="FN0023AV12">
        </div>
        <div class="mb-3">
            <label for="propriete_dite_maj" class="form-label">Demandeur</label>
            <input type="text" class="form-control" name="propriete_dite_maj" placeholder="Propriété dite">
        </div>
        <div class="mb-3">
            <label for="surface_maj" class="form-label">Surface</label>
            <input type="text" class="form-control" name="surface_maj" placeholder="39000">
        </div>
        `;
    }

    function cadastre_input() {
        return `
        <div class="mb-3">
            <label for="numero_maj" class="form-label">Numéro</label>
            <input type="text" class="form-control" name="numero_maj" placeholder="C123AV">
        </div>
        <div class="mb-3">
            <label for="surface_maj" class="form-label">Surface</label>
            <input type="text" class="form-control" name="surface_maj" placeholder="39000">
        </div>
        `;
    }

    function cf_input() {
        return `
        <div class="mb-3">
            <label for="numero_maj" class="form-label">Numéro</label>
            <input type="text" class="form-control" name="numero_maj" placeholder="CF123AV">
        </div>
        <div class="mb-3">
            <label for="surface_maj" class="form-label">Surface</label>
            <input type="text" class="form-control" name="surface_maj" placeholder="39000">
        </div>
        `;
    }    