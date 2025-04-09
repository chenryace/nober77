import { useEffect, useState, useRef } from 'react';
// 参考 Diplodoc 的导入方式
import { createMarkdownEditor } from '@gravity-ui/markdown-editor';
import '@gravity-ui/markdown-editor/styles/bundle.css';
import './NoteEditor.css';

// 创建编辑器实例
const MarkdownEditor = createMarkdownEditor({
  extensions: [], // 可以添加自定义扩展
});

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
  
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setUnsavedChanges(true);
  };

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setUnsavedChanges(false);
  }, [note]);

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
        <MarkdownEditor.Editor
          value={content}
          onChange={handleContentChange}
          autoFocus
          viewMode="edit"
          placeholder="开始编写笔记..."
          locale="zh"
          theme="dark"
          height="100%"
          spellCheck={false}
          toolbarItems={[
            'heading',
            'font-style',
            'list',
            'link',
            'table',
            'code',
            'quote',
            'image',
            'divider'
          ]}
        />
      </div>
    </div>
  );
};

export default NoteEditor;