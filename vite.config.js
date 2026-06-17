import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            '/api': {
                target: 'http://192.168.31.34:8000',
                changeOrigin: true,
            },
            '/control': {
                target: 'http://192.168.31.34:8000',
                changeOrigin: true,
            },
            '/manual': {
                target: 'http://192.168.31.34:8000',
                changeOrigin: true,
            },
            '/auto': {
                target: 'http://192.168.31.34:8000',
                changeOrigin: true,
            },
            '/sensor': {
                target: 'http://192.168.31.34:8000',
                changeOrigin: true,
            },
            '/ws/control': {
                target: 'ws://192.168.31.34:8000',
                ws: true,
                changeOrigin: true,
            },
            '/ws': {
                target: 'ws://192.168.31.34:8000',
                ws: true,
                changeOrigin: true,
            },
        },
    },
    preview: {
        proxy: {
            '/api': {
                target: 'http://192.168.31.34:8000',
                changeOrigin: true,
            },
            '/control': {
                target: 'http://192.168.31.34:8000',
                changeOrigin: true,
            },
            '/manual': {
                target: 'http://192.168.31.34:8000',
                changeOrigin: true,
            },
            '/auto': {
                target: 'http://192.168.31.34:8000',
                changeOrigin: true,
            },
            '/sensor': {
                target: 'http://192.168.31.34:8000',
                changeOrigin: true,
            },
            '/ws/control': {
                target: 'ws://192.168.31.34:8000',
                ws: true,
                changeOrigin: true,
            },
            '/ws': {
                target: 'ws://192.168.31.34:8000',
                ws: true,
                changeOrigin: true,
            },
        },
    },
});
