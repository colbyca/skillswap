import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const repoName = 'skillswap'
const basePath = `/${repoName}/`

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  base: basePath,
})
