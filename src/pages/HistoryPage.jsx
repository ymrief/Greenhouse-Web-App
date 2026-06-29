import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

function HistoryPage() {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchFocus, setSearchFocus] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        const ws = new apiService.ControlLogWebSocketClient();

        ws.connect()
            .then(() => {
                console.log('[WS] Connected to control logs websocket');
            })
            .catch((err) => {
                console.error('[WS] Failed to connect to control logs websocket:', err);
                setError('Koneksi real-time terputus. Silakan muat ulang halaman.');
                setIsLoading(false);
            });

        ws.on('message', (message) => {
            if (!message || !message.type) return;

            if (message.type === 'control_log_snapshot') {
                setLogs(message.logs || []);
                setIsLoading(false);
                setError(null);
            } else if (message.type === 'control_log_new') {
                const newLogs = message.logs || [];
                setLogs((prevLogs) => {
                    // Filter out any duplicate logs by id to prevent duplicates in rendering
                    const filteredNew = newLogs.filter(
                        (nl) => !prevLogs.some((pl) => pl.id === nl.id)
                    );
                    return [...filteredNew, ...prevLogs];
                });
            }
        });

        ws.on('error', (err) => {
            console.error('[WS] Control logs WS error:', err);
            setError('Terjadi kesalahan koneksi real-time.');
        });

        ws.on('disconnected', () => {
            console.log('[WS] Control logs WS disconnected');
        });

        ws.on('maxReconnectAttemptsExceeded', () => {
            setError('Koneksi real-time gagal terhubung kembali setelah beberapa percobaan.');
            setIsLoading(false);
        });

        return () => {
            ws.disconnect();
        };
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
                    marginBottom: '20px',
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
                        onFocus={() => setSearchFocus(true)}
                        onBlur={() => setSearchFocus(false)}
                        style={{
                            width: '100%',
                            padding: '12px 16px 12px 40px',
                            borderRadius: '8px',
                            border: searchFocus ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor: '#1e293b',
                            color: '#ffffff',
                            fontSize: '14px',
                            outline: 'none',
                            boxShadow: searchFocus ? '0 0 0 3px rgba(16, 185, 129, 0.15)' : 'none',
                            transition: 'all 0.3s ease',
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

            {/* Status Record Count */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                    Menampilkan <span style={{ color: '#ffffff', fontWeight: '600' }}>{filteredLogs.length > 0 ? startIndex + 1 : 0}</span> - <span style={{ color: '#ffffff', fontWeight: '600' }}>{Math.min(endIndex, filteredLogs.length)}</span> dari <span style={{ color: '#ffffff', fontWeight: '600' }}>{filteredLogs.length}</span> log aktivitas
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
                        padding: '16px 20px 16px 23px',
                        backgroundColor: 'rgba(0, 0, 0, 0.25)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    {tableColumns.map((col) => (
                        <div
                            key={col.key}
                            style={{
                                color: '#94a3b8',
                                fontWeight: '700',
                                fontSize: '13px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
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
                        <TableRow
                            key={log.id}
                            log={log}
                            columns={tableColumns}
                            gridTemplateColumns={gridTemplateColumns}
                        />
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
                    <PaginationButton
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        ← Sebelumnya
                    </PaginationButton>

                    <div style={{ display: 'flex', gap: '6px' }}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PageNumberButton
                                key={page}
                                page={page}
                                isActive={page === currentPage}
                                onClick={() => setCurrentPage(page)}
                            />
                        ))}
                    </div>

                    <PaginationButton
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Berikutnya →
                    </PaginationButton>
                </div>
            )}
        </div>
    );
}

function TableRow({ log, columns, gridTemplateColumns }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: 'grid',
                gridTemplateColumns: gridTemplateColumns,
                gap: '20px',
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                alignItems: 'center',
                backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                borderLeft: isHovered ? '3px solid #10b981' : '3px solid transparent',
                paddingLeft: isHovered ? '20px' : '23px',
                transition: 'all 0.2s ease',
            }}
        >
            {columns.map((col) => (
                <div
                    key={col.key}
                    style={{
                        color: isHovered ? '#ffffff' : '#cbd5e1',
                        fontSize: '13px',
                        transition: 'color 0.2s ease',
                    }}
                >
                    {col.render(log[col.key], log)}
                </div>
            ))}
        </div>
    );
}

function PaginationButton({ onClick, disabled, children }) {
    const [hover, setHover] = useState(false);
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: disabled
                    ? 'rgba(255, 255, 255, 0.02)'
                    : hover
                        ? 'rgba(255, 255, 255, 0.08)'
                        : '#1e293b',
                color: disabled ? '#475569' : '#cbd5e1',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
            }}
        >
            {children}
        </button>
    );
}

function PageNumberButton({ page, isActive, onClick }) {
    const [hover, setHover] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: isActive ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: isActive
                    ? 'rgba(16, 185, 129, 0.15)'
                    : hover
                        ? 'rgba(255, 255, 255, 0.08)'
                        : '#1e293b',
                color: isActive ? '#10b981' : '#cbd5e1',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '700',
                transition: 'all 0.2s ease',
            }}
        >
            {page}
        </button>
    );
}

export default HistoryPage;

