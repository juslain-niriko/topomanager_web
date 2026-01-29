import { Link } from '@inertiajs/react'
import './accueil.css'

export default function Accueil() {
    return (
        <>
            {/* HEADER */}
            <header className="container-fluid py-3 bg-white shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                    <img src="/assets/image/logo/logo2.png" className="header-logo" />

                    <div className="text-center">
                        <img
                            src="/assets/image/logo/logon1.png"
                            className="center-logo mb-2"
                        />
                        <h3 style={{ color: '#0F3659' }}>
                            Dématérialisation des procédures et documents topographiques fonciers
                        </h3>
                    </div>

                    <img src="/assets/image/logo/logo3.png" className="header-logo" />
                </div>
            </header>

            {/* HERO */}
            <section className="hero">
                <h2>Bienvenue sur notre plateforme</h2>
                <p>
                    Gérez efficacement les documents topographiques fonciers avec des outils innovants.
                </p>

                <Link href="/login" className="btn_connexion">
                    Accéder au compte
                </Link>
            </section>

            {/* FEATURES */}
            <section className="features">
                <div className="container">
                    <h3 className="text-center mb-4">Nos principales fonctionnalités</h3>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="feature-card">
                                <h4>Suivi en temps réel</h4>
                                <p>Consultez la situation de vos dossiers à tout moment.</p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="feature-card">
                                <h4>Archive Numérique</h4>
                                <p>Gestion moderne et sécurisée des documents topographiques.</p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="feature-card">
                                <h4>Repérage Numérique</h4>
                                <p>Exploration interactive des données PLOF sur une carte.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHY */}
            <section className="container my-5 text-center">
                <h3 className="mb-4">Pourquoi choisir notre plateforme ?</h3>
                <p>
                    Une solution moderne, rapide et transparente pour la gestion
                    des dossiers topographiques fonciers.
                </p>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <h5>Contactez-nous</h5>
                            <p>Anosy, Antananarivo, Madagascar</p>
                            <p>Tél : +261 32 00 000 00</p>
                            <p>Email : contact@suivitopographique.com</p>
                        </div>

                        <div className="col-md-6 text-end">
                            <h5>Suivez-nous</h5>
                            <a href="#">Facebook</a> | <a href="#">Twitter</a> | <a href="#">LinkedIn</a>
                        </div>
                    </div>

                    <div className="separator"></div>

                    <div className="text-center mt-3">
                        <p>© 2025 DST – Direction des Services Topographiques</p>
                    </div>
                </div>
            </footer>
        </>
    )
}
