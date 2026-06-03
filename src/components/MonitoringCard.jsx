function MonitoringCard({ judul, nilai, status, icon, large = false }) {
    const cardStyle = {
        padding: large ? '30px' : '20px',
        borderRadius: '12px',
        backgroundColor: '#1e293b',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        minWidth: large ? '100%' : '200px',
    };

    const titleStyle = {
        margin: '0 0 15px 0',
        color: '#cbd5e1',
        fontSize: large ? '18px' : '14px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    };

    const valueStyle = {
        fontSize: large ? '48px' : '28px',
        fontWeight: 'bold',
        color: '#10b981',
        fontFamily: "'Roboto Mono', monospace",
    };

    const statusStyle = {
        fontSize: large ? '18px' : '12px',
        fontWeight: 'normal',
        color: '#94a3b8',
        marginLeft: '8px',
    };

    return (
        <div style={cardStyle}>
            <div style={titleStyle}>
                <span style={{ fontSize: '20px' }}>{icon}</span>
                {judul}
            </div>
            <div>
                <span style={valueStyle}>{nilai}</span>
                <span style={statusStyle}>{status}</span>
            </div>
        </div>
    );
}

export default MonitoringCard;
