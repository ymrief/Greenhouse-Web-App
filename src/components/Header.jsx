import { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Header() {
    // Mengambil status dan fungsi dari global state (Context)
    const { isAdmin, logoutAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

    // State untuk mengontrol Sidebar (Terbuka/Tertutup)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logoutAdmin();
        setIsSidebarOpen(false); // Memastikan sidebar tertutup saat admin logout
        navigate('/');
    };

    return (
        <>
            {/* --- BAGIAN HEADER UTAMA --- */}
            <header style={headerStyle}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                    }}
                >
                    {/* Tombol Burger hanya muncul jika yang login adalah Admin */}
                    {isAdmin && (
                        <button
                            style={burgerBtnStyle}
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            ☰
                        </button>
                    )}
                    <div className="logo">
                        <img
                            src="src\assets\LOGO_UPN.png"
                            alt="Logo UPN"
                            width="40"
                            height="40"
                        />
                    </div>
                </div>

                <nav>
                    <Link to="/" style={linkStyle}>
                        Dashboard
                    </Link>
                    <Link to="/about" style={linkStyle}>
                        About
                    </Link>
                </nav>

                {/* Perubahan dinamis tombol Login/Logout */}
                {isAdmin ? (
                    <button onClick={handleLogout} style={logoutBtnStyle}>
                        Logout
                    </button>
                ) : (
                    <Link to="/login">
                        <button style={loginBtnStyle}>Login Admin</button>
                    </Link>
                )}
            </header>

            {/* --- BAGIAN SIDEBAR MELAYANG --- */}

            {/* 1. Backdrop (Lapisan Hitam Transparan) */}
            {isSidebarOpen && (
                <div
                    style={backdropStyle}
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* 2. Panel Sidebar Kanan */}
            <div
                style={{
                    ...sidebarStyle,
                    transform: isSidebarOpen
                        ? 'translateX(0)'
                        : 'translateX(-100%)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <h2 style={{ margin: 0 }}>Menu Admin</h2>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        style={closeBtnStyle}
                    >
                        ✕
                    </button>
                </div>

                {/* Daftar Menu Navigasi Admin */}
                <ul
                    style={{
                        listStyle: 'none',
                        padding: 0,
                        marginTop: '30px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                    }}
                >
                    <NavLink
                        to="/"
                        end // Penanda 'end' memastikan ini hanya aktif jika URL persis "/", tidak aktif jika "/device"
                        onClick={() => setIsSidebarOpen(false)} // Tutup sidebar otomatis saat diklik
                        style={({ isActive }) => ({
                            ...menuItemStyle,
                            // Gaya tambahan saat menu ini aktif (highlight)
                            backgroundColor: isActive ? '#333' : 'transparent',
                            borderLeft: isActive
                                ? '4px solid #4CAF50'
                                : '4px solid transparent',
                            color: isActive ? '#4CAF50' : 'white',
                            paddingLeft: isActive ? '20px' : '15px', // Sedikit geser teksnya saat aktif
                            transition: 'all 0.2s',
                        })}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/device"
                        onClick={() => setIsSidebarOpen(false)}
                        style={({ isActive }) => ({
                            ...menuItemStyle,
                            backgroundColor: isActive ? '#333' : 'transparent',
                            borderLeft: isActive
                                ? '4px solid #4CAF50'
                                : '4px solid transparent',
                            color: isActive ? '#4CAF50' : 'white',
                            paddingLeft: isActive ? '20px' : '15px',
                            transition: 'all 0.2s',
                        })}
                    >
                        Device
                    </NavLink>

                    <NavLink
                        to="/history"
                        onClick={() => setIsSidebarOpen(false)}
                        style={({ isActive }) => ({
                            ...menuItemStyle,
                            backgroundColor: isActive ? '#333' : 'transparent',
                            borderLeft: isActive
                                ? '4px solid #4CAF50'
                                : '4px solid transparent',
                            color: isActive ? '#4CAF50' : 'white',
                            paddingLeft: isActive ? '20px' : '15px',
                            transition: 'all 0.2s',
                        })}
                    >
                        History
                    </NavLink>
                </ul>
            </div>
        </>
    );
}

// --- PENGATURAN CSS OBJECT ---

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#282c34',
    color: 'white',
    position: 'sticky', // Membuat header tetap di atas saat di-scroll
    top: 0,
    zIndex: 1000,
};

const linkStyle = {
    color: 'white',
    margin: '0 15px',
    textDecoration: 'none',
};

const loginBtnStyle = {
    padding: '8px 16px',
    cursor: 'pointer',
    borderRadius: '4px',
    border: 'none',
};

const logoutBtnStyle = {
    padding: '8px 16px',
    cursor: 'pointer',
    borderRadius: '4px',
    border: '1px solid white',
    backgroundColor: 'transparent',
    color: 'white',
    fontWeight: 'bold',
};

const burgerBtnStyle = {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0',
};

// CSS Untuk Backdrop Lapisan Hitam (Z-Index di bawah Sidebar, di atas Header)
const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1999,
};

// CSS Untuk Panel Sidebar (Z-Index tertinggi)
const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '280px',
    height: '100vh',
    backgroundColor: '#1e2229',
    color: 'white',
    padding: '20px',
    boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.3)',
    zIndex: 2000,
    transition: 'transform 0.3s ease-in-out', // Animasi meluncur
};

const closeBtnStyle = {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer',
};

const menuItemStyle = {
    padding: '15px',
    textDecoration: 'none',
    display: 'block',
    fontSize: '16px',
    cursor: 'pointer',
};

export default Header;
