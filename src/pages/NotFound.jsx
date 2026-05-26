import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div
            style={{ textAlign: 'center', padding: '50px', marginTop: '100px' }}
        >
            <h1 style={{ fontSize: '72px', color: '#e74c3c', margin: '0' }}>
                404
            </h1>
            <h2>Halaman Tidak Ditemukan</h2>
            <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>
                Maaf, rute yang Anda masukkan tidak tersedia atau Anda tidak
                memiliki akses.
            </p>
            <Link
                to="/"
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#282c34',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '5px',
                }}
            >
                Kembali ke Dashboard
            </Link>
        </div>
    );
}

export default NotFound;
