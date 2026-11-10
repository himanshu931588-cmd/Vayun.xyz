import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url);

function backendIntegrationPlugin(): Plugin {
  return {
    name: 'vayun-backend-integration-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          try {
            if (require && require.cache) {
              Object.keys(require.cache).forEach(id => {
                if (id.includes(path.join('backend', ''))) {
                  delete require.cache[id];
                }
              });
            }

            const { handleApiRequest } = require('./backend/routes.cjs');
            const handled = await handleApiRequest(req, res);
            if (!handled) {
              next();
            }
          } catch (err: any) {
            console.error('[Vite Backend Middleware Error]:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        } else {
          next();
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), backendIntegrationPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true
  }
})
