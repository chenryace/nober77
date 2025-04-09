// 首先导入所需的模块 - 确保导入语句在类型声明之前
import { PrismaClient } from '@prisma/client';

// 添加Node.js全局类型定义
declare global {
  // 确保这个类型定义只在服务器端生效
  var prisma: PrismaClient | undefined;
}

// 创建一个适用于服务器端和客户端的Prisma实例
let prismaInstance: any;

// 检查是否在浏览器环境中运行
if (typeof window === 'undefined') {
  // 服务器端环境
  // 防止开发环境下创建多个PrismaClient实例
  prismaInstance = (global as any).prisma || new PrismaClient();
  
  if (process.env.NODE_ENV !== 'production') (global as any).prisma = prismaInstance;
} else {
  // 浏览器环境 - 使用空对象模拟Prisma客户端
  // 完全避免在浏览器中尝试加载任何Prisma相关模块
  prismaInstance = {};
}

export const prisma = prismaInstance;