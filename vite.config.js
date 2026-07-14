import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Konfigurasi target Backend (Hanya digunakan saat development lokal via 'npm run dev')
// GANTILAH alamat IP/Port ini jika target backend development lokal Anda berubah:
const BACKEND_HOST = '103.147.92.179:8002';
const BACKEND_HTTP = `http://${BACKEND_HOST}`;
const BACKEND_WS = `ws://${BACKEND_HOST}`;

// Konfigurasi proxy yang digunakan bersama oleh dev server dan preview server
const proxyConfig = {
    '/ws/control-logs': {
        target: BACKEND_WS,
        ws: true,
        changeOrigin: true,
    },
    '/api': {
        target: BACKEND_HTTP,
        changeOrigin: true,
    },
    '/control': {
        target: BACKEND_HTTP,
        changeOrigin: true,
    },
    '/manual': {
        target: BACKEND_HTTP,
        changeOrigin: true,
    },
    '/auto': {
        target: BACKEND_HTTP,
        changeOrigin: true,
    },
    '/sensor': {
        target: BACKEND_HTTP,
        changeOrigin: true,
    },
    '/ws/control': {
        target: BACKEND_WS,
        ws: true,
        changeOrigin: true,
    },
    '/ws': {
        target: BACKEND_WS,
        ws: true,
        changeOrigin: true,
    },
};

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: '/greenhouse/website/',
    server: {
        proxy: proxyConfig,
    },
    preview: {
        proxy: proxyConfig,
    },
});
