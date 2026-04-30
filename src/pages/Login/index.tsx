import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService, LoginRequest } from '@/services/auth';
import { useUserStore } from '@/stores/userStore';

interface LoginResponse {
    code: number;
    data: {
        accessToken: string;
    };
    message?: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const setToken = useUserStore((state) => state.setToken);
    const [loading, setLoading] = React.useState(false);

    const onFinish = async (values: LoginRequest) => {
        setLoading(true);
        try {
            const res = await authService.login(values) as unknown as LoginResponse;

            if (res.code === 200) {
                setToken(res.data.accessToken);
                message.success('登录成功');
                navigate('/dashboard');
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err.response?.data?.message || '登录失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <Card
                title="AI模拟炒股大师"
                style={{ width: 400 }}
                styles={{ header: { textAlign: 'center' } }}
            >
                <Form onFinish={onFinish}>
                    <Form.Item name="usernameOrEmail" rules={[{ required: true, message: '请输入用户名或邮箱' }]}>
                        <Input prefix={<UserOutlined />} placeholder="用户名/邮箱" size="large" />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block size="large">
                            登录
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center' }}>
                    还没有账号？<a onClick={() => navigate('/register')}>立即注册</a>
                </div>
            </Card>
        </div>
    );
};

export default Login;
