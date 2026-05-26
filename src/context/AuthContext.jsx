import { createContext, useState } from 'react';

// 1. Membuat wadah context
export const AuthContext = createContext();

// 2. Membuat komponen Provider yang akan membungkus aplikasi
export function AuthProvider({ children }) {
    // State untuk menyimpan status login (default: false)
    const [isAdmin, setIsAdmin] = useState(false);

    // Fungsi untuk mengubah status
    const loginAdmin = () => setIsAdmin(true);
    const logoutAdmin = () => setIsAdmin(false);

    return (
        // Membagikan variabel dan fungsi ini ke seluruh komponen di dalamnya
        <AuthContext.Provider value={{ isAdmin, loginAdmin, logoutAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}
