function Footer() {
    return (
        <footer style={footerStyle}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div>
                    <p style={{ margin: '0 0 5px 0', fontWeight: '600' }}>
                        🌿 Smart Greenhouse
                    </p>
                    <p
                        style={{
                            margin: 0,
                            fontSize: '13px',
                            color: '#94a3b8',
                        }}
                    >
                        © FIK UPNVJ. All rights reserved.
                    </p>
                </div>
                <div
                    style={{
                        fontSize: '13px',
                        color: '#94a3b8',
                        textAlign: 'right',
                    }}
                >
                    <p style={{ margin: 0 }}>v1.0.0</p>
                </div>
            </div>
        </footer>
    );
}

const footerStyle = {
    padding: '30px 40px',
    backgroundColor: '#0f172a',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    marginTop: 'auto',
    color: '#cbd5e1',
};

export default Footer;
