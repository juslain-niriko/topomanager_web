import { useState } from "react";
import "./Sidebar.css";
import { Head, Link, useForm } from '@inertiajs/react';
export default function Sidebar() {
    const [expanded, setExpanded] = useState(false);
   
    const toggleSidebar = () => {
        setExpanded(!expanded);
    };

    return (
        <aside id="sidebar" className={expanded ? "expand" : ""}>
            <div className="d-flex">
                <button
                    className="toggle-btn"
                    type="button"
                    onClick={toggleSidebar}
                >
                    <i
                        className="mdi mdi-view-grid"
                        style={{ color: "#5d5fef" }}
                    ></i>
                </button>
                <div className="sidebar-logo">
                    <a href="#">TOPOMANAGER</a>
                </div>
            </div>

            <ul className="sidebar-nav">
                <li className="sidebar-item" id="active">
                    <a href="/" className="sidebar-link">
                        <i
                            className="mdi mdi-monitor-dashboard"
                            style={{ color: "#56c300" }}
                        ></i>
                        <span>
                            <strong>Tableau de bord</strong>
                        </span>
                    </a>
                </li>

                <li className="sidebar-item">
                    <a href="/suivi" className="sidebar-link">
                        <i
                            className="mdi mdi-eye-outline"
                            style={{ color: "#333d33" }}
                        ></i>
                        <span>
                            <strong>Suivi dossier</strong>
                        </span>
                    </a>
                </li>
                <li className="sidebar-item">
                    <a
                        href="#"
                        className="sidebar-link collapsed has-dropdown"
                        data-bs-toggle="collapse"
                        data-bs-target="#auth"
                        aria-expanded="false"
                        aria-controls="auth"
                    >
                        <i
                            className="mdi mdi-folder menu-icon"
                            style={{ color: "#ffc107" }}
                        ></i>
                        <span>
                            <strong>Traitement dossiers</strong>
                        </span>
                    </a>
                    <ul
                        id="auth"
                        className="sidebar-dropdown list-unstyled collapse"
                        data-bs-parent="#sidebar"
                    >
                        <li className="sidebar-item border">
                            <a href="/mes_dossier" className="sidebar-link">
                                Mes dossiers
                            </a>
                        </li>
                        <li className="sidebar-item border">
                            <a href="/reproduction" className="sidebar-link">
                                Délivrance de documents
                            </a>
                        </li>
                    </ul>
                </li>
                <li className="sidebar-item">
                    <a
                        href="#"
                        className="sidebar-link collapsed has-dropdown"
                        data-bs-toggle="collapse"
                        data-bs-target="#multi"
                        aria-expanded="false"
                        aria-controls="multi"
                    >
                        <i
                            className="mdi mdi-wrench menu-icon"
                            style={{ color: "#333d33" }}
                        ></i>
                        <span>
                            <strong>Paramètrage</strong>
                        </span>
                    </a>
                    <ul
                        id="multi"
                        className="sidebar-dropdown list-unstyled collapse"
                        data-bs-parent="#sidebar"
                    >
                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link border">
                                Usagers
                            </a>
                        </li>
                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link border">
                                Traitements
                            </a>
                        </li>
                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link border">
                                Procédures
                            </a>
                        </li>
                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link border">
                                Communes
                            </a>
                        </li>
                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link border">
                                Fokontany
                            </a>
                        </li>
                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link border">
                                Utilisateurs
                            </a>
                        </li>
                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link border">
                                Type Utilisateurs
                            </a>
                        </li>
                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link border">
                                Géomètres Experts
                            </a>
                        </li>

                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link border">
                                Circonscription
                            </a>
                        </li>
                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link border">
                                Inventaire Calque
                            </a>
                        </li>
                    </ul>
                </li>
                <li className="sidebar-item">
                    <a href="/reperage" className="sidebar-link">
                        <i
                            className="mdi mdi-map menu-icon"
                            style={{ color: "#00dcfeb8" }}
                        ></i>
                        <span>
                            <strong>Repérage (PLOF)</strong>
                        </span>
                    </a>
                </li>
                <li className="sidebar-item">
                    <a href="/archive" className="sidebar-link">
                        <i
                            className="mdi mdi-database menu-icon"
                            style={{ color: "#333d33" }}
                        ></i>
                        <span>
                            <strong>Archive</strong>
                        </span>
                    </a>
                </li>
            </ul>

            <div className="sidebar-footer">
                <a href="/profile" className="sidebar-link">
                    <i className="mdi mdi-account"></i>
                    <span>Profile</span>
                </a>
                <a href={route('logout')} className="sidebar-link">
                    <i
                        className="mdi mdi-logout"
                        style={{ color: "#ff210d" }}
                    ></i>
                    <span>Déconnexion</span>
                </a>
                 <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Log Out
                    </Link>
            </div>
        </aside>
    );
}
