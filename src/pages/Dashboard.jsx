import MonitoringCard from '../components/MonitoringCard';

function Dashboard() {
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
                        <CircularProgress value={75} />
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
                                28°C
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
                                RH 50%
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
                                800 Lux
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
                <StatusCard title="Posisi Slider" value="1 / 12" />
                <StatusCard title="Status Pompa Air" value="Otomatis" />
                <StatusCard title="Status Slider" value="Steady" />
            </div>
        </div>
    );
}

function CircularProgress({ value }) {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (value / 100) * circumference;

    return (
        <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
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
