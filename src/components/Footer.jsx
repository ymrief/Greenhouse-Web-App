function Footer() {
    return (
        <footer style={footerStyle}>
            <p>
                <strong>MY LOGO</strong>
            </p>
            <p>© 2026 Copyright: Belajar React</p>
        </footer>
    );
}

const footerStyle = {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f1f1f1',
    marginTop: 'auto', // Memastikan footer di bawah jika menggunakan flexbox
};

export default Footer;
