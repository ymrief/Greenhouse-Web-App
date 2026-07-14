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
            <header className="flex justify-between items-center px-4 md:px-10 py-4 bg-slate-800/80 text-white border-b border-slate-700/50 sticky top-0 z-40 backdrop-blur-md">
                {/* Logo dan Burger Menu */}
                <div className="flex items-center gap-4">
                    {/* Burger Button - Visible on mobile, and visible on desktop ONLY IF isAdmin */}
                    <button
                        className={`flex ${isAdmin ? '' : 'md:hidden'} text-2xl cursor-pointer text-slate-300 hover:text-white transition-colors p-1`}
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Open Menu"
                    >
                        ☰
                    </button>

                    {/* Logo */}
                    <Link to="/" className="no-underline">
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center text-xl shadow-md shadow-emerald-500/20">
                                🌿
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white tracking-wide leading-tight">
                                    Smart Greenhouse
                                </div>
                                <div className="text-xs text-slate-400 font-medium">
                                    FIK UPNVJ
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Navigation Links - Desktop Only */}
                <nav className="hidden md:flex items-center gap-1.5">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                                isActive
                                    ? 'text-emerald-400 bg-emerald-500/10'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-700/40'
                            }`
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            `text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                                isActive
                                    ? 'text-emerald-400 bg-emerald-500/10'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-700/40'
                            }`
                        }
                    >
                        Tentang Projek
                    </NavLink>
                </nav>

                {/* Right Section - Login/Profile - Desktop Only */}
                <div className="hidden md:flex items-center gap-4">
                    {isAdmin ? (
                        <div className="relative">
                            <button
                                className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-base cursor-pointer flex items-center justify-center transition-all"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                👤
                            </button>
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 bg-slate-800 border border-slate-700/60 rounded-xl w-48 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 text-slate-300 text-xs border-b border-slate-700/50">
                                        Masuk sebagai:{' '}
                                        <span className="font-bold text-white block mt-0.5">
                                            Operator
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all cursor-pointer"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login">
                            <button className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-lg font-bold text-sm cursor-pointer shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all">
                                Login Operator
                            </button>
                        </Link>
                    )}
                </div>

                {/* Mobile Right Section Status Indicator */}
                {!isAdmin && (
                    <div className="flex md:hidden">
                        <Link to="/login">
                            <button className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-md font-semibold text-xs transition-all">
                                Login
                            </button>
                        </Link>
                    </div>
                )}
                {isAdmin && (
                    <div className="flex md:hidden">
                        <span className="text-xs px-2.5 py-1 bg-blue-500/15 text-blue-400 border border-blue-500/20 rounded-full font-bold">
                            Operator
                        </span>
                    </div>
                )}
            </header>

            {/* Sidebar / Drawer untuk Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 w-screen h-screen bg-black/60 z-45 backdrop-blur-xs transition-opacity duration-305"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <div
                className={`fixed top-0 left-0 w-72 h-screen bg-slate-900 text-white p-6 shadow-2xl z-50 transition-transform duration-300 ease-in-out border-r border-slate-800/80 flex flex-col justify-between ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div>
                    {/* Header Sidebar */}
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-805">
                        <h2 className="m-0 text-lg font-extrabold text-emerald-400 tracking-wide">
                            Smart Greenhouse
                        </h2>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="bg-transparent border-none text-slate-400 hover:text-white text-xl cursor-pointer p-1"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex flex-col gap-2">
                        <NavLink
                            to="/"
                            end
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all border-l-4 ${
                                    isActive
                                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                                        : 'border-transparent text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                }`
                            }
                        >
                            📊 Dashboard
                        </NavLink>

                        {/* Tautan Khusus Admin di Sidebar */}
                        {isAdmin && (
                            <>
                                <NavLink
                                    to="/device"
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all border-l-4 ${
                                            isActive
                                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                                                : 'border-transparent text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                        }`
                                    }
                                >
                                    🎛️ Device
                                </NavLink>

                                <NavLink
                                    to="/history"
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all border-l-4 ${
                                            isActive
                                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                                                : 'border-transparent text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                        }`
                                    }
                                >
                                    📋 History
                                </NavLink>
                            </>
                        )}

                        <NavLink
                            to="/about"
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex md:hidden items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all border-l-4 ${
                                    isActive
                                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                                        : 'border-transparent text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                }`
                            }
                        >
                            ℹ️ Tentang Projek
                        </NavLink>
                    </nav>
                </div>

                {/* Footer Sidebar (Auth Status & Actions for Mobile) */}
                <div className="pt-4 border-t border-slate-800">
                    {isAdmin ? (
                        <div className="flex flex-col gap-3">
                            <div className="px-2 text-xs text-slate-400">
                                Logged in as:{' '}
                                <strong className="text-white block mt-0.5">
                                    Operator
                                </strong>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-sm transition-colors cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            onClick={() => setIsSidebarOpen(false)}
                            className="block no-underline"
                        >
                            <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-sm transition-all cursor-pointer shadow-md shadow-emerald-500/10">
                                Login Operator
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}

export default Header;
