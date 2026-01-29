import { Link, useForm } from "@inertiajs/react";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/login");
    };

    return (
        <div
            className="login-page"
            style={{
                backgroundImage: "url('/assets/image/bg.jpg')",
                backgroundSize: "cover",
                backgroundAttachment: "fixed",
                minHeight: "100vh",
            }}
        >
            <div className="content-wrapper">
                <div className="login-container">
                    <form onSubmit={submit} autoComplete="off">
                        <div className="mb-3 text-center">
                            <img
                                src="/assets/image/topomanager.png"
                                className="img-fluid"
                                style={{ maxWidth: "400px" }}
                                alt="TopoManager"
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nom d'utilisateur"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                            />
                            {errors.email && (
                                <div className="text-danger mt-1">
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Mot de passe"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                required
                            />
                            {errors.password && (
                                <div className="text-danger mt-1">
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn_login w-100"
                            disabled={processing}
                        >
                            SE CONNECTER
                        </button>

                        <Link
                            href="/"
                            className="d-block text-center mt-3"
                            style={{
                                color: "white",
                                textDecoration: "none",
                                transition: "color 0.3s",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.color = "#3498db")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.color = "white")
                            }
                        >
                            Retour à l'accueil
                        </Link>
                    </form>
                </div>

                <footer className="footer_login">
                    <p>© 2025 Suivi Topographique. Tous droits réservés.</p>
                </footer>
            </div>
        </div>
    );
}
