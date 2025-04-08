import { PrismaClient } from '@prisma/client';

// 添加Node.js全局类型定义
declare global {
  var prisma: PrismaClient | undefined;
}

// 防止开发环境下创建多个PrismaClient实例
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;