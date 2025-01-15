import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default ({ mode = 'development' }: UserConfig) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    base: './',
    server: {
      port: process.env.VITE_PORT ? +process.env.VITE_PORT : 4444,
    },
    plugins: [react(), tsconfigPaths()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  })
}
