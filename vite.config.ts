import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@prisma/client': path.resolve(__dirname, './node_modules/@prisma/client')
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  optimizeDeps: {
    include: ['@prisma/client']
  }
})
