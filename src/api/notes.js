import { prisma } from '../lib/prisma';
import { v4 as uuidv4 } from 'uuid';
// 获取所有笔记
export async function getAllNotes() {
    try {
        return await prisma.note.findMany({
            orderBy: { updatedAt: 'desc' },
        });
    }
    catch (error) {
        console.error('获取笔记失败:', error);
        throw error;
    }
}
// 获取指定文件夹下的笔记
export async function getNotesByFolder(folderId) {
    try {
        return await prisma.note.findMany({
            where: { folderId },
            orderBy: { updatedAt: 'desc' },
        });
    }
    catch (error) {
        console.error(`获取文件夹 ${folderId} 的笔记失败:`, error);
        throw error;
    }
}
// 获取单个笔记
export async function getNoteById(id) {
    try {
        return await prisma.note.findUnique({
            where: { id },
        });
    }
    catch (error) {
        console.error(`获取笔记 ${id} 失败:`, error);
        throw error;
    }
}
// 创建笔记
export async function createNote(title, content, folderId) {
    try {
        return await prisma.note.create({
            data: {
                id: uuidv4(),
                title,
                content,
                folderId,
            },
        });
    }
    catch (error) {
        console.error('创建笔记失败:', error);
        throw error;
    }
}
// 更新笔记
export async function updateNote(id, data) {
    try {
        return await prisma.note.update({
            where: { id },
            data,
        });
    }
    catch (error) {
        console.error(`更新笔记 ${id} 失败:`, error);
        throw error;
    }
}
// 删除笔记
export async function deleteNote(id) {
    try {
        return await prisma.note.delete({
            where: { id },
        });
    }
    catch (error) {
        console.error(`删除笔记 ${id} 失败:`, error);
        throw error;
    }
}
