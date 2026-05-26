function AboutPage() {
    return (
        <div style={{ padding: '40px' }}>
            {/* Menggunakan kelas global dari App.css */}
            <h1 className="teks-judul-besar">Tentang Sistem Ini</h1>
            <p>
                Halaman ini menggunakan font Open Sans yang diatur secara global
                di body.
            </p>
        </div>
    );
}

export default AboutPage;
