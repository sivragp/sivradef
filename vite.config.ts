import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      // Keep the heavy recharts chunk (only used by the lazy-loaded Services
      // page) out of the eager <link rel="modulepreload"> set. It stays lazy
      // via React.lazy, so it only loads when Services is actually visited.
      modulePreload: {
        resolveDependencies(_filename, deps) {
          return deps.filter((dep) => !dep.includes('recharts'));
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/recharts')) return 'recharts';
            if (id.includes('node_modules/d3-')) return 'recharts';
            if (id.includes('node_modules/motion')) return 'motion';
          },
        },
      },
    },
  };
});
