import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            if (res && res.writeHead) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ status: 'offline', message: 'Backend offline on port 5001' }));
            }
          });
        },
      },
      '/heatmap': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      '/backend-static': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend-static/, '/static'),
      },
    },
    watch: {
      ignored: ['**/public/**/*.mp4', '**/*.mp4'],
    },
  },
})
