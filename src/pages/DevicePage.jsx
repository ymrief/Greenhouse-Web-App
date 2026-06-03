import { useState } from 'react';
import { useDeviceControl } from '../hooks/useDeviceControl';

function DevicePage() {
    const { togglePompa, toggleSolenoid, setSlider, isLoading, error } =
        useDeviceControl();

    const [valves, setValves] = useState({
        valve1: false,
        valve2: false,
        valve3: false,
        valve4: false,
        valve5: false,
        valve6: false,
    });

    // 3. State untuk 4 Checkpoint Position (home, 1, 2, 3)
    const [sliderPos, setSliderPos] = useState('home');
    const checkpointLabels = ['home', '1', '2', '3'];

    // 4. State untuk Kartu Bagian Bawah
    const [isPumpOn, setIsPumpOn] = useState(false);
    const [isMotorOn, setIsMotorOn] = useState(false);
    const [isFuzzyOn, setIsFuzzyOn] = useState(false);

    // --- FUNGSI KONTROL & LOGIKA INTERLOCK ---
    const handleValveToggle = async (valveKey) => {
        // valveKey berupa: 'valve1', 'valve2', 'valve3', 'valve4', 'valve5', 'valve6'
        // Extract hanya angka: '1', '2', '3', '4', '5', '6'
        const solenoidNumber = valveKey.replace('valve', '');

        const currentStatus = valves[valveKey];
        const actionToSend = !currentStatus ? 'on' : 'off';

        try {
            // 1. Kirim perintah ke FastAPI dengan hanya angka solenoid (1, 2)
            // Backend hanya support solenoid 1 dan 2
            if (solenoidNumber !== '1' && solenoidNumber !== '2') {
                alert(
                    `Solenoid ${solenoidNumber} tidak didukung. Hanya 1 dan 2 yang aktif.`,
                );
                return;
            }
            await toggleSolenoid(solenoidNumber, actionToSend);

            // 2. Update UI Valve
            const newValves = { ...valves };
            newValves[valveKey] = !currentStatus;
            setValves(newValves);

            // 3. Logika Otomatis: Jika ada salah satu valve yang menyala, Pompa hidup
            const isAnyValveOpen = Object.values(newValves).some(
                (v) => v === true,
            );
            if (isAnyValveOpen) {
                if (!isPumpOn) {
                    await togglePompa('on');
                    setIsPumpOn(true);
                    setIsMotorOn(false); // Interlock: Pompa nyala -> Motor berhenti
                }
            } else {
                // Jika semua valve tertutup, matikan pompa
                if (isPumpOn) {
                    await togglePompa('off');
                    setIsPumpOn(false);
                }
            }
        } catch (err) {
            alert(`Gagal mengirim perintah ke solenoid ${solenoidNumber}`);
        }
    };

    const handleSliderChange = async (position) => {
        try {
            await setSlider(position);
            setSliderPos(position);
        } catch (err) {
            alert('Gagal mengubah posisi slider');
        }
    };

    const handlePumpToggle = async () => {
        const nextPumpState = !isPumpOn;
        try {
            await togglePompa(nextPumpState ? 'on' : 'off');

            setIsPumpOn(nextPumpState);

            // Logika Interlock Mutlak: Pompa menyala -> Motor berhenti
            if (nextPumpState === true) {
                setIsMotorOn(false);
            }
        } catch (err) {
            alert('Gagal mengontrol pompa');
        }
    };

    // SUDAH DIPERBAIKI: Menambahkan 'async' di sini
    const handleMotorToggle = async () => {
        const nextMotorState = !isMotorOn;
        setIsMotorOn(nextMotorState);

        // Logika Interlock Mutlak: Motor menyala -> Pompa berhenti
        if (nextMotorState === true) {
            setIsPumpOn(false);
            try {
                // Mematikan pompa melalui API agar alat fisiknya benar-benar mati
                await togglePompa('off');
            } catch (err) {
                alert(
                    'Motor menyala, tetapi gagal mematikan pompa secara fisik!',
                );
            }
        }
    };

    // --- RENDER TAMPILAN (UI) ---
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
                        const isDisabled = idx > 1; // Only valve1 and valve2 are enabled (idx 0 and 1)
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
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={isOn}
                                        onChange={() =>
                                            handleValveToggle(valve)
                                        }
                                        disabled={isLoading || isDisabled}
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
                    {/* Position buttons */}
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
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                fontSize: '10px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                boxShadow:
                                    sliderPos === 'home'
                                        ? '0 4px 12px rgba(16, 185, 129, 0.4)'
                                        : 'none',
                                opacity: isLoading ? 0.6 : 1,
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading && sliderPos !== 'home') {
                                    e.target.style.backgroundColor =
                                        'rgba(16, 185, 129, 0.3)';
                                    e.target.style.boxShadow =
                                        '0 2px 8px rgba(16, 185, 129, 0.2)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (sliderPos !== 'home') {
                                    e.target.style.backgroundColor =
                                        'rgba(100, 116, 139, 0.3)';
                                    e.target.style.boxShadow = 'none';
                                }
                            }}
                            disabled={isLoading}
                        >
                            H
                        </button>

                        {/* Positions 1-12 */}
                        {Array.from({ length: 12 }, (_, i) => {
                            const position = i + 1;
                            const positionStr = String(position);
                            const isDisabled = position > 3; // Only 1, 2, 3 are enabled
                            const isActive = sliderPos === positionStr;

                            return (
                                <button
                                    key={position}
                                    onClick={() =>
                                        handleSliderChange(positionStr)
                                    }
                                    disabled={isLoading || isDisabled}
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
                                            : isLoading
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
                                            : isLoading
                                              ? 0.6
                                              : 1,
                                    }}
                                    onMouseEnter={(e) => {
                                        if (
                                            !isLoading &&
                                            !isDisabled &&
                                            !isActive
                                        ) {
                                            e.target.style.backgroundColor =
                                                'rgba(16, 185, 129, 0.3)';
                                            e.target.style.boxShadow =
                                                '0 2px 8px rgba(16, 185, 129, 0.2)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive && !isDisabled) {
                                            e.target.style.backgroundColor =
                                                'rgba(100, 116, 139, 0.3)';
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
                        style={{ justifyContent: 'center' }}
                    >
                        <input
                            type="checkbox"
                            checked={isPumpOn}
                            onChange={handlePumpToggle}
                            disabled={isLoading}
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
                        style={{ justifyContent: 'center' }}
                    >
                        <input
                            type="checkbox"
                            checked={isFuzzyOn}
                            onChange={() => setIsFuzzyOn(!isFuzzyOn)}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>
        </div>
    );
}

export default DevicePage;
