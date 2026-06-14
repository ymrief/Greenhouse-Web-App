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

    // Filter logs berdasarkan input pencarian
    const filteredLogs = logs.filter(
        (log) =>
            (log.action && log.action.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (log.device_target && log.device_target.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (log.status && log.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (log.created_at && log.created_at.includes(searchQuery)),
    );

    // Definisi Kolom Dinamis (Dynamic Columns)
    const columns = [
        {
            key: 'created_at',
            label: 'Waktu',
            width: '180px',
            render: (val) => (val ? new Date(val).toLocaleString('id-ID') : '--'),
        },
        {
            key: 'device_target',
            label: 'Perangkat',
            width: '140px',
            render: (val) => val || 'Sistem',
        },
        {
            key: 'status',
            label: 'Status',
            width: '110px',
            render: (val) => {
                const color =
                    val === 'success' || val === 'Success' || val === 'sent'
                        ? '#10b981'
                        : '#ef4444';
                return (
                    <span style={{ color, fontWeight: '600' }}>
                        {val ? val.toUpperCase() : 'SENT'}
                    </span>
                );
            },
        },
        {
            key: 'is_automated',
            label: 'Mode',
            width: '120px',
            render: (val) => (val ? '🤖 Otomatis' : '👤 Manual'),
        },
        {
            key: 'action',
            label: 'Aksi',
            width: '1fr',
            render: (val) => val,
        },
        {
            key: 'retry_count',
            label: 'Retry',
            width: '70px',
            render: (val) => val,
        },
    ];

    // Menggabungkan konfigurasi lebar kolom untuk gridTemplateColumns CSS
    const gridTemplateColumns = columns.map((col) => col.width).join(' ');

    // Pagination
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedLogs = filteredLogs.slice(startIndex, endIndex);

    return (
        <div>
            {/* Title */}
            <h1
                style={{
                    fontSize: '48px',
                    fontWeight: '700',
                    marginBottom: '40px',
                    color: '#ffffff',
                }}
            >
                Log Activities
            </h1>

            {/* Search Box */}
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

            {/* Table Container */}
            <div
                style={{
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: '#1e293b',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
            >
                {/* Table Header secara dinamis */}
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
                    {columns.map((col) => (
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

                {/* Table Body */}
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
                            {columns.map((col) => (
                                <div key={col.key} style={{ color: '#cbd5e1', fontSize: '13px' }}>
                                    {col.render(log[col.key])}
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

            {/* Pagination */}
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
                    {/* Previous Button */}
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
                        ← Previous
                    </button>

                    {/* Page Numbers */}
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

                    {/* Next Button */}
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
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}

export default HistoryPage;

