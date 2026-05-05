import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme, Layout, Switch } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Trade from './pages/Trade';
import Portfolio from './pages/Portfolio';
import Assets from './pages/Assets';
import TradeRecords from './pages/TradeRecords';
import StockDetail from './pages/StockDetail';
import { useUserStore } from './stores/userStore';

const { Header, Content } = Layout;

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = useUserStore((state) => state.token);
    return token ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
    // 1. 状态管理：从 localStorage 读取主题偏好
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    // 2. 持久化：当 isDark 变化时，保存到本地存储
    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    return (
        <ConfigProvider
            theme={{
                algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}
        >
            <BrowserRouter>
                <Layout style={{ minHeight: '100vh' }}>
                    {/* 3. 顶部导航栏：包含标题和主题切换开关 */}
                    <Header style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: isDark ? '#001529' : '#fff',
                        padding: '0 24px',
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <div style={{ fontSize: 18, fontWeight: 'bold', color: isDark ? '#fff' : '#000' }}>
                            🚀 AI 模拟炒股大师
                        </div>
                        <Switch
                            checkedChildren={<MoonOutlined />}
                            unCheckedChildren={<SunOutlined />}
                            checked={isDark}
                            onChange={setIsDark}
                        />
                    </Header>

                    <Content>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            <Route path="/dashboard" element={
                                <ProtectedRoute><Dashboard /></ProtectedRoute>
                            } />

                            <Route path="/market" element={
                                <ProtectedRoute><Market /></ProtectedRoute>
                            } />

                            <Route path="/trade" element={
                                <ProtectedRoute><Trade /></ProtectedRoute>
                            } />

                            <Route path="/portfolio" element={
                                <ProtectedRoute><Portfolio /></ProtectedRoute>
                            } />

                            <Route path="/assets" element={
                                <ProtectedRoute><Assets /></ProtectedRoute>
                            } />

                            <Route path="/trade-records" element={
                                <ProtectedRoute><TradeRecords /></ProtectedRoute>
                            } />

                            <Route path="/" element={<Navigate to="/dashboard" />} />

                            <Route path="/stock/:symbol" element={
                                <ProtectedRoute><StockDetail /></ProtectedRoute>
                            } />
                        </Routes>
                    </Content>
                </Layout>
            </BrowserRouter>
        </ConfigProvider>
    );
}

export default App;
