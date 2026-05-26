import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute() {
    const { isAdmin } = useContext(AuthContext);

    // Jika bukan admin, arahkan paksa ke halaman login
    // Atribut 'replace' menghapus riwayat halaman ini agar user tidak bisa memencet tombol 'Back'
    if (!isAdmin) {
        return <Navigate to="/login" replace />;
    }

    // Jika admin, izinkan masuk ke komponen anak yang ada di dalamnya (Outlet)
    return <Outlet />;
}

export default ProtectedRoute;
