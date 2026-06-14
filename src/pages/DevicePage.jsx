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
        <div>
            {/* Gaya Transisi Pulse Loader */}
            <style>{`
                @keyframes pulse {
                    0% { opacity: 0.4; }
                    50% { opacity: 0.8; }
                    100% { opacity: 0.4; }
                }
            `}</style>

            {/* Title */}
            <h1
                style={{
                    fontSize: '48px',
                    fontWeight: '700',
                    marginBottom: '40px',
                    color: '#ffffff',
                }}
            >
                Device Control
            </h1>

            {error && (
                <div
                    style={{
                        color: '#ef4444',
                        marginBottom: '20px',
                        padding: '15px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                    }}
                >
                    {error}
                </div>
            )}

            {/* Solenoid Valve Control */}
            <div
                style={{
                    padding: '30px',
                    borderRadius: '12px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    marginBottom: '30px',
                }}
            >
                <h3
                    style={{
                        marginTop: 0,
                        marginBottom: '25px',
                        color: '#cbd5e1',
                        fontSize: '16px',
                        fontWeight: '600',
                    }}
                >
                    Kontrol Solenoid Valve
                </h3>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(6, 1fr)',
                        gap: '20px',
                    }}
                >
                    {Object.entries(valves).map(([valve, isOn], idx) => {
                        const isDisabled = idx > 1; // Hanya valve 1 dan 2 yang aktif
                        const devKey = `solenoid_${idx + 1}`;
                        const isPending = loadingStates[devKey];

                        return (
                            <div
                                key={valve}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    opacity: isDisabled ? 0.5 : 1,
                                    pointerEvents: isDisabled ? 'none' : 'auto',
                                }}
                            >
                                <label 
                                    className="toggle-switch" 
                                    style={getToggleStyle(devKey)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isOn}
                                        onChange={() => handleValveToggle(valve)}
                                        disabled={isLoading || isDisabled || isPending}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                                <div
                                    style={{
                                        marginTop: '12px',
                                        color: '#cbd5e1',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                    }}
                                >
                                    Valve {idx + 1}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Slider Position Control */}
            <div
                style={{
                    padding: '30px',
                    borderRadius: '12px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    marginBottom: '30px',
                }}
            >
                <h3
                    style={{
                        marginTop: 0,
                        marginBottom: '25px',
                        color: '#cbd5e1',
                        fontSize: '16px',
                        fontWeight: '600',
                    }}
                >
                    Kontrol Posisi Slider
                </h3>

                <div style={{ position: 'relative', padding: '20px 0' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        {/* Home button */}
                        <button
                            onClick={() => handleSliderChange('home')}
                            disabled={isLoading || loadingStates.slider}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '3px solid white',
                                backgroundColor:
                                    sliderPos === 'home'
                                        ? '#10b981'
                                        : 'rgba(100, 116, 139, 0.3)',
                                color: '#ffffff',
                                cursor: (isLoading || loadingStates.slider) ? 'not-allowed' : 'pointer',
                                fontSize: '10px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                boxShadow:
                                    sliderPos === 'home'
                                        ? '0 4px 12px rgba(16, 185, 129, 0.4)'
                                        : 'none',
                                opacity: (isLoading || loadingStates.slider) ? 0.6 : 1,
                                ...(loadingStates.slider ? { animation: 'pulse 1.5s infinite ease-in-out' } : {}),
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading && !loadingStates.slider && sliderPos !== 'home') {
                                    e.target.style.backgroundColor = 'rgba(16, 185, 129, 0.3)';
                                    e.target.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (sliderPos !== 'home') {
                                    e.target.style.backgroundColor = 'rgba(100, 116, 139, 0.3)';
                                    e.target.style.boxShadow = 'none';
                                }
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
                                    disabled={isLoading || isDisabled || loadingStates.slider}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        border: '3px solid white',
                                        backgroundColor: isActive
                                            ? '#10b981'
                                            : isDisabled
                                              ? 'rgba(100, 116, 139, 0.15)'
                                              : 'rgba(100, 116, 139, 0.3)',
                                        color: '#ffffff',
                                        cursor: isDisabled
                                            ? 'not-allowed'
                                            : (isLoading || loadingStates.slider)
                                              ? 'not-allowed'
                                              : 'pointer',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease',
                                        boxShadow: isActive
                                            ? '0 4px 12px rgba(16, 185, 129, 0.4)'
                                            : 'none',
                                        opacity: isDisabled
                                            ? 0.3
                                            : (isLoading || loadingStates.slider)
                                              ? 0.6
                                              : 1,
                                        ...(loadingStates.slider && !isDisabled ? { animation: 'pulse 1.5s infinite ease-in-out' } : {}),
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isLoading && !loadingStates.slider && !isDisabled && !isActive) {
                                            e.target.style.backgroundColor = 'rgba(16, 185, 129, 0.3)';
                                            e.target.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive && !isDisabled) {
                                            e.target.style.backgroundColor = 'rgba(100, 116, 139, 0.3)';
                                            e.target.style.boxShadow = 'none';
                                        }
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
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '20px',
                }}
            >
                {/* Pump Control */}
                <div
                    style={{
                        padding: '30px',
                        borderRadius: '12px',
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        textAlign: 'center',
                    }}
                >
                    <h4
                        style={{
                            marginTop: 0,
                            marginBottom: '20px',
                            color: '#cbd5e1',
                            fontSize: '16px',
                            fontWeight: '600',
                        }}
                    >
                        Kontrol Pompa
                    </h4>
                    <label
                        className="toggle-switch"
                        style={{ justifyContent: 'center', ...getToggleStyle('pompa') }}
                    >
                        <input
                            type="checkbox"
                            checked={isPumpOn}
                            onChange={handlePumpToggle}
                            disabled={isLoading || loadingStates.pompa}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>

                {/* Fuzzy Automation */}
                <div
                    style={{
                        padding: '30px',
                        borderRadius: '12px',
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        textAlign: 'center',
                    }}
                >
                    <h4
                        style={{
                            marginTop: 0,
                            marginBottom: '20px',
                            color: '#cbd5e1',
                            fontSize: '16px',
                            fontWeight: '600',
                        }}
                    >
                        Automatisasi Fuzzy
                    </h4>
                    <label
                        className="toggle-switch"
                        style={{ justifyContent: 'center', ...getToggleStyle('auto_mode') }}
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
    );
}

export default DevicePage;
