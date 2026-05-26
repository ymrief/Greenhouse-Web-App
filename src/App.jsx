import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import DevicePage from './pages/DevicePage';
import HistoryPage from './pages/HistoryPage';
import NotFound from './pages/NotFound';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route path="/" element={<Layout />}>
                    {/* Rute Publik (Semua bisa akses) */}
                    <Route index element={<Dashboard />} />
                    <Route path="about" element={<AboutPage />} />

                    {/* Rute Privat (Hanya Admin) */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="device" element={<DevicePage />} />
                        <Route path="history" element={<HistoryPage />} />
                    </Route>

                    {/* Rute 404 (Harus selalu diletakkan paling Bawah!) */}
                    {/* Tanda bintang (*) artinya menangkap semua URL yang tidak terdaftar di atas */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
