import { usePage } from "@inertiajs/react";

export default function Header() {
    const { component } = usePage();
    const pageTitles = {
        Dashboard: "Tableau de bord",
        Suivi_dossier: "Suivi des dossiers",
        Dossier: "Mes dossiers",
        Reproduction: "Reproduction de documents",
        Cartographie: "Repérage Numérique",
        Archive: "Archive Numérique",
        Profile: "Mon Profile",
    };

    const pageName = pageTitles[component.split("/").pop()] || "Page";
    return (
        <span className="row h6 p-2" style={{ color: "#0F3659" }}>
            <span className="col-4 d-flex">
                <span className="header_custom">{ pageName }</span>
            </span>
            <span className="col-8 d-flex justify-content-end">
                <span className="header_custom">
                    SuperAdmin, Admin Administrateur || Antananarivo
                    Atsimondrano
                </span>
            </span>
        </span>
    );
}
