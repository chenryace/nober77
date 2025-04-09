import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useAppContext } from '../../contexts/AppContext';
import './Sidebar.css';
const Sidebar = ({ folders, notes, onNoteSelect, collapsed, onToggleCollapse, onCreateFolder, onCreateNote, onRenameFolder, onMoveFolder, onDeleteFolder, onDeleteNote, onMoveNote, onLogout, onOpenSettings }) => {
    const [expandedFolders, setExpandedFolders] = useState({
        '1': true, // 默认展开根文件夹
    });
    const { searchNotes, searchResults } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeNoteId, setActiveNoteId] = useState(null);
    const [editingFolderId, setEditingFolderId] = useState(null);
    const [editingFolderName, setEditingFolderName] = useState('');
    const toggleFolder = (folderId, _e) => {
        _e.stopPropagation();
        setExpandedFolders(prev => ({
            ...prev,
            [folderId]: !prev[folderId],
        }));
    };
    const handleNoteClick = (note) => {
        setActiveNoteId(note.id);
        onNoteSelect(note);
    };
    // 处理搜索输入变化
    const handleSearchChange = (_e) => {
        const value = _e.target.value;
        setSearchTerm(value);
    };
    // 当搜索词变化时执行搜索
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            searchNotes(searchTerm);
        }, 300); // 添加延迟，避免频繁搜索
        return () => clearTimeout(delaySearch);
    }, [searchTerm]);
    const handleCreateFolder = (parentId) => {
        onCreateFolder(parentId);
    };
    const handleCreateNote = (folderId) => {
        onCreateNote(folderId);
    };
    const startEditingFolder = (folder, e) => {
        e.stopPropagation();
        setEditingFolderId(folder.id);
        setEditingFolderName(folder.name);
    };
    const saveEditingFolder = () => {
        if (editingFolderId && editingFolderName.trim()) {
            onRenameFolder(editingFolderId, editingFolderName.trim());
            setEditingFolderId(null);
        }
    };
    const handleDeleteFolder = (folderId, e) => {
        e.stopPropagation();
        if (confirm('确定要删除此文件夹及其所有内容吗？')) {
            onDeleteFolder(folderId);
        }
    };
    const handleDeleteNote = (noteId, e) => {
        e.stopPropagation();
        if (confirm('确定要删除此笔记吗？')) {
            onDeleteNote(noteId);
        }
    };
    // 文件夹拖拽组件
    const FolderItem = ({ folder, level }) => {
        const folderNotes = notes.filter(note => note.folderId === folder.id);
        const isExpanded = expandedFolders[folder.id];
        const isEditing = editingFolderId === folder.id;
        const ref = useRef(null);
        // 设置文件夹可拖拽
        const [{ isDragging }, drag] = useDrag(() => ({
            type: 'FOLDER',
            item: { type: 'FOLDER', id: folder.id },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }));
        // 设置文件夹可接收拖拽
        const [{ isOver }, drop] = useDrop(() => ({
            accept: ['FOLDER', 'NOTE'],
            drop: (item, monitor) => {
                if (monitor.didDrop())
                    return; // 防止嵌套元素重复处理
                if (item.type === 'FOLDER' && item.id !== folder.id) {
                    // 移动文件夹到此文件夹下
                    onMoveFolder(item.id, folder.id);
                }
                else if (item.type === 'NOTE') {
                    // 移动笔记到此文件夹
                    onMoveNote(item.id, folder.id);
                }
            },
            collect: (monitor) => ({
                isOver: monitor.isOver({ shallow: true }),
            }),
        }));
        // 合并引用
        drag(drop(ref));
        return (_jsxs("li", { ref: ref, className: `folder-item ${isDragging ? 'dragging' : ''} ${isOver ? 'drop-target' : ''}`, children: [_jsxs("div", { className: "folder-header", onClick: (e) => toggleFolder(folder.id, e), children: [_jsx("span", { className: `folder-icon ${isExpanded ? 'expanded' : ''}`, onClick: (e) => toggleFolder(folder.id, e), children: "\u25B6" }), isEditing ? (_jsx("input", { type: "text", className: "folder-name-input", value: editingFolderName, onChange: (e) => setEditingFolderName(e.target.value), onBlur: saveEditingFolder, onKeyDown: (e) => e.key === 'Enter' && saveEditingFolder(), autoFocus: true, onClick: (e) => e.stopPropagation() })) : (_jsx("span", { className: "folder-name", children: folder.name })), _jsxs("div", { className: "folder-actions", children: [_jsx("button", { className: "folder-action-btn", onClick: (e) => startEditingFolder(folder, e), title: "\u91CD\u547D\u540D", children: "\u270F\uFE0F" }), _jsx("button", { className: "folder-action-btn", onClick: (_e) => handleCreateFolder(folder.id), title: "\u65B0\u5EFA\u5B50\u6587\u4EF6\u5939", children: "\uD83D\uDCC1+" }), _jsx("button", { className: "folder-action-btn", onClick: (_e) => handleCreateNote(folder.id), title: "\u65B0\u5EFA\u7B14\u8BB0", children: "\uD83D\uDCDD+" }), _jsx("button", { className: "folder-action-btn delete", onClick: (e) => handleDeleteFolder(folder.id, e), title: "\u5220\u9664", children: "\uD83D\uDDD1\uFE0F" })] })] }), isExpanded && (_jsxs(_Fragment, { children: [folderNotes.length > 0 && (_jsx("ul", { className: "note-list", children: folderNotes.map(note => (_jsx(NoteItem, { note: note }, note.id))) })), renderFolderTree(folder.id, level + 1)] }))] }));
    };
    // 笔记拖拽组件
    const NoteItem = ({ note }) => {
        const ref = useRef(null);
        // 设置笔记可拖拽
        const [{ isDragging }, drag] = useDrag(() => ({
            type: 'NOTE',
            item: { type: 'NOTE', id: note.id, folderId: note.folderId },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }));
        drag(ref);
        return (_jsxs("li", { ref: ref, className: `note-item ${activeNoteId === note.id ? 'active' : ''} ${isDragging ? 'dragging' : ''}`, onClick: () => handleNoteClick(note), children: [_jsx("span", { className: "note-icon", children: "\uD83D\uDCC4" }), _jsx("span", { className: "note-title", children: note.title }), _jsx("button", { className: "note-action-btn delete", onClick: (e) => handleDeleteNote(note.id, e), title: "\u5220\u9664", children: "\uD83D\uDDD1\uFE0F" })] }));
    };
    // 渲染搜索结果
    const renderSearchResults = () => {
        if (!searchTerm)
            return null;
        if (searchResults.length === 0) {
            return _jsx("div", { className: "search-no-results", children: "\u65E0\u641C\u7D22\u7ED3\u679C" });
        }
        return (_jsxs("div", { className: "search-results", children: [_jsx("h3", { children: "\u641C\u7D22\u7ED3\u679C" }), _jsx("ul", { className: "note-list", children: searchResults.map(note => (_jsxs("li", { className: `note-item ${activeNoteId === note.id ? 'active' : ''}`, onClick: () => handleNoteClick(note), children: [_jsx("span", { className: "note-icon", children: "\uD83D\uDCC4" }), _jsx("span", { className: "note-title", children: note.title }), _jsx("span", { className: "note-folder", children: folders.find(f => f.id === note.folderId)?.name })] }, note.id))) })] }));
    };
    const renderFolderTree = (parentId = null, level = 0) => {
        // 最多支持4层递归
        if (level >= 4)
            return null;
        const childFolders = folders.filter(folder => folder.parentId === parentId);
        if (childFolders.length === 0)
            return null;
        return (_jsx("ul", { className: "folder-list", children: childFolders.map(folder => (_jsx(FolderItem, { folder: folder, level: level }, folder.id))) }));
    };
    // 根文件夹拖拽区域
    const RootDropArea = () => {
        const [{ isOver }, drop] = useDrop(() => ({
            accept: ['FOLDER'],
            drop: (item) => {
                // 移动文件夹到根目录
                onMoveFolder(item.id, null);
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
            }),
        }));
        return (_jsx("div", { ref: drop, className: `root-drop-area ${isOver ? 'drop-target' : ''}`, children: _jsx("span", { children: "\u62D6\u62FD\u81F3\u6B64\u79FB\u52A8\u5230\u6839\u76EE\u5F55" }) }));
    };
    if (collapsed) {
        return (_jsx("div", { className: "sidebar collapsed", children: _jsx("button", { className: "toggle-sidebar", onClick: onToggleCollapse, children: "\u226B" }) }));
    }
    return (_jsxs("div", { className: "sidebar", children: [_jsxs("div", { className: "sidebar-header", children: [_jsx("div", { className: "search-box", children: _jsx("input", { type: "text", placeholder: "\u641C\u7D22...", value: searchTerm, onChange: handleSearchChange }) }), _jsxs("div", { className: "header-actions", children: [_jsx("button", { className: "header-action-btn", onClick: onOpenSettings, title: "\u8BBE\u7F6E", children: "\u2699\uFE0F" }), _jsx("button", { className: "header-action-btn", onClick: onLogout, title: "\u9000\u51FA\u767B\u5F55", children: "\uD83D\uDEAA" }), _jsx("button", { className: "toggle-sidebar", onClick: onToggleCollapse, children: "\u226A" })] })] }), _jsxs("div", { className: "sidebar-content", children: [searchTerm ? renderSearchResults() : renderFolderTree(), !searchTerm && _jsx(RootDropArea, {})] }), _jsxs("div", { className: "sidebar-footer", children: [_jsx("button", { className: "new-folder-btn", onClick: () => handleCreateFolder(null), children: "\u65B0\u5EFA\u6587\u4EF6\u5939" }), folders.length > 0 && (_jsx("button", { className: "new-note-btn", onClick: () => handleCreateNote(folders[0].id), children: "\u65B0\u5EFA\u7B14\u8BB0" }))] })] }));
};
export default Sidebar;
