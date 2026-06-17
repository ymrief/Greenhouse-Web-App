import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/apiService';

// 1. Membuat wadah context
export const AuthContext = createContext();

// 2. Membuat komponen Provider yang akan membungkus aplikasi
export function AuthProvider({ children }) {
    // State untuk menyimpan status login dan data admin
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminUser, setAdminUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fungsi untuk mengecek status login dari backend secara stateless
    const checkSession = async () => {
        try {
            const response = await authAPI.checkSession();
            if (response.data && response.data.success) {
                setIsAdmin(true);
                setAdminUser(response.data.admin?.username || 'Operator');
            } else {
                setIsAdmin(false);
                setAdminUser(null);
            }
        } catch (err) {
            setIsAdmin(false);
            setAdminUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Jalankan pengecekan session saat komponen pertama kali dimuat
    useEffect(() => {
        checkSession();
    }, []);

    // Fungsi untuk mengubah status login
    const loginAdmin = (username) => {
        setIsAdmin(true);
        setAdminUser(username || 'Operator');
    };
    const logoutAdmin = () => {
        setIsAdmin(false);
        setAdminUser(null);
    };

    return (
        // Membagikan variabel dan fungsi ini ke seluruh komponen di dalamnya
        <AuthContext.Provider value={{ isAdmin, adminUser, loading, loginAdmin, logoutAdmin, checkSession }}>
            {children}
        </AuthContext.Provider>
    );
}

