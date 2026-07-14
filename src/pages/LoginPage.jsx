import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authAPI, handleAPIError } from '../services/apiService';

const carouselSlides = [
    {
        title: "Pemantauan Real-time",
        description: "Dapatkan akses langsung ke data kelembapan tanah, suhu udara, kelembapan udara, dan intensitas cahaya dari manapun secara langsung.",
        icon: "📊",
        bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)"
    },
    {
        title: "Otomatisasi Fuzzy Logic",
        description: "Optimalkan penggunaan air dengan sistem otomatisasi penyiraman cerdas berbasis logika fuzzy yang adaptif.",
        icon: "🌱",
        bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)"
    },
    {
        title: "Kontrol Aktuator Cepat",
        description: "Beralih ke mode manual untuk mengendalikan pompa air, solenoid valve, dan motor slider posisi dengan respon instan.",
        icon: "🎛️",
        bgGradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)"
    },
    {
        title: "Analisis Log & Riwayat",
        description: "Pantau audit log terperinci dari setiap perintah kontrol dan metrik durasi eksekusi untuk kehandalan penuh.",
        icon: "📋",
        bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)"
    }
];

function LoginPage() {
    const navigate = useNavigate();
    const { loginAdmin } = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);

    // Carousel Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Username dan password harus diisi');
            return;
        }

        try {
            const response = await authAPI.login(username, password);
            if (response.data && response.data.success) {
                loginAdmin(username);
                navigate('/');
            } else {
                setError(
                    response.data?.message || 'Username atau password salah',
                );
            }
        } catch (err) {
            const errDetails = handleAPIError(err);
            setError(errDetails.message || 'Gagal menghubungi server');
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-900 text-white font-sans overflow-hidden">
            {/* Left Side: Carousel (hidden on mobile/tablet) */}
            <div className="hidden lg:flex lg:flex-[1.2] relative flex-col justify-center items-center bg-slate-950 border-r border-slate-800/40">
                {/* Carousel Slides Container */}
                <div className="relative w-full h-full">
                    {carouselSlides.map((slide, index) => {
                        const isActive = index === currentSlide;
                        return (
                            <div
                                key={index}
                                className={`absolute inset-0 flex flex-col justify-center items-center p-16 text-center transition-all duration-1000 ${
                                    isActive ? 'opacity-100 visible' : 'opacity-0 invisible'
                                }`}
                                style={{ background: slide.bgGradient }}
                            >
                                <div
                                    className={`text-[90px] mb-8 select-none transition-transform duration-1000 ${
                                        isActive ? 'translate-y-0' : 'translate-y-4'
                                    }`}
                                >
                                    {slide.icon}
                                </div>
                                <h2 className="text-3xl font-extrabold text-white mb-5 tracking-tight">
                                    {slide.title}
                                </h2>
                                <p className="text-base text-slate-400 leading-relaxed max-w-lg mx-auto">
                                    {slide.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Dots Pagination */}
                <div className="absolute bottom-12 flex gap-3 z-10">
                    {carouselSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2.5 rounded-full border-none cursor-pointer transition-all duration-300 ${
                                index === currentSlide ? 'w-7 bg-emerald-500' : 'w-2.5 bg-white/20'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-slate-900 lg:bg-transparent relative">
                {/* Background decorative elements */}
                <div className="absolute -bottom-1/4 -left-1/4 w-80 h-80 bg-emerald-500/5 filter blur-3xl rounded-full pointer-events-none"></div>

                {/* Login Card */}
                <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl border border-slate-700/40 bg-slate-800/60 shadow-2xl backdrop-blur-md z-10">
                    {/* Logo Section */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20">
                            🌿
                        </div>
                        <div className="text-left">
                            <div className="text-base font-bold text-white leading-tight tracking-wide">
                                Smart Greenhouse
                            </div>
                            <div className="text-xs text-slate-400 font-medium mt-0.5">
                                FIK UPNVJ
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-center text-xl sm:text-2xl font-extrabold mb-1.5 text-white">
                        Login Operator
                    </h1>
                    <p className="text-center text-xs sm:text-sm text-slate-400 mb-8">
                        Masukkan akun untuk mengelola rumah kaca
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3.5 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
                            ⚠️ <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Username Input */}
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="Masukkan username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-700/60 bg-slate-900/60 text-white text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-all duration-300"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Masukkan password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-700/60 bg-slate-900/60 text-white text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-all duration-300"
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full py-3.5 rounded-lg border-none bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-sm font-bold cursor-pointer shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300 mt-2"
                        >
                            Masuk Ke Dashboard
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
