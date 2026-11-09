import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import {defineConfig, loadEnv} from 'vite';

import { VitePWA } from 'vite-plugin-pwa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ command, mode }) => {
  const isBuild = command === 'build' || process.argv.includes('build');
  const targetMode = isBuild ? 'production' : mode;
  if (isBuild) {
    process.env.NODE_ENV = 'production';
  }
  const env = loadEnv(targetMode, '.', '');

  return {
    base: "/",
    mode: targetMode,
    plugins: [
      react({
        jsxRuntime: 'automatic',
      }), 
      tailwindcss(),
    ],
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'process.env.NODE_ENV': JSON.stringify(isBuild ? 'production' : 'development'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      include: ['react-error-boundary'],
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: false,
    },
  };
});
