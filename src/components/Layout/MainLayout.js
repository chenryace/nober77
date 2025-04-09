import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Sidebar from './Sidebar';
import NoteEditor from '../Notes/NoteEditor';
import SettingsModal from '../Settings/SettingsModal';
import { useAppContext } from '../../contexts/AppContext';
import './MainLayout.css';
const MainLayout = ({ onLogout, onChangePassword, showSettings, onToggleSettings }) => {
    const { folders, notes, activeNote, setActiveNote, createFolder, updateFolder, moveFolder, deleteFolder, createNote, updateNote, deleteNote } = useAppContext();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const handleNoteSelect = (note) => {
        setActiveNote(note);
    };
    const handleNoteChange = (content) => {
        if (activeNote) {
            updateNote(activeNote.id, { content });
        }
    };
    const handleNoteSave = () => {
        // 添加保存成功的提示
        const saveMessage = document.createElement('div');
        saveMessage.className = 'save-notification';
        saveMessage.textContent = '笔记已保存';
        document.body.appendChild(saveMessage);
        // 2秒后移除提示
        setTimeout(() => {
            document.body.removeChild(saveMessage);
        }, 2000);
    };
    const handleNoteCreate = (folderId) => {
        createNote('新建笔记', '', folderId);
    };
    const handleFolderCreate = (parentId) => {
        createFolder('新建文件夹', parentId);
    };
    const handleFolderRename = (id, name) => {
        updateFolder(id, name);
    };
    const handleFolderMove = (id, newParentId) => {
        moveFolder(id, newParentId);
    };
    const handleFolderDelete = (id) => {
        deleteFolder(id);
    };
    const handleNoteDelete = (id) => {
        deleteNote(id);
    };
    const handleNoteMove = (id, newFolderId) => {
        updateNote(id, { folderId: newFolderId });
    };
    const handleNoteTitleChange = (id, title) => {
        updateNote(id, { title });
    };
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };
    return (_jsxs(DndProvider, { backend: HTML5Backend, children: [_jsxs("div", { className: "main-layout", children: [_jsx(Sidebar, { folders: folders, notes: notes, onNoteSelect: handleNoteSelect, collapsed: sidebarCollapsed, onToggleCollapse: toggleSidebar, onCreateFolder: handleFolderCreate, onCreateNote: handleNoteCreate, onRenameFolder: handleFolderRename, onMoveFolder: handleFolderMove, onDeleteFolder: handleFolderDelete, onDeleteNote: handleNoteDelete, onMoveNote: handleNoteMove, onLogout: onLogout, onOpenSettings: onToggleSettings }), _jsx("div", { className: `content-area ${sidebarCollapsed ? 'expanded' : ''}`, children: activeNote ? (_jsx(NoteEditor, { note: activeNote, onChange: handleNoteChange, onTitleChange: (title) => handleNoteTitleChange(activeNote.id, title), onSave: handleNoteSave })) : (_jsx("div", { className: "empty-state", children: _jsx("h2", { children: "\u9009\u62E9\u6216\u521B\u5EFA\u4E00\u4E2A\u7B14\u8BB0\u5F00\u59CB\u7F16\u8F91" }) })) })] }), showSettings && (_jsx(SettingsModal, { onClose: onToggleSettings, onChangePassword: onChangePassword }))] }));
};
export default MainLayout;
