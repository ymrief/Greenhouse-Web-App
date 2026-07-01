import { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../services/apiService';

function Header() {
    const { isAdmin, logoutAdmin } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await authAPI.logout();
        } catch (err) {
            console.error('Gagal logout di server:', err);
        }
        logoutAdmin();
        setIsSidebarOpen(false);
        setIsProfileOpen(false);
        navigate('/');
    };

    return (
        <>
            {/* Header Utama */}
            <header style={headerStyle}>
                {/* Logo dan Burger Menu */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                    }}
                >
                    {/* Burger Button untuk Admin */}
                    {isAdmin && (
                        <button
                            style={burgerBtnStyle}
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            ☰
                        </button>
                    )}

                    {/* Logo */}
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    background:
                                        'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px',
                                }}
                            >
                                🌿
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        color: '#ffffff',
                                    }}
                                >
                                    Smart Greenhouse
                                </div>
                                <div
                                    style={{
                                        fontSize: '12px',
                                        color: '#94a3b8',
                                    }}
                                >
                                    FIK UPNVJ
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav
                    style={{
                        display: 'flex',
                        gap: '20px',
                        alignItems: 'center',
                    }}
                >
                    <NavLink
                        to="/"
                        end
                        style={({ isActive }) => ({
                            ...navLinkStyle,
                            color: isActive ? '#10b981' : '#cbd5e1',
                            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                        })}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/about"
                        style={({ isActive }) => ({
                            ...navLinkStyle,
                            color: isActive ? '#10b981' : '#cbd5e1',
                            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                        })}
                    >
                        Tentang Projek
                    </NavLink>
                </nav>

                {/* Right Section - Login/Profile */}
                <div
                    style={{
                        display: 'flex',
                        gap: '20px',
                        alignItems: 'center',
                    }}
                >
                    {isAdmin ? (
                        <div style={{ position: 'relative' }}>
                            <button
                                style={profileBtnStyle}
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                👤
                            </button>
                            {isProfileOpen && (
                                <div style={profileMenuStyle}>
                                    <div style={profileMenuItemStyle}>
                                        <span style={{ fontWeight: '600' }}>
                                            Operator
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        style={logoutMenuItemStyle}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login">
                            <button style={loginBtnStyle}>
                                Login Operator
                            </button>
                        </Link>
                    )}
                </div>
            </header>

            {/* Sidebar untuk Admin */}
            {isSidebarOpen && (
                <div
                    style={backdropStyle}
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <div
                style={{
                    ...sidebarStyle,
                    transform: isSidebarOpen
                        ? 'translateX(0)'
                        : 'translateX(-100%)',
                }}
            >
                {/* Header Sidebar */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '30px',
                        paddingBottom: '20px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize: '20px',
                            fontWeight: '700',
                        }}
                    >
                        Smart Greenhouse
                    </h2>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        style={closeBtnStyle}
                    >
                        ✕
                    </button>
                </div>

                {/* Menu Items */}
                <ul
                    style={{
                        listStyle: 'none',
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                    }}
                >
                    <NavLink
                        to="/"
                        end
                        onClick={() => setIsSidebarOpen(false)}
                        style={({ isActive }) => ({
                            ...menuItemStyle,
                            backgroundColor: isActive
                                ? 'rgba(16, 185, 129, 0.15)'
                                : 'transparent',
                            borderLeft: isActive
                                ? '4px solid #10b981'
                                : '4px solid transparent',
                            color: isActive ? '#10b981' : '#cbd5e1',
                            paddingLeft: isActive ? '16px' : '20px',
                        })}
                    >
                        📊 Dashboard
                    </NavLink>

                    <NavLink
                        to="/device"
                        onClick={() => setIsSidebarOpen(false)}
                        style={({ isActive }) => ({
                            ...menuItemStyle,
                            backgroundColor: isActive
                                ? 'rgba(16, 185, 129, 0.15)'
                                : 'transparent',
                            borderLeft: isActive
                                ? '4px solid #10b981'
                                : '4px solid transparent',
                            color: isActive ? '#10b981' : '#cbd5e1',
                            paddingLeft: isActive ? '16px' : '20px',
                        })}
                    >
                        🎛️ Device
                    </NavLink>

                    <NavLink
                        to="/history"
                        onClick={() => setIsSidebarOpen(false)}
                        style={({ isActive }) => ({
                            ...menuItemStyle,
                            backgroundColor: isActive
                                ? 'rgba(16, 185, 129, 0.15)'
                                : 'transparent',
                            borderLeft: isActive
                                ? '4px solid #10b981'
                                : '4px solid transparent',
                            color: isActive ? '#10b981' : '#cbd5e1',
                            paddingLeft: isActive ? '16px' : '20px',
                        })}
                    >
                        📋 History
                    </NavLink>
                </ul>
            </div>
        </>
    );
}

/* Styles */
const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    backgroundColor: '#1e293b',
    color: 'white',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
};

const burgerBtnStyle = {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const navLinkStyle = {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
};

const profileBtnStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
};

const loginBtnStyle = {
    padding: '10px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
};

const profileMenuStyle = {
    position: 'absolute',
    top: '50px',
    right: '0',
    background: '#1e293b',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    minWidth: '200px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
    zIndex: 1001,
    overflow: 'hidden',
};

const profileMenuItemStyle = {
    padding: '12px 16px',
    color: '#cbd5e1',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '14px',
};

const logoutMenuItemStyle = {
    width: '100%',
    padding: '12px 16px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
};

const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1999,
};

const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '280px',
    height: '100vh',
    backgroundColor: '#0f172a',
    color: 'white',
    padding: '20px',
    boxShadow: '4px 0 15px rgba(0, 0, 0, 0.3)',
    zIndex: 2000,
    transition: 'transform 0.3s ease-in-out',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
};

const closeBtnStyle = {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0',
};

const menuItemStyle = {
    padding: '12px 20px',
    textDecoration: 'none',
    display: 'block',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.2s',
    fontWeight: '500',
};

export default Header;
