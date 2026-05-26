function HistoryPage() {
    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Log Sistem (History)</h1>

            <div
                style={{
                    padding: '20px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
            >
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li
                        style={{
                            padding: '10px 0',
                            borderBottom: '1px solid #eee',
                        }}
                    >
                        <span style={{ color: '#888', marginRight: '15px' }}>
                            10:45 AM
                        </span>
                        Switch pompa ditekan. Pompa menyala, motor dihentikan
                        otomatis.
                    </li>
                    <li
                        style={{
                            padding: '10px 0',
                            borderBottom: '1px solid #eee',
                        }}
                    >
                        <span style={{ color: '#888', marginRight: '15px' }}>
                            10:30 AM
                        </span>
                        Sistem dinyalakan. Semua parameter normal.
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default HistoryPage;
