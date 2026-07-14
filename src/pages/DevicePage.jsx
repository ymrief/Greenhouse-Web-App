import { useState, useEffect } from 'react';
import { useDeviceControl } from '../hooks/useDeviceControl';
import apiService from '../services/apiService';

function DevicePage() {
    const {
        togglePompa,
        toggleSolenoid,
        setSlider,
        toggleAutoMode,
        isLoading,
        error,
    } = useDeviceControl();

    const [valves, setValves] = useState({
        valve1: false,
        valve2: false,
        valve3: false,
        valve4: false,
        valve5: false,
        valve6: false,
    });

    // State untuk 4 Checkpoint Position (home, 1, 2, 3)
    const [sliderPos, setSliderPos] = useState('home');
    const checkpointLabels = ['home', '1', '2', '3'];

    // State untuk Kartu Bagian Bawah
    const [isPumpOn, setIsPumpOn] = useState(false);
    const [isMotorOn, setIsMotorOn] = useState(false);
    const [isFuzzyOn, setIsFuzzyOn] = useState(false);

    // State untuk mencatat perangkat yang sedang dalam proses request (pending)
    const [loadingStates, setLoadingStates] = useState({});

    // Gaya animasi transisi untuk tombol/toggle yang sedang memuat
    const getToggleStyle = (devKey) => {
        return loadingStates[devKey]
            ? {
                  opacity: 0.6,
                  pointerEvents: 'none',
                  animation: 'pulse 1.5s infinite ease-in-out',
              }
            : {};
    };

    // Mengambil status kontrol awal dari backend saat komponen dimuat (mount)
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
                    setValves({
                        valve1: data.valves?.['1'] || false,
                        valve2: data.valves?.['2'] || false,
                        valve3: data.valves?.['3'] || false,
                        valve4: data.valves?.['4'] || false,
                        valve5: data.valves?.['5'] || false,
                        valve6: data.valves?.['6'] || false,
                    });
                }
            } catch (err) {
                console.error('[WS] Gagal memuat status kontrol awal:', err);
            }
        };
        fetchInitialState();
        return () => {
            isMounted = false;
        };
    }, []);

    // Menghubungkan WebSocket khusus Kontrol untuk Sinkronisasi Real-Time antar perangkat
    useEffect(() => {
        const ws = new apiService.ControlWebSocketClient();

        ws.connect()
            .then(() => {
                console.log('[WS] DevicePage berhasil berlangganan event kontrol pada /ws/control.');
            })
            .catch((err) => {
                console.error('[WS] Gagal menghubungkan WebSocket Kontrol pada DevicePage', err);
            });

        ws.on('message', (message) => {
            if (!message || !message.type) return;

            const { type, device, target, action } = message;

            if (type === 'control_pending') {
                // Aktifkan mode loading untuk tombol bersangkutan di semua client
                setLoadingStates((prev) => {
                    const next = { ...prev };
                    if (device === 'pompa') next.pompa = true;
                    else if (device === 'solenoid') next[`solenoid_${target}`] = true;
                    else if (device === 'slider') next.slider = true;
                    else if (device === 'auto_mode') next.auto_mode = true;
                    return next;
                });
            } else if (type === 'control_success') {
                // Matikan mode loading dan perbarui status visual di semua client
                setLoadingStates((prev) => {
                    const next = { ...prev };
                    if (device === 'pompa') delete next.pompa;
                    else if (device === 'solenoid') delete next[`solenoid_${target}`];
                    else if (device === 'slider') delete next.slider;
                    else if (device === 'auto_mode') delete next.auto_mode;
                    return next;
                });

                if (device === 'pompa') {
                    setIsPumpOn(action === 'on');
                    if (action === 'on') {
                        setIsMotorOn(false); // Interlock pompa nyala -> motor berhenti
                    }
                } else if (device === 'solenoid') {
                    setValves((prev) => ({
                        ...prev,
                        [`valve${target}`]: action === 'on',
                    }));
                } else if (device === 'slider') {
                    setSliderPos(target);
                } else if (device === 'auto_mode') {
                    setIsFuzzyOn(action === 'on');
                }
            } else if (type === 'control_failure') {
                // Hentikan mode loading jika proses di microcontroller gagal
                setLoadingStates((prev) => {
                    const next = { ...prev };
                    if (device === 'pompa') delete next.pompa;
                    else if (device === 'solenoid') delete next[`solenoid_${target}`];
                    else if (device === 'slider') delete next.slider;
                    else if (device === 'auto_mode') delete next.auto_mode;
                    return next;
                });
                console.error(`Gagal mengontrol ${device}:`, message.error);
            }
        });

        return () => {
            ws.disconnect();
        };
    }, []);

    // --- FUNGSI KONTROL (Mengandalkan WS untuk update state demi sinkronisasi mutlak) ---
    const handleValveToggle = async (valveKey) => {
        const solenoidNumber = valveKey.replace('valve', '');
        const currentStatus = valves[valveKey];
        const actionToSend = !currentStatus ? 'on' : 'off';

        try {
            if (solenoidNumber !== '1' && solenoidNumber !== '2') {
                alert(`Solenoid ${solenoidNumber} tidak didukung. Hanya 1 dan 2 yang aktif.`);
                return;
            }
            await toggleSolenoid(solenoidNumber, actionToSend);
        } catch (err) {
            alert(`Gagal mengirim perintah ke solenoid ${solenoidNumber}`);
        }
    };

    const handleSliderChange = async (position) => {
        try {
            await setSlider(position);
        } catch (err) {
            alert('Gagal mengubah posisi slider');
        }
    };

    const handlePumpToggle = async () => {
        const nextPumpState = !isPumpOn;
        try {
            await togglePompa(nextPumpState ? 'on' : 'off');
        } catch (err) {
            alert('Gagal mengontrol pompa');
        }
    };

    const handleMotorToggle = async () => {
        const nextMotorState = !isMotorOn;
        setIsMotorOn(nextMotorState);

        // Logika Interlock Mutlak: Motor menyala -> Pompa berhenti
        if (nextMotorState === true) {
            setIsPumpOn(false);
            try {
                await togglePompa('off');
            } catch (err) {
                alert('Motor menyala, tetapi gagal mematikan pompa secara fisik!');
            }
        }
    };

    const handleFuzzyToggle = async () => {
        const nextFuzzyState = !isFuzzyOn;
        try {
            await toggleAutoMode(nextFuzzyState);
        } catch (err) {
            alert('Gagal mengubah status automatisasi Fuzzy');
        }
    };

    // --- RENDER TAMPILAN (UI) ---
    return (
        <div className="space-y-6 md:space-y-8">
            {/* Gaya Transisi Pulse Loader */}
            <style>{`
                @keyframes pulse {
                    0% { opacity: 0.4; }
                    50% { opacity: 0.8; }
                    100% { opacity: 0.4; }
                }
            `}</style>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                Device Control
            </h1>

            {error && (
                <div className="text-red-400 p-4 bg-red-500/10 border border-red-500/25 rounded-lg text-sm font-medium">
                    ⚠️ {error}
                </div>
            )}

            {/* Solenoid Valve Control */}
            <div className="p-6 md:p-8 rounded-xl bg-slate-800 border border-slate-700/50 shadow-lg">
                <h3 className="mt-0 mb-6 text-slate-300 text-sm md:text-base font-semibold">
                    Kontrol Solenoid Valve
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
                    {Object.entries(valves).map(([valve, isOn], idx) => {
                        const isDisabled = idx > 1; // Hanya valve 1 dan 2 yang aktif
                        const devKey = `solenoid_${idx + 1}`;
                        const isPending = loadingStates[devKey];

                        return (
                            <div
                                key={valve}
                                className="flex flex-col items-center"
                                style={{
                                    opacity: (isDisabled || isFuzzyOn) ? 0.4 : 1,
                                    pointerEvents: (isDisabled || isFuzzyOn) ? 'none' : 'auto',
                                }}
                            >
                                <label 
                                    className="toggle-switch cursor-pointer" 
                                    style={getToggleStyle(devKey)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isOn}
                                        onChange={() => handleValveToggle(valve)}
                                        disabled={isLoading || isDisabled || isPending || isFuzzyOn}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                                <div className="mt-3 text-slate-300 text-xs sm:text-sm font-semibold select-none">
                                    Valve {idx + 1}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Slider Position Control */}
            <div className="p-6 md:p-8 rounded-xl bg-slate-800 border border-slate-700/50 shadow-lg">
                <h3 className="mt-0 mb-6 text-slate-300 text-sm md:text-base font-semibold">
                    Kontrol Posisi Slider
                </h3>

                <div className="overflow-x-auto pb-4 pt-2 -mx-2 px-2 scrollbar-thin select-none">
                    <div className="flex justify-between items-center relative z-10 min-w-[640px] px-2">
                        {/* Home button */}
                        <button
                            onClick={() => handleSliderChange('home')}
                            disabled={isLoading || loadingStates.slider || isFuzzyOn}
                            className={`w-10 h-10 rounded-full border-2 border-slate-600 font-bold text-xs flex items-center justify-center transition-all duration-300 cursor-pointer ${
                                sliderPos === 'home'
                                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30'
                                    : 'bg-slate-700/40 text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`}
                            style={{
                                opacity: (isLoading || loadingStates.slider || isFuzzyOn) ? 0.4 : 1,
                                cursor: (isLoading || loadingStates.slider || isFuzzyOn) ? 'not-allowed' : 'pointer',
                                ...(loadingStates.slider ? { animation: 'pulse 1.5s infinite ease-in-out' } : {}),
                            }}
                        >
                            H
                        </button>

                        {/* Positions 1-12 */}
                        {Array.from({ length: 12 }, (_, i) => {
                            const position = i + 1;
                            const positionStr = String(position);
                            const isDisabled = position > 3; // Hanya 1, 2, 3 yang diaktifkan
                            const isActive = sliderPos === positionStr;

                            return (
                                <button
                                    key={position}
                                    onClick={() => handleSliderChange(positionStr)}
                                    disabled={isLoading || isDisabled || loadingStates.slider || isFuzzyOn}
                                    className={`w-8 h-8 rounded-full border-2 font-bold text-xs flex items-center justify-center transition-all duration-300 ${
                                        isActive
                                            ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30'
                                            : isDisabled
                                              ? 'bg-slate-800/20 text-slate-600 border-slate-800/40 cursor-not-allowed'
                                              : 'bg-slate-700/40 text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white cursor-pointer'
                                    }`}
                                    style={{
                                        opacity: isDisabled
                                            ? 0.3
                                            : (isLoading || loadingStates.slider || isFuzzyOn)
                                              ? 0.4
                                              : 1,
                                        ...(loadingStates.slider && !isDisabled ? { animation: 'pulse 1.5s infinite ease-in-out' } : {}),
                                    }}
                                >
                                    {position}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Control Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Pump Control */}
                <div
                    className="p-6 md:p-8 rounded-xl bg-slate-800 border border-slate-700/50 shadow-lg text-center hover:border-slate-600 transition-colors duration-200"
                    style={{
                        opacity: isFuzzyOn ? 0.4 : 1,
                        pointerEvents: isFuzzyOn ? 'none' : 'auto',
                    }}
                >
                    <h4 className="mt-0 mb-6 text-slate-300 text-sm md:text-base font-semibold">
                        Kontrol Pompa
                    </h4>
                    <div className="flex justify-center">
                        <label
                            className="toggle-switch cursor-pointer"
                            style={getToggleStyle('pompa')}
                        >
                            <input
                                type="checkbox"
                                checked={isPumpOn}
                                onChange={handlePumpToggle}
                                disabled={isLoading || loadingStates.pompa || isFuzzyOn}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                {/* Fuzzy Automation */}
                <div className="p-6 md:p-8 rounded-xl bg-slate-800 border border-slate-700/50 shadow-lg text-center hover:border-slate-600 transition-colors duration-200">
                    <h4 className="mt-0 mb-6 text-slate-300 text-sm md:text-base font-semibold">
                        Automatisasi Fuzzy
                    </h4>
                    <div className="flex justify-center">
                        <label
                            className="toggle-switch cursor-pointer"
                            style={getToggleStyle('auto_mode')}
                        >
                            <input
                                type="checkbox"
                                checked={isFuzzyOn}
                                onChange={handleFuzzyToggle}
                                disabled={isLoading || loadingStates.auto_mode}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DevicePage;
