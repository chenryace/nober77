import { prisma } from './prisma';
import { initAdminUser } from '../api/auth';

// 初始化数据库
export async function initDatabase() {
  try {
    // 初始化admin用户
    await initAdminUser();
    
    // 检查是否有根文件夹，如果没有则创建
    const rootFolders = await prisma.folder.findMany({
      where: { parentId: null },
    });
    
    if (rootFolders.length === 0) {
      // 创建默认的根文件夹
      const rootFolder = await prisma.folder.create({
        data: {
          id: '1',
          name: '我的文档',
          parentId: null,
          path: '/1',
        },
      });
      
      // 创建默认的笔记文件夹
      const notesFolder = await prisma.folder.create({
        data: {
          id: '2',
          name: '笔记',
          parentId: rootFolder.id,
          path: `${rootFolder.path}/2`,
        },
      });
      
      // 创建欢迎笔记
      await prisma.note.create({
        data: {
          id: '1',
          title: '欢迎使用Notea',
          content: '# 欢迎使用Notea\n\n这是一个基于Markdown的笔记应用。',
          folderId: notesFolder.id,
        },
      });
      
      console.log('已创建默认文件夹和笔记');
    }
    
    console.log('数据库初始化完成');
  } catch (error) {
    console.error('初始化数据库失败:', error);
  }
}