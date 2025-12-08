import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        allowedHosts: ['localhost'],
    },
    resolve: {
        alias: {
            'primereact/api': 'primereact/api/api.esm.js',
        },
    },
    ssr: {
        noExternal: ['primereact'],
    },
});
