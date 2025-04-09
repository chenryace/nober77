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
  
  // 定义内容变更处理函数
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setUnsavedChanges(true);
    onChange(newContent);
  };
  
  // 使用 useMarkdownEditor hook，根据实际API调整参数
  const editor = useMarkdownEditor({
    // 移除不支持的属性
    autoFocus: true,
    mode: 'edit',
    placeholder: '开始编写笔记...',
    locale: 'zh',
    theme: 'dark'
  });

  // 设置编辑器内容和监听变化
  useEffect(() => {
    if (editor) {
      // 设置初始内容
      try {
        // 使用编辑器实例的方法设置内容
        const editorInstance = editor.getState().instance;
        if (editorInstance && typeof editorInstance.setContent === 'function') {
          editorInstance.setContent(content);
        }
        
        // 添加内容变更监听
        const unsubscribe = editor.subscribe('change', (newContent: string) => {
          handleContentChange(newContent);
        });
        
        return () => {
          if (unsubscribe) unsubscribe();
        };
      } catch (error) {
        console.error('编辑器设置内容失败:', error);
      }
    }
  }, [editor]);

  // 当笔记变更时更新编辑器内容
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    
    // 如果编辑器存在，更新内容
    if (editor) {
      try {
        const editorInstance = editor.getState().instance;
        if (editorInstance && typeof editorInstance.setContent === 'function') {
          editorInstance.setContent(note.content);
        }
      } catch (error) {
        console.error('编辑器更新内容失败:', error);
      }
    }
    
    setUnsavedChanges(false);
  }, [note, editor]);

  // 挂载编辑器到DOM
  useEffect(() => {
    if (editorContainerRef.current && editor) {
      // 清空容器
      editorContainerRef.current.innerHTML = '';
      
      // 获取编辑器元素并添加到容器
      try {
        const editorElement = editor.getElement();
        if (editorElement) {
          editorContainerRef.current.appendChild(editorElement);
        }
      } catch (error) {
        console.error('挂载编辑器失败:', error);
      }
    }
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
