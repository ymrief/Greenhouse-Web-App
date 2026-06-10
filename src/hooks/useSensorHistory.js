import { useState, useEffect, useRef } from 'react';
import apiService from '../services/apiService'; // Sesuaikan path jika folder hooks sejajar dengan services

export const useSensorHistory = (limit = 20) => {
    const [historyData, setHistoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const wsRef = useRef(null);

    useEffect(() => {
        // ==========================================
        // 1. INITIAL LOAD (HTTP GET)
        // ==========================================
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                const response = await apiService.recordsAPI.getHistory(limit);
                setHistoryData(response.data);
                setError(null);
            } catch (err) {
                const formattedError = apiService.handleAPIError(err);
                setError(formattedError.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();

        // ==========================================
        // 2. REAL-TIME UPDATES (WEBSOCKET)
        // ==========================================
        wsRef.current = new apiService.WebSocketClient();

        wsRef.current
            .connect()
            .then(() => {
                console.log(
                    '[WS] Dashboard berhasil berlangganan data real-time.',
                );
            })
            .catch((err) => {
                console.error('[WS] Gagal menghubungkan WebSocket', err);
            });

        // Mendengarkan broadcast data dari backend saat ada data masuk baru
        wsRef.current.on('message', (newData) => {
            setHistoryData((prevData) => {
                // Sisipkan data baru ke index terdepan, lalu batasi panjang array sesuai limit
                const combinedData = [newData, ...prevData];
                return combinedData.slice(0, limit);
            });
        });

        // Membersihkan koneksi ketika komponen dilepas (unmounted)
        return () => {
            if (wsRef.current) {
                wsRef.current.disconnect();
            }
        };
    }, [limit]);

    return { historyData, isLoading, error };
};
