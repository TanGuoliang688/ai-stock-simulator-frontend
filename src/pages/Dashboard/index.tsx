import React from 'react';
import { Card, Button } from 'antd';
import { useUserStore } from '@/stores/userStore';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const logout = useUserStore((state) => state.logout);
    const navigate = useNavigate();

    return (
        <div style={{ padding: 24 }}>
            <Card title="欢迎使用 AI模拟炒股大师">
                <p>这是一个智能模拟炒股平台</p>
                <Button type="primary" onClick={() => navigate('/market')}>
                    查看行情
                </Button>
                <Button danger style={{ marginLeft: 12 }} onClick={logout}>
                    退出登录
                </Button>
            </Card>
        </div>
    );
};

export default Dashboard;
