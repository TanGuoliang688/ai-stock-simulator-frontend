import React from 'react';
import { Card, Button, Space } from 'antd';
import { useUserStore } from '@/stores/userStore';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const logout = useUserStore((state) => state.logout);
    const navigate = useNavigate();

    return (
        <div style={{ padding: 24 }}>
            <Card title="欢迎使用 AI模拟炒股大师">
                <p>这是一个智能模拟炒股平台</p>
                <Space wrap>
                    <Button type="primary" onClick={() => navigate('/market')}>
                        查看行情
                    </Button>
                    <Button onClick={() => navigate('/trade')}>
                        模拟交易
                    </Button>
                    <Button onClick={() => navigate('/trade-records')}>
                        交易记录
                    </Button>
                    <Button onClick={() => navigate('/portfolio')}>
                        我的持仓
                    </Button>
                    <Button onClick={() => navigate('/assets')}>
                        资产概览
                    </Button>
                    <Button danger onClick={logout}>
                        退出登录
                    </Button>
                </Space>
            </Card>
        </div>
    );
};

export default Dashboard;
