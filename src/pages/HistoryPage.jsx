import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

function HistoryPage() {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setIsLoading(true);
                const response = await apiService.recordsAPI.getControlLogs(100);
                setLogs(response.data);
                setError(null);
            } catch (err) {
                const formattedError = apiService.handleAPIError(err);
                setError(formattedError.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, []);

    // Memfilter log berdasarkan kata kunci pencarian
    const filteredLogs = logs.filter(
        (log) =>
            (log.action && log.action.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (log.device_target && log.device_target.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (log.status && log.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (log.created_at && log.created_at.includes(searchQuery)),
    );

    // Memetakan perintah teknis ke bahasa yang mudah dimengerti pengguna
    const formatCommand = (action) => {
        if (!action) return '--';
        const actionLower = action.toLowerCase();
        if (actionLower === 'pump_on') return 'Nyalakan Pompa';
        if (actionLower === 'pump_off') return 'Matikan Pompa';
        if (actionLower === 'valve_on') return 'Buka Valve';
        if (actionLower === 'valve_off') return 'Tutup Valve';
        if (actionLower === 'move_to') return 'Geser Slider';
        return action;
    };

    // Memetakan target teknis ke nama perangkat yang deskriptif
    const formatTarget = (log) => {
        const payload = log.payload_sent || {};
        const action = log.action || '';
        const actionLower = action.toLowerCase();
        
        if (actionLower.includes('pump')) {
            return 'Pompa Air';
        }
        
        const target = payload.target || log.device_target;
        if (!target) return 'Sistem';
        
        const targetStr = String(target).toUpperCase();
        if (targetStr === 'SWITCH_HOME' || targetStr === 'HOME') return 'Home Position';
        if (targetStr === 'SWITCH_1' || targetStr === '1') return 'Posisi 1';
        if (targetStr === 'SWITCH_2' || targetStr === '2') return 'Posisi 2';
        if (targetStr === 'SWITCH_3' || targetStr === '3') return 'Posisi 3';
        if (targetStr === 'VALVE_1') return 'Solenoid Valve 1';
        if (targetStr === 'VALVE_2') return 'Solenoid Valve 2';
        
        return target;
    };

    // Menghasilkan objek gaya visual status badge berdasarkan nilai status log
    const getStatusBadgeConfig = (status) => {
        const statusLower = status ? status.toLowerCase() : '';
        if (statusLower === 'done' || statusLower === 'success') {
            return { text: 'Selesai', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)' };
        }
        if (statusLower === 'sent' || statusLower === 'pending') {
            return { text: 'Proses...', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.15)' };
        }
        return { text: 'Gagal', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)' };
    };

    // Definisi Kolom Tabel Dinamis
    const tableColumns = [
        {
            key: 'created_at',
            label: 'Waktu',
            width: '180px',
            render: (val) => (val ? new Date(val).toLocaleString('id-ID') : '--'),
        },
        {
            key: 'is_automated',
            label: 'Mode',
            width: '110px',
            render: (val) => (val ? '🤖 Otomatis' : '👤 Manual'),
        },
        {
            key: 'action',
            label: 'Perintah',
            width: '150px',
            render: (val) => formatCommand(val),
        },
        {
            key: 'device_target',
            label: 'Tujuan',
            width: '150px',
            render: (val, log) => formatTarget(log),
        },
        {
            key: 'status',
            label: 'Status',
            width: '130px',
            render: (val) => {
                const badge = getStatusBadgeConfig(val);
                return (
                    <span
                        style={{
                            color: badge.color,
                            backgroundColor: badge.bgColor,
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            border: `1px solid ${badge.color}30`,
                            display: 'inline-block',
                        }}
                    >
                        {badge.text}
                    </span>
                );
            },
        },
        {
            key: 'detail',
            label: 'Detail Eksekusi',
            width: '1fr',
            render: (_, log) => {
                const durationText = log.duration_ms !== null && log.duration_ms !== undefined 
                    ? `${log.duration_ms} ms` 
                    : null;
                const retryText = log.retry_count > 0 ? `Retry: ${log.retry_count}` : null;
                
                if (durationText && retryText) return `${durationText} (${retryText})`;
                if (durationText) return durationText;
                if (retryText) return retryText;
                return '--';
            },
        },
    ];

    // Menggabungkan konfigurasi lebar kolom untuk gridTemplateColumns CSS
    const gridTemplateColumns = tableColumns.map((col) => col.width).join(' ');

    // Manajemen Halaman (Pagination)
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedLogs = filteredLogs.slice(startIndex, endIndex);

    return (
        <div>
            {/* Judul Halaman */}
            <h1
                style={{
                    fontSize: '48px',
                    fontWeight: '700',
                    marginBottom: '40px',
                    color: '#ffffff',
                }}
            >
                Log Aktivitas
            </h1>

            {/* Kotak Pencarian */}
            <div
                style={{
                    marginBottom: '30px',
                    display: 'flex',
                    gap: '10px',
                }}
            >
                <div
                    style={{
                        position: 'relative',
                        flex: 1,
                    }}
                >
                    <input
                        type="text"
                        placeholder="Cari logs (aksi, perangkat, status, atau waktu)..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        style={{
                            width: '100%',
                            padding: '12px 16px 12px 40px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor: '#1e293b',
                            color: '#ffffff',
                            fontSize: '14px',
                            outline: 'none',
                        }}
                    />
                    <span
                        style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94a3b8',
                            fontSize: '16px',
                        }}
                    >
                        🔍
                    </span>
                </div>
            </div>

            {/* Wadah Tabel Log */}
            <div
                style={{
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: '#1e293b',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
            >
                {/* Header Tabel */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: gridTemplateColumns,
                        gap: '20px',
                        padding: '20px',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    {tableColumns.map((col) => (
                        <div
                            key={col.key}
                            style={{
                                color: '#94a3b8',
                                fontWeight: '600',
                                fontSize: '14px',
                            }}
                        >
                            {col.label}
                        </div>
                    ))}
                </div>

                {/* Konten Utama Tabel */}
                {isLoading ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#cbd5e1' }}>
                        Memuat log aktivitas...
                    </div>
                ) : error ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#ef4444' }}>
                        Gagal memuat log: {error}
                    </div>
                ) : displayedLogs.length > 0 ? (
                    displayedLogs.map((log) => (
                        <div
                            key={log.id}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: gridTemplateColumns,
                                gap: '20px',
                                padding: '20px',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                alignItems: 'center',
                            }}
                        >
                            {tableColumns.map((col) => (
                                <div key={col.key} style={{ color: '#cbd5e1', fontSize: '13px' }}>
                                    {col.render(log[col.key], log)}
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <div
                        style={{
                            padding: '40px 20px',
                            textAlign: 'center',
                            color: '#64748b',
                        }}
                    >
                        Tidak ada log aktivitas yang ditemukan.
                    </div>
                )}
            </div>

            {/* Navigasi Halaman (Pagination) */}
            {totalPages > 1 && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '30px',
                    }}
                >
                    {/* Tombol Sebelumnya */}
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor:
                                currentPage === 1 ? 'rgba(255, 255, 255, 0.05)' : '#1e293b',
                            color: currentPage === 1 ? '#64748b' : '#cbd5e1',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                        }}
                    >
                        ← Sebelumnya
                    </button>

                    {/* Angka Halaman */}
                    <div style={{ display: 'flex', gap: '5px' }}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '6px',
                                    border:
                                        page === currentPage
                                            ? '1px solid #10b981'
                                            : '1px solid rgba(255, 255, 255, 0.1)',
                                    backgroundColor:
                                        page === currentPage
                                            ? 'rgba(16, 185, 129, 0.15)'
                                            : '#1e293b',
                                    color: page === currentPage ? '#10b981' : '#cbd5e1',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                }}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    {/* Tombol Berikutnya */}
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor:
                                currentPage === totalPages
                                    ? 'rgba(255, 255, 255, 0.05)'
                                    : '#1e293b',
                            color: currentPage === totalPages ? '#64748b' : '#cbd5e1',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                        }}
                    >
                        Berikutnya →
                    </button>
                </div>
            )}
        </div>
    );
}

export default HistoryPage;

