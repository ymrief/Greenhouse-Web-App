import MonitoringCard from '../components/MonitoringCard';

function Dashboard() {
    // Simulasi data yang mungkin didapatkan dari mikrokontroler
    const parameterData = [
        { id: 1, judul: 'Kelembapan Tanah', nilai: 45, status: '%' },
        { id: 2, judul: 'Intensitas Cahaya', nilai: 800, status: 'Lux' },
        {
            id: 3,
            judul: 'Status Pompa Air',
            nilai: 'Aktif',
            status: '(MENYALA)',
        },
        {
            id: 4,
            judul: 'Status Stepper Motor',
            nilai: 'Terkunci',
            status: '(BERHENTI)',
        },
        { id: 5, judul: 'Kelembapan Tanah', nilai: 45, status: '%' },
        { id: 6, judul: 'Intensitas Cahaya', nilai: 800, status: 'Lux' },
        {
            id: 7,
            judul: 'Status Pompa Air',
            nilai: 'Aktif',
            status: '(MENYALA)',
        },
        {
            id: 8,
            judul: 'Status Stepper Motor',
            nilai: 'Terkunci',
            status: '(BERHENTI)',
        },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Dashboard Monitoring</h1>

            {/* Wadah untuk menata posisi card (menggunakan Grid atau Flexbox) */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px',
                }}
            >
                {/* Melakukan perulangan untuk mencetak card */}
                {parameterData.map((data) => (
                    <MonitoringCard
                        key={data.id}
                        judul={data.judul}
                        nilai={data.nilai}
                        status={data.status}
                    />
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
