import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import './LoginPage.css';
const LoginPage = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // 连接到实际的API验证密码
            const success = await onLogin(password);
            if (!success) {
                setError('密码不正确');
            }
            // 如果成功，onLogin会处理重定向
        }
        catch (err) {
            setError('登录失败，请重试');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "login-container", children: _jsxs("div", { className: "login-box", children: [_jsxs("div", { className: "login-logo", children: [_jsx("div", { className: "logo-circle" }), _jsx("h1", { children: "notea" })] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsxs("label", { htmlFor: "password", children: ["\u5BC6\u7801 ", _jsx("span", { className: "required", children: "*" })] }), _jsx("input", { type: "password", id: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, autoFocus: true })] }), error && _jsx("div", { className: "error-message", children: error }), _jsx("button", { type: "submit", className: "login-button", disabled: loading, children: loading ? '登录中...' : '登录' })] })] }) }));
};
export default LoginPage;
