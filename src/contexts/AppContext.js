import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import * as notesApi from '../api/notes';
import * as foldersApi from '../api/folders';
import * as searchApi from '../api/search';
const AppContext = createContext(undefined);
export function AppProvider({ children }) {
    const [folders, setFolders] = useState([]);
    const [notes, setNotes] = useState([]);
    const [activeNote, setActiveNote] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    // 加载数据
    const loadData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            // 获取所有文件夹
            const foldersData = await foldersApi.getAllFolders();
            setFolders(foldersData);
            // 获取所有笔记
            const notesData = await notesApi.getAllNotes();
            setNotes(notesData);
            setIsLoading(false);
        }
        catch (err) {
            setError('加载数据失败');
            setIsLoading(false);
            console.error(err);
        }
    };
    // 初始加载
    useEffect(() => {
        loadData();
    }, []);
    // 创建文件夹
    const createFolder = async (name, parentId) => {
        try {
            await foldersApi.createFolder(name, parentId);
            await loadData(); // 重新加载数据
        }
        catch (err) {
            setError('创建文件夹失败');
            console.error(err);
        }
    };
    // 更新文件夹
    const updateFolder = async (id, name) => {
        try {
            await foldersApi.updateFolder(id, name);
            await loadData(); // 重新加载数据
        }
        catch (err) {
            setError('更新文件夹失败');
            console.error(err);
        }
    };
    // 移动文件夹
    const moveFolder = async (id, newParentId) => {
        try {
            await foldersApi.moveFolder(id, newParentId);
            await loadData(); // 重新加载数据
        }
        catch (err) {
            setError('移动文件夹失败');
            console.error(err);
        }
    };
    // 删除文件夹
    const deleteFolder = async (id) => {
        try {
            await foldersApi.deleteFolder(id);
            await loadData(); // 重新加载数据
        }
        catch (err) {
            setError('删除文件夹失败');
            console.error(err);
        }
    };
    // 创建笔记
    const createNote = async (title, content, folderId) => {
        try {
            await notesApi.createNote(title, content, folderId);
            await loadData(); // 重新加载数据
        }
        catch (err) {
            setError('创建笔记失败');
            console.error(err);
        }
    };
    // 更新笔记
    const updateNote = async (id, data) => {
        try {
            await notesApi.updateNote(id, data);
            // 更新本地状态
            setNotes(prevNotes => prevNotes.map(note => note.id === id ? { ...note, ...data } : note));
            // 如果当前活动笔记是被更新的笔记，也更新活动笔记
            if (activeNote && activeNote.id === id) {
                setActiveNote(prev => prev ? { ...prev, ...data } : null);
            }
        }
        catch (err) {
            setError('更新笔记失败');
            console.error(err);
        }
    };
    // 删除笔记
    const deleteNote = async (id) => {
        try {
            await notesApi.deleteNote(id);
            // 如果当前活动笔记是被删除的笔记，清除活动笔记
            if (activeNote && activeNote.id === id) {
                setActiveNote(null);
            }
            await loadData(); // 重新加载数据
        }
        catch (err) {
            setError('删除笔记失败');
            console.error(err);
        }
    };
    // 搜索笔记
    const searchNotes = async (query) => {
        try {
            setSearchTerm(query);
            if (!query.trim()) {
                setSearchResults([]);
                return;
            }
            setIsLoading(true);
            const results = await searchApi.searchNotes(query);
            setSearchResults(results);
            setIsLoading(false);
        }
        catch (err) {
            setError('搜索笔记失败');
            setIsLoading(false);
            console.error(err);
        }
    };
    return (_jsx(AppContext.Provider, { value: {
            folders,
            notes,
            activeNote,
            isLoading,
            error,
            searchResults,
            searchTerm,
            setActiveNote,
            createFolder,
            updateFolder,
            moveFolder,
            deleteFolder,
            createNote,
            updateNote,
            deleteNote,
            searchNotes,
            refreshData: loadData,
        }, children: children }));
}
// 自定义钩子，用于访问上下文
export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
