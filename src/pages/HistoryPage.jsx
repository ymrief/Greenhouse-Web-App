import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

function HistoryPage() {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMode, setSelectedMode] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
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
                console.error(
                    '[WS] Failed to connect to control logs websocket:',
                    err,
                );
                setError(
                    'Koneksi real-time terputus. Silakan muat ulang halaman.',
                );
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
                        (nl) => !prevLogs.some((pl) => pl.id === nl.id),
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
            setError(
                'Koneksi real-time gagal terhubung kembali setelah beberapa percobaan.',
            );
            setIsLoading(false);
        });

        return () => {
            ws.disconnect();
        };
    }, []);

    // Memfilter log berdasarkan kata kunci pencarian dan filter dropdown
    const filteredLogs = logs.filter((log) => {
        // 1. Filter berdasarkan kata kunci pencarian (Pencarian Teks)
        const query = searchQuery.toLowerCase().trim();
        let matchSearch = true;

        if (query) {
            const timeStr = log.created_at
                ? new Date(log.created_at).toLocaleString('id-ID').toLowerCase()
                : '';
            const modeStr = log.is_automated ? 'otomatis' : 'manual';
            const commandStr = formatCommand(log.action).toLowerCase();
            const targetStr = formatTarget(log).toLowerCase();
            const statusStr = getStatusBadgeConfig(
                log.status,
            ).text.toLowerCase();

            const rawAction = log.action ? log.action.toLowerCase() : '';
            const rawTarget = log.device_target
                ? log.device_target.toLowerCase()
                : '';
            const rawStatus = log.status ? log.status.toLowerCase() : '';

            matchSearch =
                timeStr.includes(query) ||
                modeStr.includes(query) ||
                commandStr.includes(query) ||
                targetStr.includes(query) ||
                statusStr.includes(query) ||
                rawAction.includes(query) ||
                rawTarget.includes(query) ||
                rawStatus.includes(query);
        }

        // 2. Filter berdasarkan Mode (Otomatis/Manual)
        const matchMode =
            selectedMode === 'all' ||
            (selectedMode === 'automated' && log.is_automated) ||
            (selectedMode === 'manual' && !log.is_automated);

        // 3. Filter berdasarkan Status
        const matchStatus =
            selectedStatus === 'all' ||
            (() => {
                const statusLower = log.status ? log.status.toLowerCase() : '';
                const isSuccess =
                    statusLower === 'done' || statusLower === 'success';
                const isPending =
                    statusLower === 'sent' || statusLower === 'pending';

                if (selectedStatus === 'success') return isSuccess;
                if (selectedStatus === 'pending') return isPending;
                if (selectedStatus === 'failed')
                    return !isSuccess && !isPending;
                return true;
            })();

        return matchSearch && matchMode && matchStatus;
    });

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
        if (targetStr === 'SWITCH_HOME' || targetStr === 'HOME')
            return 'Home Position';
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
            return {
                text: 'Selesai',
                color: '#10b981',
                bgColor: 'rgba(16, 185, 129, 0.15)',
            };
        }
        if (statusLower === 'sent' || statusLower === 'pending') {
            return {
                text: 'Proses...',
                color: '#3b82f6',
                bgColor: 'rgba(59, 130, 246, 0.15)',
            };
        }
        return {
            text: 'Gagal',
            color: '#ef4444',
            bgColor: 'rgba(239, 68, 68, 0.15)',
        };
    };

    // Definisi Kolom Tabel Dinamis
    const tableColumns = [
        {
            key: 'created_at',
            label: 'Waktu',
            width: '180px',
            render: (val) =>
                val ? new Date(val).toLocaleString('id-ID') : '--',
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
                const durationText =
                    log.duration_ms !== null && log.duration_ms !== undefined
                        ? `${log.duration_ms} ms`
                        : null;
                const retryText =
                    log.retry_count > 0 ? `Retry: ${log.retry_count}` : null;

                if (durationText && retryText)
                    return `${durationText} (${retryText})`;
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

    const isFiltered =
        searchQuery !== '' ||
        selectedMode !== 'all' ||
        selectedStatus !== 'all';

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Judul Halaman */}
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                Log Aktivitas
            </h1>

            {/* Kotak Pencarian & Filter */}
            <div className="mb-6 flex flex-col md:flex-row flex-wrap gap-3 items-stretch md:items-center">
                {/* Pencarian Kata Kunci */}
                <div className="relative flex-1 min-w-[280px]">
                    <input
                        type="text"
                        placeholder="Cari kata kunci (perintah, tujuan, status, waktu)..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        onFocus={() => setSearchFocus(true)}
                        onBlur={() => setSearchFocus(false)}
                        className={`w-full py-3 pl-10 pr-4 rounded-lg bg-slate-800 text-white text-sm outline-none border transition-all duration-300 ${
                            searchFocus
                                ? 'border-emerald-500 ring-2 ring-emerald-500/15 shadow-md shadow-emerald-500/10'
                                : 'border-slate-700/50 hover:border-slate-600'
                        }`}
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base select-none">
                        🔍
                    </span>
                </div>

                {/* Filter Mode - Belum digunakan
                <div className="relative w-full sm:w-44">
                    <select
                        value={selectedMode}
                        onChange={(e) => {
                            setSelectedMode(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full py-3 px-4 rounded-lg bg-slate-800 text-white text-sm border border-slate-700/50 hover:border-slate-600 outline-none cursor-pointer appearance-none pr-10 transition-all duration-300"
                        style={{
                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 12px center',
                            backgroundSize: '16px',
                        }}
                    >
                        <option value="all">Semua Mode</option>
                        <option value="manual">👤 Manual</option>
                        <option value="automated">🤖 Otomatis</option>
                    </select>
                </div>
                */}

                {/* Filter Status - Belum digunakan
                <div className="relative w-full sm:w-44">
                    <select
                        value={selectedStatus}
                        onChange={(e) => {
                            setSelectedStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full py-3 px-4 rounded-lg bg-slate-800 text-white text-sm border border-slate-700/50 hover:border-slate-600 outline-none cursor-pointer appearance-none pr-10 transition-all duration-300"
                        style={{
                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 12px center',
                            backgroundSize: '16px',
                        }}
                    >
                        <option value="all">Semua Status</option>
                        <option value="success">🟢 Selesai</option>
                        <option value="pending">🔵 Proses...</option>
                        <option value="failed">🔴 Gagal</option>
                    </select>
                </div>
                */}

                {/* Reset Button */}
                {isFiltered && (
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedMode('all');
                            setSelectedStatus('all');
                            setCurrentPage(1);
                        }}
                        className="w-full sm:w-auto py-3 px-5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-sm transition-colors duration-250 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>✕</span> Reset Filter
                    </button>
                )}
            </div>

            {/* Status Record Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div className="text-slate-400 text-sm">
                    Menampilkan{' '}
                    <span className="text-white font-semibold">
                        {filteredLogs.length > 0 ? startIndex + 1 : 0}
                    </span>{' '}
                    -{' '}
                    <span className="text-white font-semibold">
                        {Math.min(endIndex, filteredLogs.length)}
                    </span>{' '}
                    dari{' '}
                    <span className="text-white font-semibold">
                        {filteredLogs.length}
                    </span>{' '}
                    log aktivitas
                </div>
            </div>

            {/* Wadah Tabel Log */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-800 shadow-lg overflow-hidden">
                {/* HAPUS overflow-x-auto dan min-w-[850px] di sini agar layout card mobile berfungsi */}
                <div className="divide-y divide-slate-700/40">
                    {/* Header Tabel - SEMBUNYIKAN DI MOBILE (hidden md:grid) */}
                    <div
                        className="hidden md:grid gap-5 px-5 py-4 bg-slate-900/60"
                        style={{ gridTemplateColumns: gridTemplateColumns }}
                    >
                        {tableColumns.map((col) => (
                            <div
                                key={col.key}
                                className="text-slate-400 font-bold text-xs uppercase tracking-wider"
                            >
                                {col.label}
                            </div>
                        ))}
                    </div>

                    {/* Konten Utama Tabel */}
                    {isLoading ? (
                        <div className="p-10 text-center text-slate-300 font-medium">
                            Memuat log aktivitas...
                        </div>
                    ) : error ? (
                        <div className="p-10 text-center text-red-400 font-medium">
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
                        <div className="p-10 text-center text-slate-500 font-medium">
                            Tidak ada log aktivitas yang ditemukan.
                        </div>
                    )}
                </div>
            </div>

            {/* Navigasi Halaman (Pagination) */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-8">
                    <PaginationButton
                        onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                    >
                        ← Sebelumnya
                    </PaginationButton>

                    <div className="flex gap-1.5">
                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                        ).map((page) => (
                            <PageNumberButton
                                key={page}
                                page={page}
                                isActive={page === currentPage}
                                onClick={() => setCurrentPage(page)}
                            />
                        ))}
                    </div>

                    <PaginationButton
                        onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
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
            // Ubah grid menjadi: flex flex-col (Mobile) dan md:grid (Desktop)
            className={`flex flex-col md:grid gap-2 md:gap-5 px-4 py-4 md:px-5 md:py-4 transition-all duration-200 border-b border-slate-700/40 md:border-none ${
                isHovered
                    ? 'bg-slate-700/20 border-l-4 border-l-emerald-500 md:pl-4'
                    : 'border-l-4 border-l-transparent bg-transparent'
            }`}
            // Style gridTemplateColumns akan diabaikan oleh browser saat display: flex (mobile)
            // dan baru berfungsi saat display: grid (desktop). Ini trik CSS yang sangat bersih!
            style={{ gridTemplateColumns: gridTemplateColumns }}
        >
            {columns.map((col) => (
                <div
                    key={col.key}
                    // Buat flex di mobile agar Label & Value sejajar, dan kembali normal (block) di desktop
                    className={`flex justify-between items-start md:block text-xs sm:text-sm transition-colors duration-200 ${
                        isHovered ? 'text-white font-medium' : 'text-slate-300'
                    }`}
                >
                    {/* Label untuk Mobile - Hanya muncul di HP */}
                    <span className="md:hidden text-slate-400 font-semibold mr-4">
                        {col.label}
                    </span>

                    {/* Nilai Data Log */}
                    <span className="text-right md:text-left flex-1 md:flex-none">
                        {col.render(log[col.key], log)}
                    </span>
                </div>
            ))}
        </div>
    );
}

function PaginationButton({ onClick, disabled, children }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg border font-semibold text-sm transition-all cursor-pointer ${
                disabled
                    ? 'bg-slate-800/40 border-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-800 border-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white hover:-translate-y-0.5'
            }`}
        >
            {children}
        </button>
    );
}

function PageNumberButton({ page, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-9 h-9 rounded-lg border font-bold text-sm transition-all flex items-center justify-center cursor-pointer ${
                isActive
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                    : 'bg-slate-800 border-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
        >
            {page}
        </button>
    );
}

export default HistoryPage;
