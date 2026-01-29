import MainLayout from "@/Layouts/MainLayout";

export default function Suivi_dossier() {
    return (
        <MainLayout>
            <div className="card">
                <div className="card-header">
                    <form
                        className="row"
                        id="formSearchAllDossier"
                        method="post"
                    >
                        <div className="col">
                            <input
                                type="text"
                                id="rtx_all_dossier"
                                className="form-control"
                                placeholder="NUMERO"
                            />
                        </div>
                        <div className="col-auto">
                            <label>De</label>
                        </div>
                        <div className="col">
                            <input
                                type="date"
                                className="form-control"
                                id="date_debut"
                            />
                        </div>
                        <div className="col-auto">
                            <label>À</label>
                        </div>
                        <div className="col">
                            <input
                                type="date"
                                className="form-control"
                                id="date_fin"
                            />
                        </div>
                        <div className="col">
                            <select
                                className="form-select"
                                id="type-traitement"
                            >
                                <option value="">Tous traitements</option>
                                <option value="1">Plan regulier </option>
                                <option value="2">
                                    Projet de morcellement{" "}
                                </option>
                                <option value="3">
                                    Rétablissement de borne ou de limite{" "}
                                </option>
                            </select>
                        </div>
                        <div className="col">
                            <select className="form-select" id="type-procedure">
                                <option value="">Tous procedures</option>
                                <option value="22">Lecture </option>
                                <option value="26">
                                    Retour dossier domaine{" "}
                                </option>
                                <option value="31">Attribution RTX </option>
                                <option value="30">Repérage provisoire </option>
                            </select>
                        </div>
                        <div className="col">
                            <div>
                                <div className="position-relative">
                                    <select
                                        className="select2 select2-hidden-accessible"
                                        id="dm_search"
                                        multiple=""
                                        data-select2-id="dm_search"
                                        tabIndex="-1"
                                        aria-hidden="true"
                                    >
                                        <option>
                                            ANDRIANIAINA Fandresena{" "}
                                        </option>
                                        <option>RAMIAMARISOA Condocs </option>
                                        <option>RAFANOMEZANTSOA Swdg </option>
                                        <option>NRK12 Admin </option>
                                    </select>
                                    <span
                                        className="select2 select2-container select2-container--default"
                                        dir="ltr"
                                        data-select2-id="1"
                                    >
                                        <span className="selection">
                                            <span
                                                className="select2-selection select2-selection--multiple"
                                                role="combobox"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                                tabIndex="-1"
                                                aria-disabled="false"
                                            >
                                                <ul className="select2-selection__rendered">
                                                    <li className="select2-search select2-search--inline">
                                                        <input
                                                            className="select2-search__field"
                                                            type="search"
                                                            tabIndex="0"
                                                            autoComplete="off"
                                                            autoCorrect="off"
                                                            autoCapitalize="none"
                                                            spellCheck="false"
                                                            role="searchbox"
                                                            aria-autocomplete="list"
                                                            placeholder="Demandeur"
                                                        />
                                                    </li>
                                                </ul>
                                            </span>
                                        </span>
                                        <span
                                            className="dropdown-wrapper"
                                            aria-hidden="true"
                                        ></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <button type="submit" className="btn btn-primary">
                                Recherche
                            </button>
                        </div>
                    </form>
                </div>
                <div className="card-body table_custom_1">
                    <table className="table table-bordered text-center align-middle table-hover">
                        <thead className="table_head">
                            <tr>
                                <th>
                                    <i className="fas fa-hashtag me-1"></i> N°
                                    RTX
                                </th>
                                <th>
                                    <i className="fas fa-code-branch me-1"></i>{" "}
                                    N° Origine
                                </th>
                                <th>
                                    <i className="fas fa-certificate me-1"></i>{" "}
                                    N° Titre
                                </th>
                                <th>
                                    <i className="fas fa-certificate me-1"></i>{" "}
                                    Nom de proprieter
                                </th>
                                <th>
                                    <i className="fas fa-briefcase me-1"></i>{" "}
                                    Nature du traitement
                                </th>
                                <th>
                                    <i className="fa-solid fa-stairs"></i>{" "}
                                    Procedure actuelle
                                </th>
                                <th>
                                    <i className="fas fa-hourglass-half me-1"></i>{" "}
                                    Durée (Jours)
                                </th>
                                <th>
                                    <i className="fas fa-user me-1"></i>{" "}
                                    Demandeur
                                </th>
                                <th>
                                    <i className="fas fa-stopwatch me-1"></i>{" "}
                                    Temps écoulé (Jours)
                                </th>
                                <th>
                                    <i className="fas fa-calendar-day me-1"></i>{" "}
                                    Date entrée
                                </th>
                                <th>
                                    <i className="fas fa-circle-notch me-1"></i>{" "}
                                    État
                                </th>
                            </tr>
                        </thead>
                        <tbody id="attQryTableDossier">
                            <tr>
                                <td className="py-1"></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>Plan regulier</td>
                                <td>Lecture</td>
                                <td>22</td>
                                <td>ANDRIAMANARIVO Ernest </td>
                                <td>205</td>
                                <td>2025-07-07</td>
                                <td>DOSSIER EN RETARD! </td>
                            </tr>
                            <tr
                            // onclick="window.location='http://localhost/demat_topo_/redirect_detail_suivie_dossier/2';"
                            >
                                <td className="py-1"></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>Plan regulier</td>
                                <td>Lecture</td>
                                <td>22</td>
                                <td>RAMIAMARISOA Condocs </td>
                                <td>203</td>
                                <td>2025-07-09</td>
                                <td>DOSSIER EN RETARD! </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="card-footer form-inline">
                    <input
                        className="btn_custom_footer"
                        type="button"
                        label="Première"
                    />
                    <input
                        className="btn_custom_footer"
                        type="button"
                        // value="Précédente"
                    />
                    <input
                        className="btn_custom_footer_disable"
                        type="text"
                        // value="1"
                        disabled=""
                    />
                    <select
                        className="btn_custom_footer form-control-sm"
                        name=""
                        id=""
                    >
                        <option
                        // value=""
                        >
                            1/1
                        </option>
                    </select>
                    <input
                        className="btn_custom_footer"
                        type="button"
                        // value="Suivante"
                    />
                    <input
                        className="btn_custom_footer"
                        type="button"
                        // value="Dernière"
                    />
                </div>
            </div>
        </MainLayout>
    );
}
