function AboutPage() {
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
                Apa itu Smart Greenhouse?
            </h1>

            {/* Main Content Card */}
            <div
                style={{
                    padding: '40px',
                    borderRadius: '12px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    marginBottom: '40px',
                }}
            >
                <p
                    style={{
                        fontSize: '16px',
                        lineHeight: '1.8',
                        color: '#cbd5e1',
                        marginBottom: '20px',
                    }}
                >
                    Smart Greenhouse adalah sistem otomasi rumah kaca yang
                    dirancang untuk mengoptimalkan pertumbuhan tanaman dengan
                    menggunakan teknologi IoT dan kontrol otomatis. Sistem ini
                    dapat memantau dan mengelola berbagai parameter lingkungan
                    seperti suhu, kelembapan, kelembapan tanah, dan intensitas
                    cahaya secara real-time.
                </p>

                <p
                    style={{
                        fontSize: '16px',
                        lineHeight: '1.8',
                        color: '#cbd5e1',
                    }}
                >
                    Dengan antarmuka web yang user-friendly, operator dapat
                    memantau kondisi rumah kaca dari mana saja dan kapan saja,
                    serta mengontrol berbagai perangkat seperti pompa air,
                    solenoid valve, lampu, dan sistem lainnya secara otomatis
                    atau manual sesuai kebutuhan.
                </p>
            </div>

            {/* Features Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px',
                }}
            >
                <FeatureCard
                    icon="📊"
                    title="Monitoring Real-time"
                    description="Pantau parameter lingkungan seperti suhu, kelembapan, dan intensitas cahaya secara real-time."
                />
                <FeatureCard
                    icon="🎛️"
                    title="Kontrol Otomatis"
                    description="Kontrol berbagai perangkat secara otomatis atau manual dengan logika interlocking yang aman."
                />
                <FeatureCard
                    icon="📋"
                    title="Log Aktivitas"
                    description="Catat semua aktivitas sistem untuk keperluan analisis dan debugging."
                />
                <FeatureCard
                    icon="🌱"
                    title="Optimasi Pertumbuhan"
                    description="Sistem fuzzy logic untuk mengoptimalkan kondisi ideal bagi pertumbuhan tanaman."
                />
                <FeatureCard
                    icon="📱"
                    title="Interface Responsif"
                    description="Antarmuka modern yang dapat diakses dari berbagai perangkat."
                />
                <FeatureCard
                    icon="⚙️"
                    title="Mudah Diperluas"
                    description="Arsitektur modular memudahkan penambahan sensor dan perangkat baru."
                />
            </div>

            {/* Project Info */}
            <div
                style={{
                    padding: '30px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
            >
                <h3
                    style={{
                        marginTop: 0,
                        color: '#10b981',
                        fontSize: '20px',
                        fontWeight: '600',
                    }}
                >
                    Tentang Proyek
                </h3>
                <p
                    style={{
                        color: '#cbd5e1',
                        lineHeight: '1.8',
                        marginBottom: '10px',
                    }}
                >
                    <strong>Institusi:</strong> Fakultas Ilmu Komputer,
                    Universitas Pendidikan Nasional Veteran Jakarta (FIK UPNVJ)
                </p>
                <p
                    style={{
                        color: '#cbd5e1',
                        lineHeight: '1.8',
                        marginBottom: '10px',
                    }}
                >
                    <strong>Tujuan:</strong> Mengembangkan sistem monitoring dan
                    kontrol rumah kaca yang efisien menggunakan teknologi IoT
                    dan web application.
                </p>
                <p style={{ color: '#cbd5e1', lineHeight: '1.8' }}>
                    <strong>Stack Teknologi:</strong> React, Node.js, FastAPI,
                    Tailwind CSS, dan sensor IoT
                </p>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div
            style={{
                padding: '25px',
                borderRadius: '12px',
                backgroundColor: '#1e293b',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                e.currentTarget.style.boxShadow =
                    '0 8px 20px rgba(16, 185, 129, 0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
        >
            <div style={{ fontSize: '32px', marginBottom: '15px' }}>{icon}</div>
            <h4
                style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#ffffff',
                    marginBottom: '10px',
                    marginTop: 0,
                }}
            >
                {title}
            </h4>
            <p
                style={{
                    color: '#cbd5e1',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    margin: 0,
                }}
            >
                {description}
            </p>
        </div>
    );
}

export default AboutPage;
