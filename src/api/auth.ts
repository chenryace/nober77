import prisma from '../lib/prisma';
import * as bcrypt from 'bcryptjs';

// 验证用户密码
export async function verifyPassword(password: string): Promise<boolean> {
  try {
    // 获取admin用户
    const user = await prisma.user.findUnique({
      where: { username: 'admin' },
    });

    // 如果用户不存在，返回false
    if (!user) return false;

    // 验证密码
    return bcrypt.compare(password, user.passwordHash);
  } catch (error) {
    console.error('验证密码失败:', error);
    return false;
  }
}

// 更改密码
export async function changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
  try {
    // 先验证当前密码
    const isValid = await verifyPassword(currentPassword);
    if (!isValid) return false;

    // 对新密码进行哈希处理
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await prisma.user.update({
      where: { username: 'admin' },
      data: { passwordHash: hashedPassword },
    });

    return true;
  } catch (error) {
    console.error('更改密码失败:', error);
    return false;
  }
}

// 初始化admin用户
export async function initAdminUser(): Promise<void> {
  try {
    // 检查admin用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username: 'admin' },
    });

    // 如果用户已存在，则不做任何操作
    if (existingUser) return;

    // 创建默认admin用户，密码为admin
    const hashedPassword = await bcrypt.hash('admin', 10);
    await prisma.user.create({
      data: {
        username: 'admin',
        passwordHash: hashedPassword,
      },
    });

    console.log('已创建默认admin用户');
  } catch (error) {
    console.error('初始化admin用户失败:', error);
  }
}