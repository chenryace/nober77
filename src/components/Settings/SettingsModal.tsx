import { useState } from 'react';
import './SettingsModal.css';

interface SettingsModalProps {
  onClose: () => void;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const SettingsModal = ({ onClose, onChangePassword }: SettingsModalProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
      } else {
        setError('当前密码不正确');
      }
    } catch (err) {
      setError('修改密码失败，请重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <div className="settings-modal-header">
          <h2>设置</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="settings-modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="current-password">当前密码</label>
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="new-password">新密码</label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">确认新密码</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={onClose}>取消</button>
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? '保存中...' : '保存'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;