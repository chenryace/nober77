import { prisma } from '../lib/prisma';
// 搜索笔记（全文搜索）
export async function searchNotes(query) {
    if (!query.trim()) {
        return [];
    }
    try {
        // 使用PostgreSQL的全文搜索功能
        // 搜索标题和内容
        return await prisma.note.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } }
                ]
            },
            orderBy: { updatedAt: 'desc' },
            include: {
                folder: true // 包含文件夹信息，方便前端显示
            }
        });
    }
    catch (error) {
        console.error('搜索笔记失败:', error);
        throw error;
    }
}
