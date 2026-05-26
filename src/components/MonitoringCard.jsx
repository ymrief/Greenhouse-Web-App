function MonitoringCard({ judul, nilai, status }) {
    // Menentukan warna background berdasarkan status (opsional, untuk visualisasi)
    const isWarning = status === 'MENYALA' || nilai < 50;

    const cardStyle = {
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        minWidth: '200px',
        borderTop: isWarning ? '4px solid #f44336' : '4px solid #4CAF50',
    };

    return (
        <div style={cardStyle}>
            <h3
                style={{
                    margin: '0 0 10px 0',
                    color: '#555',
                    fontSize: '16px',
                }}
            >
                {judul}
            </h3>
            <div
                style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}
            >
                {nilai}{' '}
                <span style={{ fontSize: '14px', fontWeight: 'normal' }}>
                    {status}
                </span>
            </div>
        </div>
    );
}

export default MonitoringCard;
