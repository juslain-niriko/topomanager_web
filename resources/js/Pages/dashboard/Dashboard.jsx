import MainLayout from "@/Layouts/MainLayout";

export default function Dashboard() {
    return (
        <MainLayout>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                <div className="col">
                    <div className="card">
                        <div className="card-header">DOSSIERS ENTRANTS</div>
                        <div className="card-body">
                            <span className="display-2">
                                <i className="mdi mdi-folder-download text-secondary"></i>
                            </span>
                            <span className="display-2 m-5">7</span>
                        </div>
                    </div>
                </div>

                <div className="col">
                    <div className="card">
                        <div className="card-header">DOSSIERS TRAITÉ</div>
                        <div className="card-body">
                            <span className="display-2">
                                <i className="mdi mdi-folder-upload text-info"></i>
                            </span>
                            <span className="display-2 m-5">1</span>
                        </div>
                    </div>
                </div>

                <div className="col">
                    <div className="card">
                        <div className="card-header">DOSSIERS EN INSTANCE</div>
                        <div className="card-body">
                            <span className="display-2">
                                <i className="mdi mdi-folder-multiple text-warning"></i>
                            </span>
                            <span className="display-2 m-5">6</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row row-cols-1 row-cols-md-2 g-4 mt-2 mb-2">
                <div className="col-12 col-lg-8">
                    <div className="card h-100">
                        <div className="card-header">
                            Suivis des nombres de dossier traiter par agent
                        </div>
                        <div className="card-body">
                            <form id="formId">
                                <div className="form-group row">
                                    <div className="col-4">
                                        <select
                                            className="form-control form-control-sm"
                                            id="exampleFormControlSelect2"
                                            name="type_utilisauter"
                                        >
                                            <option>SuperAdmin</option>
                                            <option>Caissier </option>
                                            <option>Archiviste</option>
                                            <option>Opérateur</option>
                                            <option>CCT </option>
                                            <option>CSRT </option>
                                            <option>
                                                Secrétaire Technique
                                            </option>
                                            <option>Agent de Repérage</option>
                                            <option>Vérificateur</option>
                                            <option>Agent de suivi</option>
                                            <option>Integrateur</option>
                                        </select>
                                    </div>
                                    <div className="col-sm-3">
                                        <select
                                            className="form-control form-control-sm"
                                            id="exampleFormControlSelect2"
                                            name="mois"
                                        >
                                            <option>JANVIER</option>
                                            <option>FEVRIER</option>
                                            <option>MARS</option>
                                            <option>AVRIL</option>
                                            <option>MAI</option>
                                            <option>JUIN</option>
                                            <option>JUILLET</option>
                                            <option>AOUT</option>
                                            <option>SEPTEMBRE</option>
                                            <option>OCTOBRE</option>
                                            <option>NOVEMNBRE</option>
                                            <option>DECEMBRE</option>
                                        </select>
                                    </div>
                                    <div className="col-sm-3">
                                        <input
                                            type="number"
                                            name="anne"
                                            className="form-control form-control-sm"
                                        />
                                    </div>
                                    <div className="col-sm-2">
                                        <button
                                            type="submit"
                                            className="btn btn-outline-primary btn-sm"
                                            id="recherche"
                                        >
                                            Filtrer
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <table className="table table-bordered align-middle table-striped table-hover mt-2">
                                <thead className="table_head">
                                    <tr>
                                        <th>
                                            <i className="fas fa-user me-1"></i>
                                            Nom et Prénom
                                        </th>
                                        <th className="text-center">
                                            <i className="fas fa-folder-open me-1"></i>
                                            Nbr/Dossier
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="userTableBody">
                                    <tr>
                                        <td>Admin Administrateur</td>
                                        <td className="text-center">1 </td>
                                    </tr>
                                    <tr>
                                        <td>Chef Naly</td>
                                        <td className="text-center">0 </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div className="card h-100">
                        <div className="card-header">
                            Statistique des dossiers traiter
                        </div>
                        <div className="card-body">
                            <div className="chartjs-size-monitor">
                                <div className="chartjs-size-monitor-expand">
                                    <div className=""></div>
                                </div>
                                <div className="chartjs-size-monitor-shrink">
                                    <div className=""></div>
                                </div>
                            </div>
                            <canvas
                                id="pieChart"
                                width="420"
                                height="210"
                                className="chartjs-render-monitor"
                            ></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    Rapport d'activiter
                    <div
                        className=" btn-custom-bar hint hint--bottom"
                        data-hint="Export rapport d'activiter"
                    >
                        <span
                            className="fa-solid fa-download"
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop"
                        ></span>
                    </div>
                </div>
                <div className="card-body">
                    <form id="formRapport">
                        <div className="row form-group">
                            <div className="col-sm-4">
                                <select
                                    id="selectTraitement"
                                    className="form-control form-control-sm"
                                    name="idtraitement"
                                >
                                    <option value="1">Plan regulier </option>
                                    <option value="2">
                                        Projet de morcellement{" "}
                                    </option>
                                </select>
                            </div>
                            <div className="col-sm-3">
                                <select
                                    id="selectMois"
                                    className="form-control form-control-sm"
                                    name="mois"
                                >
                                    <option>JANVIER</option>
                                    <option>FEVRIER</option>
                                    <option>MARS</option>
                                    <option>AVRIL</option>
                                    <option>MAI</option>
                                    <option>JUIN</option>
                                    <option>JUILLET</option>
                                    <option>AOUT</option>
                                    <option>SEPTEMBRE</option>
                                    <option>OCTOBRE</option>
                                    <option>NOVEMNBRE</option>
                                    <option>DECEMBRE</option>
                                </select>
                            </div>
                            <div className="col-sm-3">
                                <input
                                    type="number"
                                    id="inputAnnee"
                                    name="anne"
                                    className="form-control form-control-sm"
                                    min="1900"
                                    max="3000"
                                />
                            </div>

                            <div className="col">
                                <button
                                    type="submit"
                                    className="btn btn-outline-primary btn-sm"
                                    id="recherche"
                                >
                                    Filtrer
                                </button>
                            </div>
                        </div>
                    </form>
                    <table className="table table-bordered align-middle table-striped table-hover mt-2">
                        <thead className="table_head">
                            <tr>
                                <th>
                                    <i className="fas fa-tasks me-1"></i> Activités
                                </th>
                                <th className="text-center">
                                    <i className="fas fa-circle-notch me-1"></i>{" "}
                                    Situation
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Instance debut du mois</td>
                                <td className="text-center" id="intance_deb_m">
                                    5{" "}
                                </td>
                            </tr>
                            <tr>
                                <td>Reçue du mois</td>
                                <td className="text-center" id="entrants_r">
                                    1
                                </td>
                            </tr>
                            <tr>
                                <td>Travaux réalisés du mois</td>
                                <td className="text-center" id="realiser">
                                    0
                                </td>
                            </tr>
                            <tr>
                                <td>Cumul du mois</td>
                                <td className="text-center" id="interne_r">
                                    6
                                </td>
                            </tr>
                            <tr>
                                <td>Instance fin du mois</td>
                                <td className="text-center" id="sortant_r">
                                    6
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
}
