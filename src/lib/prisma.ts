// 添加Node.js全局类型定义
declare global {
  var prisma: PrismaClient | undefined;
}

// 根据运行环境选择合适的Prisma客户端导入方式
import { PrismaClient } from '@prisma/client';

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
  // 这将允许代码在浏览器中编译，但实际的数据库操作应该在服务器端进行
  prismaInstance = {};
}

export const prisma = prismaInstance;