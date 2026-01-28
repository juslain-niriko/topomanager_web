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
         </MainLayout>
    );
}
