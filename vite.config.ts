import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    tsDecorators: true
  })],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  esbuild: {
    loader: 'tsx',
    include: /\.(tsx?|jsx)$/,
    exclude: [],
  }
})
