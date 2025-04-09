import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import './SettingsModal.css';
const SettingsModal = ({ onClose, onChangePassword }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        // 验证新密码
        if (newPassword !== confirmPassword) {
            setError('新密码与确认密码不匹配');
            return;
        }
        if (newPassword.length < 4) {
            setError('新密码长度不能少于4个字符');
            return;
        }
        setLoading(true);
        try {
            const success = await onChangePassword(currentPassword, newPassword);
            if (success) {
                setSuccess('密码修改成功');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
            else {
                setError('当前密码不正确');
            }
        }
        catch (err) {
            setError('修改密码失败，请重试');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "settings-modal-overlay", children: _jsxs("div", { className: "settings-modal", children: [_jsxs("div", { className: "settings-modal-header", children: [_jsx("h2", { children: "\u8BBE\u7F6E" }), _jsx("button", { className: "close-button", onClick: onClose, children: "\u00D7" })] }), _jsx("div", { className: "settings-modal-content", children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "current-password", children: "\u5F53\u524D\u5BC6\u7801" }), _jsx("input", { type: "password", id: "current-password", value: currentPassword, onChange: (e) => setCurrentPassword(e.target.value), required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "new-password", children: "\u65B0\u5BC6\u7801" }), _jsx("input", { type: "password", id: "new-password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "confirm-password", children: "\u786E\u8BA4\u65B0\u5BC6\u7801" }), _jsx("input", { type: "password", id: "confirm-password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true })] }), error && _jsx("div", { className: "error-message", children: error }), success && _jsx("div", { className: "success-message", children: success }), _jsxs("div", { className: "form-actions", children: [_jsx("button", { type: "button", className: "cancel-button", onClick: onClose, children: "\u53D6\u6D88" }), _jsx("button", { type: "submit", className: "save-button", disabled: loading, children: loading ? '保存中...' : '保存' })] })] }) })] }) }));
};
export default SettingsModal;
