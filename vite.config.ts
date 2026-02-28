import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      // BlockSuite canary: affine-components imports typo "CheckBoxCkeckSolidIcon"
      '@blocksuite/icons/lit': path.resolve(__dirname, 'src/blocksuite-icons-shim.js'),
    },
  },
})
