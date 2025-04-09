import { useEffect, useState, useRef } from 'react';
// 使用正确的导入方式
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
  const editorContainerRef = useRef<HTMLDivElement>(null);
  
  // 定义内容变更处理函数
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setUnsavedChanges(true);
    onChange(newContent);
  };
  
  // 使用 useMarkdownEditor hook
  const editor = useMarkdownEditor({
    onChange: handleContentChange,
    autoFocus: true,
    mode: 'edit',
    placeholder: '开始编写笔记...',
    locale: 'zh',
    theme: 'dark'
  });

  // 当笔记变更时更新编辑器内容
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    
    // 如果编辑器存在，更新内容
    if (editor && editor.getValue() !== note.content) {
      editor.setValue(note.content);
    }
    
    setUnsavedChanges(false);
  }, [note, editor]);

  // 挂载编辑器到DOM
  useEffect(() => {
    if (editorContainerRef.current && editor) {
      // 清空容器
      editorContainerRef.current.innerHTML = '';
      // 将编辑器元素添加到容器中
      editorContainerRef.current.appendChild(editor.container);
    }
    
    // 清理函数
    return () => {
      if (editor && editor.destroy) {
        editor.destroy();
      }
    };
  }, [editor]);

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
      <div className="editor-container" ref={editorContainerRef}></div>
    </div>
  );
};

export default NoteEditor;
