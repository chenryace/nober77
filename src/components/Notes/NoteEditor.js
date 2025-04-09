import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import './NoteEditor.css';
const NoteEditor = ({ note, onChange, onTitleChange, onSave }) => {
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                HTMLAttributes: {
                    class: 'embedded-image',
                },
            }),
        ],
        content: note.content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setContent(html);
            setUnsavedChanges(true);
            onChange(html);
        },
    });
    // 当笔记变更时更新编辑器内容
    useEffect(() => {
        setTitle(note.title);
        setContent(note.content);
        setUnsavedChanges(false);
        if (editor && !editor.isDestroyed) {
            editor.commands.setContent(note.content);
        }
    }, [note, editor]);
    const handleTitleChange = (e) => {
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
    return (_jsxs("div", { className: "note-editor", children: [_jsxs("div", { className: "note-header", children: [_jsx("input", { type: "text", className: "note-title-input", value: title, onChange: handleTitleChange, placeholder: "\u65E0\u6807\u9898" }), _jsx("button", { className: "save-button", onClick: handleSave, disabled: !unsavedChanges, children: unsavedChanges ? '保存' : '已保存' })] }), _jsx("div", { className: "editor-container", children: _jsx(EditorContent, { editor: editor }) })] }));
};
export default NoteEditor;
