import { useState } from 'react';
import axios from 'axios';

// Konfigurasi dasar Axios
const api = axios.create({
    baseURL: 'http://localhost:8080', // Sesuaikan dengan port FastAPI Anda
    headers: { 'Content-Type': 'application/json' },
});

export function useDeviceControl() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fungsi khusus memanggil /control/pompa
    const togglePompa = async (action) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post('/control/pompa', {
                action: action,
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.detail || 'Gagal menghubungi FastAPI');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi khusus memanggil /control/solenoid
    const toggleSolenoid = async (targetValve, action) => {
        setIsLoading(true);
        try {
            const response = await api.post('/control/solenoid', {
                target: targetValve,
                action: action,
            });
            return response.data;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi khusus memanggil /control/slider
    const setSlider = async (targetPosition) => {
        try {
            const response = await api.post('/control/slider', {
                target: targetPosition, // Kirim 'home', '1', '2', atau '3'
            });
            return response.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    // Mengembalikan fungsi-fungsi agar bisa dipanggil dari komponen UI
    return {
        togglePompa,
        toggleSolenoid,
        setSlider,
        isLoading,
        error,
    };
}
