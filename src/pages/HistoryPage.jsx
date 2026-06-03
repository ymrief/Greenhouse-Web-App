import { useState } from 'react';

function HistoryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Sample data - ganti dengan API call nanti
    const allLogs = [
        {
            id: 1,
            timestamp: '2024-05-29 14:30:15',
            action: 'Valve 1 Opened',
            device: 'Solenoid Valve',
            status: 'Success',
        },
        {
            id: 2,
            timestamp: '2024-05-29 14:25:10',
            action: 'Pump Started',
            device: 'Water Pump',
            status: 'Success',
        },
        {
            id: 3,
            timestamp: '2024-05-29 14:20:45',
            action: 'Slider Moved to Position 5',
            device: 'Slider',
            status: 'Success',
        },
        {
            id: 4,
            timestamp: '2024-05-29 14:15:30',
            action: 'Light Turned On',
            device: 'Light Control',
            status: 'Success',
        },
        {
            id: 5,
            timestamp: '2024-05-29 14:10:00',
            action: 'Fuzzy Automation Enabled',
            device: 'System',
            status: 'Success',
        },
        {
            id: 6,
            timestamp: '2024-05-29 14:05:20',
            action: 'Valve 3 Closed',
            device: 'Solenoid Valve',
            status: 'Success',
        },
        {
            id: 7,
            timestamp: '2024-05-29 14:00:15',
            action: 'System Started',
            device: 'System',
            status: 'Success',
        },
        {
            id: 8,
            timestamp: '2024-05-29 13:55:00',
            action: 'Temperature Read: 28.5°C',
            device: 'Sensor',
            status: 'Success',
        },
        {
            id: 9,
            timestamp: '2024-05-29 13:50:45',
            action: 'Humidity Read: 65%',
            device: 'Sensor',
            status: 'Success',
        },
        {
            id: 10,
            timestamp: '2024-05-29 13:45:30',
            action: 'Soil Moisture Read: 75%',
            device: 'Sensor',
            status: 'Success',
        },
    ];

    // Filter logs based on search query
    const filteredLogs = allLogs.filter(
        (log) =>
            log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.timestamp.includes(searchQuery),
    );

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
                        placeholder="Search logs..."
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
                {/* Table Header */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '150px 200px 150px 1fr',
                        gap: '20px',
                        padding: '20px',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <div
                        style={{
                            color: '#94a3b8',
                            fontWeight: '600',
                            fontSize: '14px',
                        }}
                    >
                        Time
                    </div>
                    <div
                        style={{
                            color: '#94a3b8',
                            fontWeight: '600',
                            fontSize: '14px',
                        }}
                    >
                        Device
                    </div>
                    <div
                        style={{
                            color: '#94a3b8',
                            fontWeight: '600',
                            fontSize: '14px',
                        }}
                    >
                        Status
                    </div>
                    <div
                        style={{
                            color: '#94a3b8',
                            fontWeight: '600',
                            fontSize: '14px',
                        }}
                    >
                        Action
                    </div>
                </div>

                {/* Table Body */}
                {displayedLogs.length > 0 ? (
                    displayedLogs.map((log) => (
                        <div
                            key={log.id}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '150px 200px 150px 1fr',
                                gap: '20px',
                                padding: '20px',
                                borderBottom:
                                    '1px solid rgba(255, 255, 255, 0.05)',
                                alignItems: 'center',
                            }}
                        >
                            <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                                {log.timestamp}
                            </div>
                            <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                                {log.device}
                            </div>
                            <div
                                style={{
                                    fontSize: '13px',
                                    color:
                                        log.status === 'Success'
                                            ? '#10b981'
                                            : '#ef4444',
                                    fontWeight: '600',
                                }}
                            >
                                {log.status}
                            </div>
                            <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                                {log.action}
                            </div>
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
                        No logs found matching your search.
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
                        onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor:
                                currentPage === 1
                                    ? 'rgba(255, 255, 255, 0.05)'
                                    : '#1e293b',
                            color: currentPage === 1 ? '#64748b' : '#cbd5e1',
                            cursor:
                                currentPage === 1 ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                        }}
                    >
                        ← Previous
                    </button>

                    {/* Page Numbers */}
                    <div style={{ display: 'flex', gap: '5px' }}>
                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                        ).map((page) => (
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
                                    color:
                                        page === currentPage
                                            ? '#10b981'
                                            : '#cbd5e1',
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
                        onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor:
                                currentPage === totalPages
                                    ? 'rgba(255, 255, 255, 0.05)'
                                    : '#1e293b',
                            color:
                                currentPage === totalPages
                                    ? '#64748b'
                                    : '#cbd5e1',
                            cursor:
                                currentPage === totalPages
                                    ? 'not-allowed'
                                    : 'pointer',
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
