import { prisma } from '../lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// 获取所有文件夹
export async function getAllFolders() {
  try {
    return await prisma.folder.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('获取文件夹失败:', error);
    throw error;
  }
}

// 获取根文件夹
export async function getRootFolders() {
  try {
    return await prisma.folder.findMany({
      where: { parentId: null },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('获取根文件夹失败:', error);
    throw error;
  }
}

// 获取子文件夹
export async function getChildFolders(parentId: string) {
  try {
    return await prisma.folder.findMany({
      where: { parentId },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error(`获取父文件夹 ${parentId} 的子文件夹失败:`, error);
    throw error;
  }
}

// 创建文件夹
export async function createFolder(name: string, parentId: string | null) {
  try {
    // 生成文件夹ID
    const id = uuidv4();
    
    // 构建路径
    let path = `/${id}`;
    
    if (parentId) {
      const parentFolder = await prisma.folder.findUnique({
        where: { id: parentId },
      });
      
      if (parentFolder) {
        path = `${parentFolder.path}/${id}`;
      }
    }
    
    return await prisma.folder.create({
      data: {
        id,
        name,
        parentId,
        path,
      },
    });
  } catch (error) {
    console.error('创建文件夹失败:', error);
    throw error;
  }
}

// 更新文件夹
export async function updateFolder(id: string, name: string) {
  try {
    return await prisma.folder.update({
      where: { id },
      data: { name },
    });
  } catch (error) {
    console.error(`更新文件夹 ${id} 失败:`, error);
    throw error;
  }
}

// 移动文件夹
export async function moveFolder(id: string, newParentId: string | null) {
  try {
    // 获取当前文件夹
    const folder = await prisma.folder.findUnique({
      where: { id },
    });
    
    if (!folder) throw new Error(`文件夹 ${id} 不存在`);
    
    // 构建新路径
    let newPath = `/${id}`;
    
    if (newParentId) {
      const parentFolder = await prisma.folder.findUnique({
        where: { id: newParentId },
      });
      
      if (parentFolder) {
        newPath = `${parentFolder.path}/${id}`;
      }
    }
    
    // 更新当前文件夹路径
    const updatedFolder = await prisma.folder.update({
      where: { id },
      data: { 
        parentId: newParentId,
        path: newPath 
      },
    });
    
    // 递归更新所有子文件夹的路径
    await updateChildFolderPaths(id, folder.path, newPath);
    
    return updatedFolder;
  } catch (error) {
    console.error(`移动文件夹 ${id} 失败:`, error);
    throw error;
  }
}

// 递归更新子文件夹路径
async function updateChildFolderPaths(parentId: string, oldParentPath: string, newParentPath: string) {
  // 获取所有子文件夹
  const childFolders = await prisma.folder.findMany({
    where: { parentId },
  });
  
  for (const childFolder of childFolders) {
    // 构建新路径
    const newPath = childFolder.path.replace(oldParentPath, newParentPath);
    
    // 更新子文件夹路径
    await prisma.folder.update({
      where: { id: childFolder.id },
      data: { path: newPath },
    });
    
    // 递归更新子文件夹的子文件夹
    await updateChildFolderPaths(childFolder.id, childFolder.path, newPath);
  }
}

// 删除文件夹
export async function deleteFolder(id: string) {
  try {
    return await prisma.folder.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`删除文件夹 ${id} 失败:`, error);
    throw error;
  }
}