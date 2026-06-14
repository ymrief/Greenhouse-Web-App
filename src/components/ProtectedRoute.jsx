import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute() {
    const { isAdmin, loading } = useContext(AuthContext);

    // Tampilkan screen loading premium jika proses pengecekan sesi sedang berjalan
    if (loading) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    color: '#ffffff',
                }}
            >
                <div
                    style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid rgba(16, 185, 129, 0.1)',
                        borderTop: '4px solid #10b981',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '20px',
                    }}
                ></div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#cbd5e1', letterSpacing: '0.5px' }}>
                    Memeriksa Sesi Operator...
                </div>
            </div>
        );
    }

    // Jika bukan admin, arahkan paksa ke halaman login
    // Atribut 'replace' menghapus riwayat halaman ini agar user tidak bisa memencet tombol 'Back'
    if (!isAdmin) {
        return <Navigate to="/login" replace />;
    }

    // Jika admin, izinkan masuk ke komponen anak yang ada di dalamnya (Outlet)
    return <Outlet />;
}
export default ProtectedRoute;
