import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        sourcemap: false,
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    ui: ['react-bootstrap', 'bootstrap']
                }
            }
        }
    },
    server: {
        proxy: {
            '/api/v1': {
                target: 'https://localhost:7217',
                changeOrigin: true,
                secure: false
            },
        },
        cors: true
    },
    define: {
        'import.meta.env.VITE_PRODUKCIJA': JSON.stringify('https://www.brutallucko.online/api/v1'), 
    },
});
