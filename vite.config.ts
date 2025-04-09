import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 移除特定的别名配置，使用默认解析
    }
  },
  build: {
    // 移除external配置，允许Prisma客户端被打包到最终构建中
  }
})
