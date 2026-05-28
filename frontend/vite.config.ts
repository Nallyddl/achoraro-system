import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Activar HMR a menos que DISABLE_HMR esté establecido en 'true' para evitar parpadeos durante las ediciones del agente
      hmr: process.env.DISABLE_HMR !== 'true',
      // Desactivar watch para evitar parpadeos
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      allowedHosts: [
      'unjellied-milo-positivistically.ngrok-free.dev'
    ]
    },
  };
});


