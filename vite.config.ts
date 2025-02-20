import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    base: '/',
    root: './client',
    build: {
      outDir: '../dist',
      copyPublicDir: true,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@radix-ui/react-dropdown-menu', '@radix-ui/react-slot', '@radix-ui/react-dialog'],
          },
        },
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './client/src'),
        '@shared': path.resolve(__dirname, './shared')
      }
    },
    define: {
      'window.ENV': {
        VITE_SUPABASE_URL: JSON.stringify(env.VITE_SUPABASE_URL || env.SUPABASE_URL),
        VITE_SUPABASE_ANON_KEY: JSON.stringify(env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY)
      }
    }
  }
})