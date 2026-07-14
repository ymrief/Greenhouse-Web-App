import { useState, useEffect, useContext } from 'react';
import MonitoringCard from '../components/MonitoringCard';
import { useSensorHistory } from '../hooks/useSensorHistory';
import apiService from '../services/apiService';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {
    const { isAdmin, adminUser } = useContext(AuthContext);

    // Memanggil hook (jika backend mati, error akan terisi)
    const { historyData } = useSensorHistory(1);

    // Status aktuator yang disinkronkan dengan Kontrol Perangkat
    const [isPumpOn, setIsPumpOn] = useState(false);
    const [isFuzzyOn, setIsFuzzyOn] = useState(false);
    const [sliderPos, setSliderPos] = useState('home');
    const [_isMotorMoving, setIsMotorMoving] = useState(false);

    // Memuat status kontrol awal saat komponen dipasang (mount)
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
                console.error(
                    '[Dashboard] Gagal memuat status kontrol awal:',
                    err,
                );
            }
        };
        fetchInitialState();
        return () => {
            isMounted = false;
        };
    }, []);

    // Hubungkan ke WebSocket Kontrol untuk pembaruan aktuator secara real-time
    useEffect(() => {
        const ws = new apiService.ControlWebSocketClient();

        ws.connect()
            .then(() => {
                console.log(
                    '[WS] Dashboard berhasil berlangganan event kontrol pada /ws/control.',
                );
            })
            .catch((err) => {
                console.error(
                    '[WS] Gagal menghubungkan WebSocket Kontrol pada Dashboard',
                    err,
                );
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

    // Mendapatkan teks tampilan untuk posisi slider
    const getSliderPositionDisplay = () => {
        if (sliderPos === 'home') return 'Home';
        if (['1', '2', '3'].includes(sliderPos)) return `Posisi ${sliderPos}`;
        return typeof sliderPos === 'string'
            ? sliderPos.toUpperCase()
            : sliderPos;
    };

    // Mendapatkan teks tampilan untuk status pompa air
    const getPumpStatusDisplay = () => {
        return isPumpOn ? (isFuzzyOn ? 'Otomatis' : 'ON') : 'OFF';
    };

    // 1. EKSTRAKSI AMAN (Menggunakan Optional Chaining ?. agar tidak crash jika array kosong)
    const latestRecord = historyData?.[0];
    const latestData = latestRecord?.data; // Mengambil objek 'data' jika record ada
    const _latestTime = latestRecord?.timestamp
        ? new Date(latestRecord.timestamp).toLocaleString('id-ID')
        : '--';

    // 2. FORMALISASI FORMAT TEKS (Gunakan '--' jika data tidak tersedia)
    const displayAirTemperature =
        latestData?.temp_1 !== undefined ? `${latestData.temp_1}°C` : '--';
    const displayAirHumidity =
        latestData?.humidity_1 !== undefined
            ? `RH ${latestData.humidity_1}%`
            : '--';
    const displayLightIntensity =
        latestData?.light_1 !== undefined ? `${latestData.light_1} Lux` : '--';

    // Mengambil data penggunaan air dari database backend (kolom daily_water_usage atau water_usage)
    const displayWaterUsage =
        latestData?.daily_water_usage !== undefined
            ? `${latestData.daily_water_usage} L`
            : latestData?.water_usage !== undefined
              ? `${latestData.water_usage} L`
              : '--';

    // 3. LOGIKA VISUAL PROGRESS (Wajib angka 0-100 agar komponen SVG tidak rusak)
    const soilMoisture1 = latestData?.soil_1 ?? 0;
    const soilMoisture2 = latestData?.soil_2 ?? 0;
    const soilMoisture3 = latestData?.soil_3 ?? 0;
    const soilMoisture4 = latestData?.soil_4 ?? 0;
    const soilMoisture5 = latestData?.soil_5 ?? 0;
    const soilMoisture6 = latestData?.soil_6 ?? 0;
    const averageSoilMoisture = latestRecord
        ? Math.round((soilMoisture1 + soilMoisture2 + soilMoisture3 + soilMoisture4 + soilMoisture5 + soilMoisture6) / 6)
        : 0;
    const averageColor = getMoistureColor(averageSoilMoisture);

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Salam Pembuka */}
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                {isAdmin && adminUser ? `Selamat Datang, ${adminUser}!` : 'Selamat Datang!'}
            </h1>

            {/* Tata Letak Grid Utama */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Sisi Kiri - Rerata dan Detil Kelembapan Tanah */}
                <div className="flex flex-col gap-5">
                    {/* Kartu Kelembapan Tanah Besar */}
                    <div
                        className="p-6 md:p-8 rounded-xl bg-slate-800 border border-slate-700/50 shadow-lg transition-all duration-300"
                        style={{ borderLeft: `4px solid ${averageColor}` }}
                    >
                        <h3 className="text-slate-300 text-sm md:text-base font-semibold mb-6">
                            Rerata Kelembapan Tanah
                        </h3>
                        <div className="flex justify-center items-center mb-6">
                            <CircularProgress value={averageSoilMoisture} color={averageColor} />
                        </div>
                        <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                            <div
                                className="h-full transition-all duration-500"
                                style={{
                                    width: `${averageSoilMoisture}%`,
                                    backgroundColor: averageColor,
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Grid 6 Kartu Kelembapan Polybag */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                        <PolybagCard num={1} value={soilMoisture1} />
                        <PolybagCard num={2} value={soilMoisture2} />
                        <PolybagCard num={3} value={soilMoisture3} />
                        <PolybagCard num={4} value={soilMoisture4} />
                        <PolybagCard num={5} value={soilMoisture5} />
                        <PolybagCard num={6} value={soilMoisture6} />
                    </div>
                </div>

                {/* Sisi Kanan - Tiga Kartu Pemantauan */}
                <div className="flex flex-col gap-4">
                    <div className="p-5 rounded-xl bg-slate-800 border border-slate-700/50 shadow-lg flex justify-between items-center hover:border-slate-600 transition-colors duration-200">
                        <div>
                            <div className="text-slate-300 text-xs sm:text-sm font-medium mb-1">
                                Suhu Udara
                            </div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                                {displayAirTemperature}
                            </div>
                        </div>
                        <span className="text-3xl sm:text-4xl select-none">🌡️</span>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-800 border border-slate-700/50 shadow-lg flex justify-between items-center hover:border-slate-600 transition-colors duration-200">
                        <div>
                            <div className="text-slate-300 text-xs sm:text-sm font-medium mb-1">
                                Kelembapan Udara
                            </div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                                {displayAirHumidity}
                            </div>
                        </div>
                        <span className="text-3xl sm:text-4xl select-none">💧</span>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-800 border border-slate-700/50 shadow-lg flex justify-between items-center hover:border-slate-600 transition-colors duration-200">
                        <div>
                            <div className="text-slate-300 text-xs sm:text-sm font-medium mb-1">
                                Intensitas Cahaya
                            </div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                                {displayLightIntensity}
                            </div>
                        </div>
                        <span className="text-3xl sm:text-4xl select-none">☀️</span>
                    </div>
                </div>
            </div>

            {/* Kartu Status Bagian Bawah */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
                <StatusCard
                    title="Posisi Slider"
                    value={getSliderPositionDisplay()}
                />
                <StatusCard title="Status Pompa Air" value={getPumpStatusDisplay()} />
                <StatusCard title="Penggunaan Air Hari Ini" value={displayWaterUsage} />
            </div>
        </div>
    );
}

const getMoistureColor = (value) => {
    const val = Math.min(Math.max(value, 0), 100);
    const hue = (val / 100) * 120;
    return `hsl(${hue}, 80%, 45%)`;
};

function PolybagCard({ num, value }) {
    const color = getMoistureColor(value);
    return (
        <div
            className="p-4 rounded-xl bg-slate-800 border border-slate-700/50 shadow-md flex flex-col justify-between hover:border-slate-600 transition-all duration-300"
            style={{ borderLeft: `4px solid ${color}` }}
        >
            <div className="flex justify-between items-center mb-3">
                <span className="text-slate-300 text-xs sm:text-sm font-semibold">
                    Polybag {num}
                </span>
                <span className="text-sm select-none">🌱</span>
            </div>
            <div className="flex items-baseline gap-0.5">
                <span
                    className="text-xl sm:text-2xl font-bold transition-colors duration-300"
                    style={{ color: color }}
                >
                    {value}
                </span>
                <span className="text-xs text-slate-400 font-medium">%</span>
            </div>
            <div className="w-full h-1 bg-slate-700/50 rounded-full mt-3.5 overflow-hidden">
                <div
                    className="h-full transition-all duration-500"
                    style={{
                        width: `${Math.min(Math.max(value, 0), 100)}%`,
                        backgroundColor: color,
                    }}
                />
            </div>
        </div>
    );
}

function CircularProgress({ value, color }) {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (value / 100) * circumference;

    return (
        <svg width="120" height="120" className="select-none">
            {/* Lingkaran Latar Belakang */}
            <circle
                cx="60"
                cy="60"
                r="45"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="8"
                fill="none"
            />
            {/* Lingkaran Kemajuan */}
            <circle
                cx="60"
                cy="60"
                r="45"
                stroke={color || '#10b981'}
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease' }}
            />
            {/* Teks Angka */}
            <text
                x="60"
                y="70"
                textAnchor="middle"
                style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    fill: color || '#10b981',
                    transition: 'fill 0.5s ease',
                }}
            >
                {value}%
            </text>
        </svg>
    );
}

function StatusCard({ title, value }) {
    return (
        <div className="p-5 rounded-xl bg-slate-800 border border-slate-700/50 shadow-md text-center hover:border-slate-600 transition-colors duration-200">
            <div className="text-slate-400 text-xs sm:text-sm font-medium mb-2">
                {title}
            </div>
            <div className="text-lg sm:text-2xl font-bold text-white">
                {value}
            </div>
        </div>
    );
}

export default Dashboard;
