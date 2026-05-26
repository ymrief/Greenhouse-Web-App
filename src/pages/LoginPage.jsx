import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
    const navigate = useNavigate();

    const { loginAdmin } = useContext(AuthContext);

    // 1. Siapkan daftar URL gambar untuk background (bisa pakai gambar lokal di folder public)
    const backgroundImages = [
        'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?q=80&w=1920&auto=format&fit=crop', // Gambar hardware/chip
        'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1920&auto=format&fit=crop', // Gambar data/grafik
        'https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?q=80&w=1920&auto=format&fit=crop', // Gambar server/jaringan
    ];

    // 2. State untuk menyimpan indeks gambar yang sedang aktif (mulai dari 0)
    const [currentIndex, setCurrentIndex] = useState(0);

    // 3. useEffect untuk menjalankan timer slideshow
    useEffect(() => {
        // Mengatur interval setiap 5000 milidetik (5 detik)
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                // Jika sudah di gambar terakhir, kembali ke 0. Jika belum, lanjut ke gambar berikutnya.
                return prevIndex === backgroundImages.length - 1
                    ? 0
                    : prevIndex + 1;
            });
        }, 5000);

        // CLEANUP: Sangat penting di React! Membersihkan timer saat pengguna pindah halaman
        // agar tidak terjadi kebocoran memori (memory leak).
        return () => clearInterval(timer);
    }, [backgroundImages.length]);

    // Fungsi simulasi login
    const handleLogin = (e) => {
        e.preventDefault();

        // 1. Panggil fungsi untuk mengubah global state menjadi admin
        loginAdmin();

        // 2. Alihkan kembali ke dashboard
        navigate('/');
    };

    return (
        // Kontainer utama dengan background dinamis
        <div
            style={{
                backgroundImage: `url(${backgroundImages[currentIndex]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'background-image 1s ease-in-out', // Efek transisi halus saat gambar berganti
                margin: '-20px', // Mengkompensasi padding dari Layout utama (jika ada)
            }}
        >
            {/* Kotak Form Login */}
            <div
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Warna putih agak transparan
                    padding: '40px',
                    borderRadius: '10px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    width: '100%',
                    maxWidth: '400px',
                    textAlign: 'center',
                }}
            >
                <h2 style={{ marginBottom: '20px', color: '#333' }}>
                    Login Admin
                </h2>

                <form
                    onSubmit={handleLogin}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                    }}
                >
                    <input
                        type="text"
                        placeholder="Username"
                        style={inputStyle}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        style={inputStyle}
                        required
                    />
                    <button type="submit" style={btnStyle}>
                        Masuk
                    </button>
                </form>
            </div>
        </div>
    );
}

// Sedikit styling tambahan untuk input dan tombol
const inputStyle = {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
};

const btnStyle = {
    padding: '12px',
    backgroundColor: '#282c34',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
};

export default LoginPage;
