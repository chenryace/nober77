import { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useAppContext } from '../../contexts/AppContext';
import './Sidebar.css';

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
}

interface SidebarProps {
  folders: Folder[];
  notes: Note[];
  onNoteSelect: (note: Note) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onCreateFolder: (parentId: string | null) => void;
  onCreateNote: (folderId: string) => void;
  onRenameFolder: (id: string, name: string) => void;
  onMoveFolder: (id: string, newParentId: string | null) => void;
  onDeleteFolder: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onMoveNote: (id: string, newFolderId: string) => void;
  onLogout: () => void;
  onOpenSettings: () => void;
}

interface DragItem {
  type: 'FOLDER' | 'NOTE';
  id: string;
  folderId?: string;
}

const Sidebar = ({ 
  folders, 
  notes, 
  onNoteSelect, 
  collapsed, 
  onToggleCollapse,
  onCreateFolder,
  onCreateNote,
  onRenameFolder,
  onMoveFolder,
  onDeleteFolder,
  onDeleteNote,
  onMoveNote,
  onLogout,
  onOpenSettings
}: SidebarProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    '1': true, // 默认展开根文件夹
  });
  const { searchNotes, searchResults } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');

  const toggleFolder = (folderId: string, _e: React.MouseEvent) => {
    _e.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleNoteClick = (note: Note) => {
    setActiveNoteId(note.id);
    onNoteSelect(note);
  };
  
  // 处理搜索输入变化
  const handleSearchChange = (_e: React.ChangeEvent<HTMLInputElement>) => {
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
  
  const handleCreateFolder = (parentId: string | null) => {
    onCreateFolder(parentId);
  };
  
  const handleCreateNote = (folderId: string) => {
    onCreateNote(folderId);
  };
  
  const startEditingFolder = (folder: Folder, e: React.MouseEvent) => {
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
  
  const handleDeleteFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除此文件夹及其所有内容吗？')) {
      onDeleteFolder(folderId);
    }
  };
  
  const handleDeleteNote = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除此笔记吗？')) {
      onDeleteNote(noteId);
    }
  };

  // 文件夹拖拽组件
  const FolderItem = ({ folder, level }: { folder: Folder, level: number }) => {
    const folderNotes = notes.filter(note => note.folderId === folder.id);
    const isExpanded = expandedFolders[folder.id];
    const isEditing = editingFolderId === folder.id;
    const ref = useRef<HTMLLIElement>(null);
    
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
      drop: (item: DragItem, monitor) => {
        if (monitor.didDrop()) return; // 防止嵌套元素重复处理
        
        if (item.type === 'FOLDER' && item.id !== folder.id) {
          // 移动文件夹到此文件夹下
          onMoveFolder(item.id, folder.id);
        } else if (item.type === 'NOTE') {
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
    
    return (
      <li 
        ref={ref} 
        className={`folder-item ${isDragging ? 'dragging' : ''} ${isOver ? 'drop-target' : ''}`}
      >
        <div 
          className="folder-header"
          onClick={(e) => toggleFolder(folder.id, e)}
        >
          <span className={`folder-icon ${isExpanded ? 'expanded' : ''}`} onClick={(e) => toggleFolder(folder.id, e)}>▶</span>
          
          {isEditing ? (
            <input
              type="text"
              className="folder-name-input"
              value={editingFolderName}
              onChange={(e) => setEditingFolderName(e.target.value)}
              onBlur={saveEditingFolder}
              onKeyDown={(e) => e.key === 'Enter' && saveEditingFolder()}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="folder-name">{folder.name}</span>
          )}
          
          <div className="folder-actions">
            <button 
              className="folder-action-btn" 
              onClick={(e) => startEditingFolder(folder, e)}
              title="重命名"
            >
              ✏️
            </button>
            <button 
              className="folder-action-btn" 
              onClick={(e) => handleCreateFolder(folder.id)}
              title="新建子文件夹"
            >
              📁+
            </button>
            <button 
              className="folder-action-btn" 
              onClick={(e) => handleCreateNote(folder.id)}
              title="新建笔记"
            >
              📝+
            </button>
            <button 
              className="folder-action-btn delete" 
              onClick={(e) => handleDeleteFolder(folder.id, e)}
              title="删除"
            >
              🗑️
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <>
            {folderNotes.length > 0 && (
              <ul className="note-list">
                {folderNotes.map(note => (
                  <NoteItem key={note.id} note={note} />
                ))}
              </ul>
            )}
            {renderFolderTree(folder.id, level + 1)}
          </>
        )}
      </li>
    );
  };
  
  // 笔记拖拽组件
  const NoteItem = ({ note }: { note: Note }) => {
    const ref = useRef<HTMLLIElement>(null);
    
    // 设置笔记可拖拽
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'NOTE',
      item: { type: 'NOTE', id: note.id, folderId: note.folderId },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));
    
    drag(ref);
    
    return (
      <li 
        ref={ref}
        className={`note-item ${activeNoteId === note.id ? 'active' : ''} ${isDragging ? 'dragging' : ''}`}
        onClick={() => handleNoteClick(note)}
      >
        <span className="note-icon">📄</span>
        <span className="note-title">{note.title}</span>
        <button 
          className="note-action-btn delete" 
          onClick={(e) => handleDeleteNote(note.id, e)}
          title="删除"
        >
          🗑️
        </button>
      </li>
    );
  };
  
  // 渲染搜索结果
  const renderSearchResults = () => {
    if (!searchTerm) return null;
    
    if (searchResults.length === 0) {
      return <div className="search-no-results">无搜索结果</div>;
    }
    
    return (
      <div className="search-results">
        <h3>搜索结果</h3>
        <ul className="note-list">
          {searchResults.map(note => (
            <li 
              key={note.id}
              className={`note-item ${activeNoteId === note.id ? 'active' : ''}`}
              onClick={() => handleNoteClick(note)}
            >
              <span className="note-icon">📄</span>
              <span className="note-title">{note.title}</span>
              <span className="note-folder">{folders.find(f => f.id === note.folderId)?.name}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  const renderFolderTree = (parentId: string | null = null, level = 0) => {
    // 最多支持4层递归
    if (level >= 4) return null;

    const childFolders = folders.filter(folder => folder.parentId === parentId);
    
    if (childFolders.length === 0) return null;

    return (
      <ul className="folder-list">
        {childFolders.map(folder => (
          <FolderItem key={folder.id} folder={folder} level={level} />
        ))}
      </ul>
    );
  };

  // 根文件夹拖拽区域
  const RootDropArea = () => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: ['FOLDER'],
      drop: (item: DragItem) => {
        // 移动文件夹到根目录
        onMoveFolder(item.id, null);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }));
    
    return (
      <div 
        ref={drop} 
        className={`root-drop-area ${isOver ? 'drop-target' : ''}`}
      >
        <span>拖拽至此移动到根目录</span>
      </div>
    );
  };
  
  if (collapsed) {
    return (
      <div className="sidebar collapsed">
        <button className="toggle-sidebar" onClick={onToggleCollapse}>
          ≫
        </button>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="header-actions">
          <button className="header-action-btn" onClick={onOpenSettings} title="设置">
            ⚙️
          </button>
          <button className="header-action-btn" onClick={onLogout} title="退出登录">
            🚪
          </button>
          <button className="toggle-sidebar" onClick={onToggleCollapse}>
            ≪
          </button>
        </div>
      </div>
      <div className="sidebar-content">
        {searchTerm ? renderSearchResults() : renderFolderTree()}
        {!searchTerm && <RootDropArea />}
      </div>
      <div className="sidebar-footer">
        <button className="new-folder-btn" onClick={() => handleCreateFolder(null)}>新建文件夹</button>
        {folders.length > 0 && (
          <button 
            className="new-note-btn" 
            onClick={() => handleCreateNote(folders[0].id)}
          >
            新建笔记
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;