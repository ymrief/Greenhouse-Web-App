import { useState, useEffect } from 'react';
import MonitoringCard from '../components/MonitoringCard';
import { useSensorHistory } from '../hooks/useSensorHistory';
import apiService from '../services/apiService';

function Dashboard() {
    // Memanggil hook (jika backend mati, error akan terisi)
    const { historyData, isLoading, error } = useSensorHistory(1);

    // Actuator states synchronized with Device Control
    const [isPumpOn, setIsPumpOn] = useState(false);
    const [isFuzzyOn, setIsFuzzyOn] = useState(false);
    const [sliderPos, setSliderPos] = useState('home');
    const [isMotorMoving, setIsMotorMoving] = useState(false);

    // Load initial control state on mount
    useEffect(() => {
        let isMounted = true;
        const fetchInitialState = async () => {
            try {
                const response = await apiService.deviceAPI.getControlState();
                if (isMounted && response?.data) {
                    const data = response.data;
                    setIsPumpOn(data.is_pump_on || false);
                    setIsFuzzyOn(data.is_auto_mode || false);
                    setSliderPos(data.slider_pos || 'home');
                }
            } catch (err) {
                console.error('[Dashboard] Gagal memuat status kontrol awal:', err);
            }
        };
        fetchInitialState();
        return () => {
            isMounted = false;
        };
    }, []);

    // Connect to Control WebSocket for real-time actuator updates
    useEffect(() => {
        const ws = new apiService.ControlWebSocketClient();

        ws.connect()
            .then(() => {
                console.log('[WS] Dashboard berhasil berlangganan event kontrol pada /ws/control.');
            })
            .catch((err) => {
                console.error('[WS] Gagal menghubungkan WebSocket Kontrol pada Dashboard', err);
            });

        ws.on('message', (message) => {
            if (!message || !message.type) return;

            const { type, device, target, action } = message;

            if (type === 'control_pending') {
                if (device === 'slider') {
                    setIsMotorMoving(true);
                }
            } else if (type === 'control_success') {
                if (device === 'pompa') {
                    setIsPumpOn(action === 'on');
                } else if (device === 'slider') {
                    setSliderPos(target);
                    setIsMotorMoving(false);
                } else if (device === 'auto_mode') {
                    setIsFuzzyOn(action === 'on');
                }
            } else if (type === 'control_failure') {
                if (device === 'slider') {
                    setIsMotorMoving(false);
                }
            }
        });

        return () => {
            ws.disconnect();
        };
    }, []);

    const getSliderPosDisplay = () => {
        if (sliderPos === 'home') return 'Home';
        if (['1', '2', '3'].includes(sliderPos)) return `Posisi ${sliderPos}`;
        return typeof sliderPos === 'string' ? sliderPos.toUpperCase() : sliderPos;
    };

    const getPumpDisplay = () => {
        const status = isPumpOn ? 'Nyala' : 'Mati';
        const mode = isFuzzyOn ? 'Otomatis' : 'Manual';
        return `${status} (${mode})`;
    };

    // 1. SAFE EXTRACTION (Menggunakan Optional Chaining ?. agar tidak crash jika array kosong)
    const latestRecord = historyData?.[0];
    const latestData = latestRecord?.data; // Mengambil objek 'data' jika record ada
    const latestTime = latestRecord?.timestamp
        ? new Date(latestRecord.timestamp).toLocaleString('id-ID')
        : '--';

    // 2. FORMALISASI FORMAT TEKS (Gunakan '--' jika data tidak tersedia)
    const displaySuhu =
        latestData?.temp_1 !== undefined ? `${latestData.temp_1}°C` : '--';
    const displayKelembapanUdara =
        latestData?.humidity_1 !== undefined
            ? `RH ${latestData.humidity_1}%`
            : '--';
    const displayCahaya =
        latestData?.light_1 !== undefined ? `${latestData.light_1} Lux` : '--';

    // 3. LOGIKA VISUAL PROGRESS (Wajib angka 0-100 agar komponen SVG tidak rusak)
    const soil1 = latestData?.soil_1 ?? 0;
    const soil2 = latestData?.soil_2 ?? 0;
    const soil3 = latestData?.soil_3 ?? 0;
    const soil4 = latestData?.soil_4 ?? 0;
    const soil5 = latestData?.soil_5 ?? 0;
    const soil6 = latestData?.soil_6 ?? 0;
    const rerataTanah = latestRecord
        ? Math.round((soil1 + soil2 + soil3 + soil4 + soil5 + soil6) / 6)
        : 0;

    return (
        <div>
            {/* Greeting */}
            <h1
                style={{
                    fontSize: '48px',
                    fontWeight: '700',
                    marginBottom: '40px',
                    color: '#ffffff',
                }}
            >
                Selamat Datang, Operator!
            </h1>

            {/* Main Grid Layout */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '30px',
                    marginBottom: '40px',
                }}
            >
                {/* Left Side - Large Soil Moisture Card */}
                <div
                    style={{
                        padding: '30px',
                        borderRadius: '12px',
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <h3
                        style={{
                            color: '#cbd5e1',
                            fontSize: '16px',
                            fontWeight: '500',
                            marginTop: 0,
                            marginBottom: '25px',
                        }}
                    >
                        Rerata Kelembapan Tanah
                    </h3>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '20px',
                        }}
                    >
                        <CircularProgress value={rerataTanah} />
                    </div>
                    <div
                        style={{
                            width: '100%',
                            height: '6px',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '3px',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                width: '75%',
                                height: '100%',
                                background:
                                    'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                            }}
                        ></div>
                    </div>
                </div>

                {/* Right Side - Three Monitoring Cards */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                    }}
                >
                    <div
                        style={{
                            padding: '20px',
                            borderRadius: '12px',
                            backgroundColor: '#1e293b',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                                Suhu Udara
                            </div>
                            <div
                                style={{
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    color: '#10b981',
                                }}
                            >
                                {displaySuhu}
                            </div>
                        </div>
                        <span style={{ fontSize: '40px' }}>🌡️</span>
                    </div>

                    <div
                        style={{
                            padding: '20px',
                            borderRadius: '12px',
                            backgroundColor: '#1e293b',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                                Kelembapan Udara
                            </div>
                            <div
                                style={{
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    color: '#10b981',
                                }}
                            >
                                {displayKelembapanUdara}
                            </div>
                        </div>
                        <span style={{ fontSize: '40px' }}>💧</span>
                    </div>

                    <div
                        style={{
                            padding: '20px',
                            borderRadius: '12px',
                            backgroundColor: '#1e293b',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                                Intensitas Cahaya
                            </div>
                            <div
                                style={{
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    color: '#10b981',
                                }}
                            >
                                {displayCahaya}
                            </div>
                        </div>
                        <span style={{ fontSize: '40px' }}>☀️</span>
                    </div>
                </div>
            </div>

            {/* Bottom Status Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px',
                }}
            >
                <StatusCard title="Posisi Slider" value={getSliderPosDisplay()} />
                <StatusCard title="Status Pompa Air" value={getPumpDisplay()} />
                <StatusCard title="Status Slider" value={isMotorMoving ? 'Bergerak' : 'Steady'} />
            </div>
        </div>
    );
}

function CircularProgress({ value }) {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (value / 100) * circumference;

    return (
        <svg width="120" height="120">
            {/* Background Circle */}
            <circle
                cx="60"
                cy="60"
                r="45"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="8"
                fill="none"
            />
            {/* Progress Circle */}
            <circle
                cx="60"
                cy="60"
                r="45"
                stroke="#10b981"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
            {/* Text */}
            <text
                x="60"
                y="70"
                textAnchor="middle"
                style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    fill: '#10b981',
                }}
            >
                {value}%
            </text>
        </svg>
    );
}

function StatusCard({ title, value }) {
    return (
        <div
            style={{
                padding: '20px',
                borderRadius: '12px',
                backgroundColor: '#1e293b',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                textAlign: 'center',
            }}
        >
            <div
                style={{
                    color: '#cbd5e1',
                    fontSize: '14px',
                    marginBottom: '10px',
                }}
            >
                {title}
            </div>
            <div
                style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                }}
            >
                {value}
            </div>
        </div>
    );
}

export default Dashboard;
