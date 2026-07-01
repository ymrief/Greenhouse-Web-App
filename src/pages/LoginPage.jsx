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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

    // Responsive Window Resize Listener
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 900);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                fontFamily: "'Inter', sans-serif",
                overflow: 'hidden',
            }}
        >
            {/* Left Side: Carousel (hidden on mobile) */}
            {!isMobile && (
                <div
                    style={{
                        flex: 1.2,
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#111827',
                        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                >
                    {/* Carousel Slides Container */}
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        {carouselSlides.map((slide, index) => {
                            const isActive = index === currentSlide;
                            return (
                                <div
                                    key={index}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: '60px',
                                        textAlign: 'center',
                                        opacity: isActive ? 1 : 0,
                                        visibility: isActive ? 'visible' : 'hidden',
                                        transition: 'opacity 0.8s ease, visibility 0.8s ease',
                                        background: slide.bgGradient,
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: '90px',
                                            marginBottom: '30px',
                                            transform: isActive ? 'translateY(0)' : 'translateY(15px)',
                                            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                            userSelect: 'none',
                                        }}
                                    >
                                        {slide.icon}
                                    </div>
                                    <h2
                                        style={{
                                            fontSize: '32px',
                                            fontWeight: '800',
                                            color: '#ffffff',
                                            marginBottom: '20px',
                                            letterSpacing: '-0.5px',
                                        }}
                                    >
                                        {slide.title}
                                    </h2>
                                    <p
                                        style={{
                                            fontSize: '16px',
                                            color: '#94a3b8',
                                            lineHeight: '1.8',
                                            maxWidth: '520px',
                                            margin: '0 auto',
                                        }}
                                    >
                                        {slide.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Dots Pagination */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '50px',
                            display: 'flex',
                            gap: '12px',
                            zIndex: 10,
                        }}
                    >
                        {carouselSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                style={{
                                    width: index === currentSlide ? '28px' : '10px',
                                    height: '10px',
                                    borderRadius: '5px',
                                    border: 'none',
                                    backgroundColor: index === currentSlide ? '#10b981' : 'rgba(255, 255, 255, 0.2)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Right Side: Login Form */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                    background: isMobile ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : '#0f172a',
                    position: 'relative',
                }}
            >
                {/* Background decorative elements */}
                <div style={{
                    position: 'absolute',
                    bottom: '-20%',
                    left: '-20%',
                    width: '350px',
                    height: '350px',
                    background: 'rgba(16, 185, 129, 0.05)',
                    filter: 'blur(100px)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                }}></div>

                {/* Login Card */}
                <div
                    style={{
                        width: '100%',
                        maxWidth: '420px',
                        padding: '45px 35px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        backgroundColor: 'rgba(30, 41, 59, 0.65)',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(12px)',
                        zIndex: 2,
                    }}
                >
                    {/* Logo Section */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            marginBottom: '35px',
                        }}
                    >
                        <div
                            style={{
                                width: '46px',
                                height: '46px',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)',
                            }}
                        >
                            🌿
                        </div>
                        <div>
                            <div
                                style={{
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    color: '#ffffff',
                                    lineHeight: '1.2',
                                }}
                            >
                                Smart Greenhouse
                            </div>
                            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                                FIK UPNVJ
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1
                        style={{
                            textAlign: 'center',
                            fontSize: '24px',
                            fontWeight: '800',
                            marginBottom: '8px',
                            color: '#ffffff',
                        }}
                    >
                        Login Operator
                    </h1>
                    <p style={{ textAlign: 'center', fontSize: '14px', color: '#94a3b8', marginBottom: '28px' }}>
                        Masukkan akun untuk mengelola rumah kaca
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div
                            style={{
                                padding: '12px',
                                marginBottom: '20px',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                color: '#ef4444',
                                fontSize: '13px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            ⚠️ <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin}>
                        {/* Username Input */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="Masukkan username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    backgroundColor: 'rgba(15, 23, 42, 0.5)',
                                    color: '#ffffff',
                                    fontSize: '14px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'all 0.3s ease',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#10b981';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        {/* Password Input */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Masukkan password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    backgroundColor: 'rgba(15, 23, 42, 0.5)',
                                    color: '#ffffff',
                                    fontSize: '14px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'all 0.3s ease',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#10b981';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.15)';
                            }}
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
