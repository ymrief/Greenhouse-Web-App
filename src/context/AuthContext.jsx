import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/apiService';

// 1. Membuat wadah context
export const AuthContext = createContext();

// 2. Membuat komponen Provider yang akan membungkus aplikasi
export function AuthProvider({ children }) {
    // State untuk menyimpan status login (default: false)
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fungsi untuk mengecek status login dari backend secara stateless
    const checkSession = async () => {
        try {
            const response = await authAPI.checkSession();
            if (response.data && response.data.success) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        } catch (err) {
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    // Jalankan pengecekan session saat komponen pertama kali dimuat
    useEffect(() => {
        checkSession();
    }, []);

    // Fungsi untuk mengubah status
    const loginAdmin = () => setIsAdmin(true);
    const logoutAdmin = () => setIsAdmin(false);

    return (
        // Membagikan variabel dan fungsi ini ke seluruh komponen di dalamnya
        <AuthContext.Provider value={{ isAdmin, loading, loginAdmin, logoutAdmin, checkSession }}>
            {children}
        </AuthContext.Provider>
    );
}

