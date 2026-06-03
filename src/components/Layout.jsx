import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Layout() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: '#0f172a',
            }}
        >
            <Header />
            <main
                style={{
                    flex: 1,
                    padding: '30px 40px',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    overflow: 'auto',
                }}
            >
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
