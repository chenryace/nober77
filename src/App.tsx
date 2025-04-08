import { useState, useEffect } from 'react'
import LoginPage from './components/Auth/LoginPage'
import MainLayout from './components/Layout/MainLayout'
import { AppProvider } from './contexts/AppContext'
import { initDatabase } from './lib/init-db'
import * as authApi from './api/auth'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // 初始化数据库
  useEffect(() => {
    const initialize = async () => {
      try {
        await initDatabase();
      } catch (error) {
        console.error('初始化数据库失败:', error);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    // 检查本地存储中是否有登录状态
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (password: string) => {
    try {
      const success = await authApi.verifyPassword(password);
      if (success) {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('登录失败:', error);
      return false;
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    try {
      return await authApi.changePassword(currentPassword, newPassword);
    } catch (error) {
      console.error('修改密码失败:', error);
      return false;
    }
  };

  if (isLoading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="app">
      {isLoggedIn ? (
        <AppProvider>
          <MainLayout 
            onLogout={handleLogout} 
            onChangePassword={handleChangePassword}
            showSettings={showSettings}
            onToggleSettings={() => setShowSettings(!showSettings)}
          />
        </AppProvider>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App
