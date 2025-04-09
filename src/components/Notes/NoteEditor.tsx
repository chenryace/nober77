import { useEffect, useState, useRef } from 'react';
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
  
  // Define handleContentChange before using it
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setUnsavedChanges(true);
  };
  
  // Correct usage of useMarkdownEditor
  const editor = useMarkdownEditor({
    value: content,
    onChange: handleContentChange,
    autoFocus: true,
    mode: 'edit',
    placeholder: '开始编写笔记...',
    locale: 'zh',
    theme: 'dark'
  });

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    
    // Update editor content when note changes
    if (editor) {
      editor.setValue?.(note.content) || editor.update?.(note.content);
    }
    
    setUnsavedChanges(false);
  }, [note, editor]);

  // Mount editor to container
  useEffect(() => {
    if (editorContainerRef.current && editor) {
      editorContainerRef.current.innerHTML = '';
      editorContainerRef.current.appendChild(editor.getElement());
    }
    
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
