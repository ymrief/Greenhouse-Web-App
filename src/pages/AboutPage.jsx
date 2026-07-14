function AboutPage() {
    return (
        <div className="max-w-6xl mx-auto pb-16 space-y-12 md:space-y-16">
            {/* Title Section */}
            <div className="text-center space-y-4">
                <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-300 leading-tight py-1">
                    Tentang Smart Greenhouse
                </h1>
                <p className="text-slate-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
                    Sistem pemantauan dan kontrol otomatisasi rumah kaca berbasis Internet of Things (IoT) untuk presisi dan optimalisasi pertumbuhan tanaman.
                </p>
            </div>

            {/* Main Overview */}
            <div className="p-6 md:p-10 rounded-2xl bg-slate-800 border border-slate-700/50 shadow-xl relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute -top-1/2 -right-1/4 w-80 h-80 bg-emerald-500/5 filter blur-3xl rounded-full pointer-events-none"></div>

                <h2 className="text-xl md:text-2xl font-bold text-emerald-400 mb-4">
                    Deskripsi Proyek
                </h2>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-4">
                    Proyek <strong>Smart Greenhouse</strong> dirancang sebagai solusi modern atas permasalahan pertanian konvensional seperti fluktuasi cuaca ekstrem dan inefisiensi penggunaan sumber daya air. Dengan memanfaatkan jaringan sensor nirkabel (<em>wireless sensor networks</em>) dan aktuator terpadu, sistem ini menciptakan lingkungan mikro yang terkendali, stabil, dan ideal bagi perkembangan vegetasi di dalam rumah kaca.
                </p>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                    Integrasi web memungkinkan operator memantau parameter vital tanah dan udara secara langsung dari jarak jauh. Selain itu, hadirnya mode otomatisasi berbasis logika kecerdasan buatan (<em>fuzzy logic</em>) menjamin presisi penyiraman tanaman secara adaptif berdasarkan kondisi aktual kelembapan tanah, suhu, dan intensitas cahaya matahari.
                </p>
            </div>

            {/* Grid 2 Columns: System Architecture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Panel 1: Arsitektur Perangkat Keras */}
                <div className="p-6 md:p-8 rounded-2xl bg-slate-800 border border-slate-700/50 shadow-lg flex flex-col">
                    <h3 className="text-emerald-400 text-lg md:text-xl font-bold mt-0 mb-5 flex items-center gap-2.5">
                        <span>🔌</span> Hardware & IoT Layer
                    </h3>
                    <ul className="list-disc list-inside space-y-3.5 text-slate-300 text-sm md:text-base leading-relaxed">
                        <li>
                            <strong>ESP32 Microcontroller:</strong> Sebagai otak pemroses data sensor di lapangan dan penerima instruksi kontrol dari server.
                        </li>
                        <li>
                            <strong>Sensor Kelembapan Tanah (Soil Moisture):</strong> Memantau kelembapan media tanam secara spesifik di 6 titik polybag berbeda.
                        </li>
                        <li>
                            <strong>Sensor Udara (DHT22):</strong> Mengukur suhu lingkungan mikro dan tingkat kelembapan udara (<em>Relative Humidity</em>).
                        </li>
                        <li>
                            <strong>Sensor Cahaya (BH1750):</strong> Mengukur intensitas cahaya dalam satuan Lux guna mendukung analisis kebutuhan fotosintesis.
                        </li>
                        <li>
                            <strong>Aktuator Mekanis:</strong> Pompa air bertekanan, Solenoid Valve selektif, dan Slider Motor pengarah otomatis.
                        </li>
                    </ul>
                </div>

                {/* Panel 2: Arsitektur Perangkat Lunak */}
                <div className="p-6 md:p-8 rounded-2xl bg-slate-800 border border-slate-700/50 shadow-lg flex flex-col">
                    <h3 className="text-emerald-400 text-lg md:text-xl font-bold mt-0 mb-5 flex items-center gap-2.5">
                        <span>💻</span> Software & Data Layer
                    </h3>
                    <ul className="list-disc list-inside space-y-3.5 text-slate-300 text-sm md:text-base leading-relaxed">
                        <li>
                            <strong>React JS Frontend:</strong> Antarmuka web responsif dengan <em>real-time updates</em> melalui koneksi WebSockets yang interaktif.
                        </li>
                        <li>
                            <strong>FastAPI Backend:</strong> Server API berkinerja tinggi berbasis Python, melayani permintaan data sensor dan logika otomasi.
                        </li>
                        <li>
                            <strong>PostgreSQL Database:</strong> Tempat penyimpanan historis seluruh parameter sensor dan log kontrol untuk audit performa.
                        </li>
                        <li>
                            <strong>WebSockets Protocol:</strong> Saluran komunikasi dupleks penuh untuk sinkronisasi instan status kontrol dan data sensor.
                        </li>
                        <li>
                            <strong>Fuzzy Inference System:</strong> Algoritma kalkulasi penyiraman otomatis berdasarkan masukan sensor untuk efisiensi air.
                        </li>
                    </ul>
                </div>
            </div>

            {/* Tim Pengembang & Institusi */}
            <div className="p-6 md:p-10 rounded-2xl bg-emerald-500/5 border border-emerald-500/15">
                <div className="text-center mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-emerald-400">
                        Tim Pengembang & Institusi
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm mt-2">
                        Fakultas Ilmu Komputer, Universitas Pembangunan Nasional Veteran Jakarta (FIK UPNVJ)
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <DeveloperCard
                        name="TIM AIoT"
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
            <div className="space-y-8">
                <h2 className="text-xl md:text-2xl font-bold text-white text-center">
                    Fitur Utama Sistem
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                        description="Pencatatan lengkap eksekusi aktuator, status pengiriman perintah, mode otomatis/manual, serta riwayat kegagalan jaringan."
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
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700/40 shadow-md hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/25 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col gap-2">
            <div className="text-3xl sm:text-4xl mb-2 select-none">{icon}</div>
            <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                {title}
            </h4>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                {description}
            </p>
        </div>
    );
}

function DeveloperCard({ name, role, details }) {
    return (
        <div className="p-6 rounded-xl bg-slate-800 border border-slate-700/40 shadow-md flex flex-col gap-2">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                {role}
            </span>
            <span className="text-lg font-bold text-white">
                {name}
            </span>
            <span className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                {details}
            </span>
        </div>
    );
}

export default AboutPage;
