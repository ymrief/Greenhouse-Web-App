import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Layout() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-900 text-white">
            <Header />
            <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-auto bg-slate-900">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
