import { useEffect, useState } from 'react';
import { Editor } from '@gravity-ui/markdown-editor';
import '@gravity-ui/markdown-editor/styles/bundle.css';
import './NoteEditor.css';

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
}

interface NoteEditorProps {
  note: Note;
  onChange: (content: string) => void;
  onTitleChange?: (title: string) => void;
  onSave?: () => void;
}

const NoteEditor = ({ note, onChange, onTitleChange, onSave }: NoteEditorProps) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setUnsavedChanges(false);
  }, [note]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setUnsavedChanges(true);
    // 不再自动保存标题，只在用户点击保存按钮时保存
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setUnsavedChanges(true);
  };
  
  const handleSave = () => {
    // 保存标题和内容
    if (onTitleChange && title !== note.title) {
      onTitleChange(title);
    }
    onChange(content);
    setUnsavedChanges(false);
    if (onSave) {
      onSave();
    }
  };

  return (
    <div className="note-editor">
      <div className="note-header">
        <input
          type="text"
          className="note-title-input"
          value={title}
          onChange={handleTitleChange}
          placeholder="无标题"
        />
        <button 
          className="save-button" 
          onClick={handleSave}
          disabled={!unsavedChanges}
        >
          {unsavedChanges ? '保存' : '已保存'}
        </button>
      </div>
      <div className="editor-container">
        <Editor
          value={content}
          onChange={handleContentChange}
          autoFocus
          autofocus
          defaultMode="edit"
          placeholder="开始编写笔记..."
          locale="zh"
          theme="dark"
        />
      </div>
    </div>
  );
};

export default NoteEditor;