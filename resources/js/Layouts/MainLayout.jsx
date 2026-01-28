import Sidebar from "@/Components/Sidebar";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

export default function MainLayout({ children }) {
    return (
        <div className="wrapper">
            <Sidebar />

            <div className="main flex-grow-1">
                <Header />
                <div className="content p-2">{children}</div>
                <Footer />
            </div>
        </div>
    );
}
