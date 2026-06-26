function AboutPage() {
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
            {/* Title Section */}
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1
                    style={{
                        fontSize: '48px',
                        fontWeight: '800',
                        marginBottom: '15px',
                        color: '#ffffff',
                        background: 'linear-gradient(135deg, #ffffff 0%, #a7f3d0 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Tentang Smart Greenhouse
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '18px', margin: '0 auto', maxWidth: '800px', lineHeight: '1.6' }}>
                    Sistem pemantauan dan kontrol otomatisasi rumah kaca berbasis Internet of Things (IoT) untuk presisi dan optimalisasi pertumbuhan tanaman.
                </p>
            </div>

            {/* Main Overview */}
            <div
                style={{
                    padding: '40px',
                    borderRadius: '16px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                    marginBottom: '50px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative background glow */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-20%',
                    width: '300px',
                    height: '300px',
                    background: 'rgba(16, 185, 129, 0.08)',
                    filter: 'blur(80px)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                }}></div>

                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', marginBottom: '20px', marginTop: 0 }}>
                    Deskripsi Proyek
                </h2>
                <p
                    style={{
                        fontSize: '16px',
                        lineHeight: '1.8',
                        color: '#cbd5e1',
                        marginBottom: '20px',
                    }}
                >
                    Proyek <strong>Smart Greenhouse</strong> dirancang sebagai solusi modern atas permasalahan pertanian konvensional seperti fluktuasi cuaca ekstrem dan inefisiensi penggunaan sumber daya air. Dengan memanfaatkan jaringan sensor nirkabel (<em>wireless sensor networks</em>) dan aktuator terpadu, sistem ini menciptakan lingkungan mikro yang terkendali, stabil, dan ideal bagi perkembangan vegetasi di dalam rumah kaca.
                </p>
                <p
                    style={{
                        fontSize: '16px',
                        lineHeight: '1.8',
                        color: '#cbd5e1',
                        margin: 0,
                    }}
                >
                    Integrasi web memungkinkan operator memantau parameter vital tanah dan udara secara langsung dari jarak jauh. Selain itu, hadirnya mode otomatisasi berbasis logika kecerdasan buatan (<em>fuzzy logic</em>) menjamin presisi penyiraman tanaman secara adaptif berdasarkan kondisi aktual kelembapan tanah, suhu, dan intensitas cahaya matahari.
                </p>
            </div>

            {/* Grid 2 Columns: System Architecture */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '30px',
                    marginBottom: '50px',
                }}
            >
                {/* Panel 1: Arsitektur Perangkat Keras */}
                <div
                    style={{
                        padding: '30px',
                        borderRadius: '16px',
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <h3 style={{ color: '#10b981', fontSize: '20px', fontWeight: '700', marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        🔌 Hardware & IoT Layer
                    </h3>
                    <ul style={{ paddingLeft: '20px', color: '#cbd5e1', lineHeight: '1.8', margin: 0 }}>
                        <li style={{ marginBottom: '10px' }}>
                            <strong>ESP32 Microcontroller:</strong> Sebagai otak pemroses data sensor di lapangan dan penerima instruksi kontrol dari server.
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <strong>Sensor Kelembapan Tanah (Soil Moisture):</strong> Memantau kelembapan media tanam secara spesifik di 6 titik polybag berbeda.
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <strong>Sensor Udara (DHT22):</strong> Mengukur suhu lingkungan mikro dan tingkat kelembapan udara (<em>Relative Humidity</em>).
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <strong>Sensor Cahaya (BH1750):</strong> Mengukur intensitas cahaya dalam satuan Lux guna mendukung analisis kebutuhan fotosintesis.
                        </li>
                        <li>
                            <strong>Aktuator Mekanis:</strong> Pompa air bertekanan, Solenoid Valve selektif, dan Slider Motor pengarah otomatis.
                        </li>
                    </ul>
                </div>

                {/* Panel 2: Arsitektur Perangkat Lunak */}
                <div
                    style={{
                        padding: '30px',
                        borderRadius: '16px',
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <h3 style={{ color: '#10b981', fontSize: '20px', fontWeight: '700', marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        💻 Software & Data Layer
                    </h3>
                    <ul style={{ paddingLeft: '20px', color: '#cbd5e1', lineHeight: '1.8', margin: 0 }}>
                        <li style={{ marginBottom: '10px' }}>
                            <strong>React JS Frontend:</strong> Antarmuka web responsif dengan <em>real-time updates</em> melalui koneksi WebSockets yang interaktif.
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <strong>FastAPI Backend:</strong> Server API berkinerja tinggi berbasis Python, melayani permintaan data sensor dan logika otomasi.
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <strong>PostgreSQL Database:</strong> Tempat penyimpanan historis seluruh parameter sensor dan log kontrol untuk audit performa.
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <strong>WebSockets Protocol:</strong> Saluran komunikasi dupleks penuh untuk sinkronisasi instan status kontrol dan data sensor.
                        </li>
                        <li>
                            <strong>Fuzzy Inference System:</strong> Algoritma kalkulasi penyiraman otomatis berdasarkan masukan sensor untuk efisiensi air.
                        </li>
                    </ul>
                </div>
            </div>

            {/* Tim Pengembang & Institusi */}
            <div
                style={{
                    padding: '40px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.15)',
                    marginBottom: '50px',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#10b981', margin: 0 }}>
                        Tim Pengembang & Institusi
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '15px', marginTop: '8px' }}>
                        Fakultas Ilmu Komputer, Universitas Pembangunan Nasional Veteran Jakarta (FIK UPNVJ)
                    </p>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '20px',
                    }}
                >
                    <DeveloperCard
                        name="Martinus"
                        role="Developer Utama"
                        details="Riset IoT, Integrasi Perangkat Lunak & Antarmuka Dashboard Web"
                    />
                    <DeveloperCard
                        name="Fakultas Ilmu Komputer"
                        role="Institusi Akademik"
                        details="Penyedia Fasilitas Lab, Bimbingan Riset, dan Pengawasan Akademik Proyek Tugas Akhir"
                    />
                </div>
            </div>

            {/* Features Grid */}
            <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#ffffff', textAlign: 'center', marginBottom: '30px' }}>
                Fitur Utama Sistem
            </h2>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                }}
            >
                <FeatureCard
                    icon="📊"
                    title="Monitoring Real-time"
                    description="Visualisasi grafik dan status aktual dari sensor kelembapan tanah, suhu udara, kelembapan udara, dan intensitas cahaya secara instan."
                />
                <FeatureCard
                    icon="🌱"
                    title="Otomatisasi Fuzzy Logic"
                    description="Keputusan penyiraman tanaman yang cerdas secara otomatis, menyesuaikan laju aliran air dengan tingkat kekeringan media tanam."
                />
                <FeatureCard
                    icon="🎛️"
                    title="Dual Mode Control"
                    description="Fleksibilitas kontrol untuk beralih instan dari mode otomatis cerdas ke kontrol manual operator dengan antarmuka slider interaktif."
                />
                <FeatureCard
                    icon="📋"
                    title="Audit Log Lengkap"
                    description="Pencatatan lengkap durasi eksekusi aktuator, status pengiriman perintah, mode otomatis/manual, serta riwayat kegagalan jaringan."
                />
                <FeatureCard
                    icon="🔒"
                    title="Keamanan Interlocking"
                    description="Proteksi perangkat keras terintegrasi seperti limit switch penghenti motor otomatis dan logika pembatas arus pompa air."
                />
                <FeatureCard
                    icon="📱"
                    title="Desain Responsif Premium"
                    description="Antarmuka modern bergaya dark-mode dengan rendering yang cepat dan optimal untuk diakses dari komputer, tablet, maupun ponsel pintar."
                />
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div
            style={{
                padding: '25px',
                borderRadius: '16px',
                backgroundColor: '#1e293b',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
        >
            <div style={{ fontSize: '36px', marginBottom: '15px' }}>{icon}</div>
            <h4
                style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '10px',
                    marginTop: 0,
                }}
            >
                {title}
            </h4>
            <p
                style={{
                    color: '#94a3b8',
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

function DeveloperCard({ name, role, details }) {
    return (
        <div
            style={{
                padding: '25px',
                borderRadius: '12px',
                backgroundColor: '#1e293b',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
            }}
        >
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {role}
            </span>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>
                {name}
            </span>
            <span style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.5' }}>
                {details}
            </span>
        </div>
    );
}

export default AboutPage;
