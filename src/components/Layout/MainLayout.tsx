import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Sidebar from './Sidebar';
import NoteEditor from '../Notes/NoteEditor';
import SettingsModal from '../Settings/SettingsModal';
import { useAppContext } from '../../contexts/AppContext';
import './MainLayout.css';

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
}

interface MainLayoutProps {
  onLogout: () => void;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  showSettings: boolean;
  onToggleSettings: () => void;
}

const MainLayout = ({ onLogout, onChangePassword, showSettings, onToggleSettings }: MainLayoutProps) => {
  const { 
    folders, 
    notes, 
    activeNote, 
    setActiveNote, 
    createFolder, 
    updateFolder,
    moveFolder,
    deleteFolder,
    createNote,
    updateNote,
    deleteNote
  } = useAppContext();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleNoteSelect = (note: Note) => {
    setActiveNote(note);
  };

  const handleNoteChange = (content: string) => {
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
  
  const handleNoteCreate = (folderId: string) => {
    createNote('新建笔记', '', folderId);
  };
  
  const handleFolderCreate = (parentId: string | null) => {
    createFolder('新建文件夹', parentId);
  };
  
  const handleFolderRename = (id: string, name: string) => {
    updateFolder(id, name);
  };
  
  const handleFolderMove = (id: string, newParentId: string | null) => {
    moveFolder(id, newParentId);
  };
  
  const handleFolderDelete = (id: string) => {
    deleteFolder(id);
  };
  
  const handleNoteDelete = (id: string) => {
    deleteNote(id);
  };
  
  const handleNoteMove = (id: string, newFolderId: string) => {
    updateNote(id, { folderId: newFolderId });
  };
  
  const handleNoteTitleChange = (id: string, title: string) => {
    updateNote(id, { title });
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="main-layout">
        <Sidebar
          folders={folders}
          notes={notes}
          onNoteSelect={handleNoteSelect}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          onCreateFolder={handleFolderCreate}
          onCreateNote={handleNoteCreate}
          onRenameFolder={handleFolderRename}
          onMoveFolder={handleFolderMove}
          onDeleteFolder={handleFolderDelete}
          onDeleteNote={handleNoteDelete}
          onMoveNote={handleNoteMove}
          onLogout={onLogout}
          onOpenSettings={onToggleSettings}
        />
        <div className={`content-area ${sidebarCollapsed ? 'expanded' : ''}`}>
          {activeNote ? (
            <NoteEditor
              note={activeNote}
              onChange={handleNoteChange}
              onTitleChange={(title) => handleNoteTitleChange(activeNote.id, title)}
              onSave={handleNoteSave}
            />
          ) : (
            <div className="empty-state">
              <h2>选择或创建一个笔记开始编辑</h2>
            </div>
          )}
        </div>
      </div>
      
      {showSettings && (
        <SettingsModal 
          onClose={onToggleSettings}
          onChangePassword={onChangePassword}
        />
      )}
    </DndProvider>
  );
};

export default MainLayout;