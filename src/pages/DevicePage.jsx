import { useState } from 'react';
import { useDeviceControl } from '../hooks/useDeviceControl';

function Device() {
    // 1. Inisialisasi Hook API Backend
    const { togglePompa, toggleSolenoid, setSlider, isLoading, error } =
        useDeviceControl();

    // 2. State untuk 2 Solenoid Valve (Kanan & Kiri)
    const [valves, setValves] = useState({
        kanan: false,
        kiri: false,
    });

    // 3. State untuk 4 Checkpoint Position (home, 1, 2, 3)
    const [sliderPos, setSliderPos] = useState('home');
    const checkpointLabels = ['home', '1', '2', '3'];

    // 4. State untuk Kartu Bagian Bawah
    const [isPumpOn, setIsPumpOn] = useState(false);
    const [isMotorOn, setIsMotorOn] = useState(false); // Initial state: motor mati
    const [isFuzzyOn, setIsFuzzyOn] = useState(false);

    // --- FUNGSI KONTROL & LOGIKA INTERLOCK ---

    const handleValveToggle = async (solenoidName) => {
        // solenoidName: 'kanan' atau 'kiri'
        const currentStatus = valves[solenoidName];
        const actionToSend = !currentStatus ? 'on' : 'off';

        try {
            // 1. Kirim perintah ke FastAPI
            await toggleSolenoid(solenoidName, actionToSend);

            // 2. Update UI Valve
            const newValves = { ...valves };
            newValves[solenoidName] = !currentStatus;
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
            alert(`Gagal mengirim perintah ke solenoid ${solenoidName}`);
        }
    };

    const handleSliderChange = async (checkpoint) => {
        // checkpoint: 'home', '1', '2', '3'
        try {
            await setSlider(checkpoint);
            setSliderPos(checkpoint);
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

    const handleMotorToggle = () => {
        const nextMotorState = !isMotorOn;
        setIsMotorOn(nextMotorState);

        // Logika Interlock Mutlak: Motor menyala -> Pompa berhenti
        if (nextMotorState === true) {
            setIsPumpOn(false);
            // Opsional: panggil await togglePompa("off") di sini jika diperlukan
        }
    };

    // --- RENDER TAMPILAN (UI) ---

    return (
        <div>
            <h1 style={titleStyle}>Device Control</h1>

            {/* Menampilkan pesan error global dari hook jika ada */}
            {error && (
                <div style={{ color: 'red', marginBottom: '15px' }}>
                    {error}
                </div>
            )}

            {/* --- KARTU 1: KONTROL SELENOID VALVE --- */}
            <div style={cardStyle}>
                <h3 style={cardTitleStyle}>Kontrol Selenoid Valve</h3>
                <div style={valveGridStyle}>
                    {Object.entries(valves).map(([solenoidName, isOn]) => (
                        <div key={solenoidName} style={{ textAlign: 'center' }}>
                            <ToggleSwitch
                                isOn={isOn}
                                onToggle={() => handleValveToggle(solenoidName)}
                                disabled={isLoading}
                            />
                            <p style={labelStyle}>
                                Solenoid {solenoidName.toUpperCase()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- KARTU 2: KONTROL POSISI SLIDER --- */}
            <div style={cardStyle}>
                <h3 style={cardTitleStyle}>Kontrol Posisi Slider</h3>
                <div style={sliderContainerStyle}>
                    {/* Garis abu-abu di belakang bulatan */}
                    <div style={sliderLineStyle}></div>

                    {/* Mencetak 4 bulatan checkpoint */}
                    {checkpointLabels.map((label) => (
                        <div
                            key={label}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                zIndex: 1,
                            }}
                        >
                            <div
                                onClick={() => handleSliderChange(label)}
                                style={{
                                    ...sliderDotStyle,
                                    backgroundColor:
                                        sliderPos === label
                                            ? '#4CAF50'
                                            : '#dcdde1',
                                    border: '3px solid white',
                                    cursor: isLoading
                                        ? 'not-allowed'
                                        : 'pointer',
                                }}
                            ></div>
                            <span style={{ ...labelStyle, marginTop: '8px' }}>
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- KARTU 3: KONTROL BAWAH (3 KOLOM) --- */}
            <div style={bottomGridStyle}>
                <div style={cardStyle}>
                    <h4 style={bottomCardTitleStyle}>Kontrol Pompa</h4>
                    <ToggleSwitch
                        isOn={isPumpOn}
                        onToggle={handlePumpToggle}
                        disabled={isLoading}
                    />
                </div>

                <div style={cardStyle}>
                    <h4 style={bottomCardTitleStyle}>Kontrol Stepper Motor</h4>
                    <ToggleSwitch
                        isOn={isMotorOn}
                        onToggle={handleMotorToggle}
                        disabled={isLoading}
                    />
                </div>

                <div style={cardStyle}>
                    <h4 style={bottomCardTitleStyle}>Automatisasi Fuzzy</h4>
                    <ToggleSwitch
                        isOn={isFuzzyOn}
                        onToggle={() => setIsFuzzyOn(!isFuzzyOn)}
                    />
                </div>
            </div>
        </div>
    );
}

// ==========================================
// KOMPONEN MINI: TOGGLE SWITCH (SAKELAR)
// ==========================================
function ToggleSwitch({ isOn, onToggle, disabled }) {
    return (
        <div
            onClick={disabled ? null : onToggle}
            style={{
                width: '50px',
                height: '26px',
                backgroundColor: isOn ? '#4CAF50' : '#ccc',
                borderRadius: '25px',
                position: 'relative',
                cursor: disabled ? 'wait' : 'pointer',
                transition: 'background-color 0.3s',
                margin: '0 auto',
                opacity: disabled ? 0.6 : 1,
            }}
        >
            <div
                style={{
                    width: '22px',
                    height: '22px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '2px',
                    left: isOn ? '26px' : '2px',
                    transition: 'left 0.3s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
            ></div>
        </div>
    );
}

// ==========================================
// PENGATURAN CSS OBJECT (TEMA TERANG)
// ==========================================

const titleStyle = {
    marginBottom: '20px',
    color: '#333',
};

const cardStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const cardTitleStyle = {
    margin: '0 0 20px 0',
    fontSize: '18px',
    color: '#333',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
};

const bottomCardTitleStyle = {
    margin: '0 0 20px 0',
    fontSize: '16px',
    color: '#333',
    textAlign: 'center',
};

const valveGridStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
};

const labelStyle = {
    marginTop: '10px',
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
};

// CSS Khusus untuk Slider Posisi
const sliderContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    padding: '10px 0 10px 0',
};

const sliderLineStyle = {
    position: 'absolute',
    top: '21px',
    left: '15px',
    right: '15px',
    height: '4px',
    backgroundColor: '#eee',
    zIndex: 0,
};

const sliderDotStyle = {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

// CSS untuk Grid 3 Kolom di Bawah
const bottomGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
};

export default Device;
