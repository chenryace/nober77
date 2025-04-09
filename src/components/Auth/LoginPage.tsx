import { useState } from 'react';
import './LoginPage.css';

interface LoginPageProps {
  onLogin: (password: string) => Promise<boolean>;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ password })
      })
      // 处理响应
    } catch (error) {
      // 错误处理
    }
  }
  setLoading(true);
  setError('');

    try {
      // 连接到实际的API验证密码
      const success = await onLogin(password);
      if (!success) {
        setError('密码不正确');
      }
      // 如果成功，onLogin会处理重定向
    } catch (err) {
      setError('登录失败，请重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <div className="logo-circle"></div>
          <h1>notea</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">
              密码 <span className="required">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;