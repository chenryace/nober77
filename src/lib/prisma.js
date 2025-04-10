// 根据运行环境选择合适的Prisma客户端导入方式
import { PrismaClient } from '@prisma/client';
// 创建一个适用于服务器端和客户端的Prisma实例
let prismaInstance;
// 检查是否在浏览器环境中运行
if (typeof window === 'undefined') {
    // 防止开发环境下创建多个PrismaClient实例
    prismaInstance = global.prisma || new PrismaClient();
    if (process.env.NODE_ENV !== 'production')
        global.prisma = prismaInstance;
}
else {
    // 浏览器环境 - 使用空对象模拟Prisma客户端
    // 这将允许代码在浏览器中编译，但实际的数据库操作应该在服务器端进行
    prismaInstance = {};
}
export const prisma = prismaInstance;
