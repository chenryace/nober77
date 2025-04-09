import { useEffect, useState, useRef } from 'react';
// 修改导入方式，使用 useMarkdownEditor
import { useMarkdownEditor } from '@gravity-ui/markdown-editor';
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
  const editorRef = useRef<HTMLDivElement>(null);
  
  // 定义内容变更处理函数
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setUnsavedChanges(true);
  };
  
  // 使用 useMarkdownEditor hook
  const editor = useMarkdownEditor({
    initialValue: content,
    onChange: handleContentChange,
    autoFocus: true,
    defaultMode: 'edit',
    placeholder: '开始编写笔记...',
    locale: 'zh',
    theme: 'dark'
  });

  // 当笔记变更时更新编辑器内容
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    if (editor) {
      editor.update(note.content);
    }
    setUnsavedChanges(false);
  }, [note, editor]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setUnsavedChanges(true);
  };
  
  const handleSave = () => {
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
      <div className="editor-container" ref={editorRef}>
        {editor && editor.render()}
      </div>
    </div>
  );
};

export default NoteEditor;