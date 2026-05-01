import React, { useState } from 'react';
import { Input, List, Card, message, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { stockService } from '@/services/stock';
import { useUserStore } from '@/stores/userStore';

export interface StockItem {
    name: string;
    symbol: string;
    market: string;
    industry: string;
}

interface SearchResponse {
    code: number;
    data: StockItem[];
    message?: string;
}

const Market: React.FC = () => {
    const navigate = useNavigate();
    const logout = useUserStore((state) => state.logout);
    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (keyword: string) => {
        if (!keyword) {
            setStocks([]);
            return;
        }

        setLoading(true);
        try {
            const res = await stockService.search(keyword) as unknown as SearchResponse;
            if (res.code === 200) {
                setStocks(res.data);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err.response?.data?.message || '搜索失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Card title="股票行情">
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <Input.Search
                        placeholder="输入股票代码或名称"
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        onSearch={handleSearch}
                        loading={loading}
                        style={{ width: 400 }}
                    />
                    <div>
                        <Button onClick={() => navigate('/dashboard')} style={{ marginRight: 8 }}>
                            返回首页
                        </Button>
                        <Button danger onClick={logout}>
                            退出登录
                        </Button>
                    </div>
                </div>

                <List
                    dataSource={stocks}
                    renderItem={(item: StockItem) => (
                        <List.Item>
                            <List.Item.Meta
                                title={`${item.name} (${item.symbol})`}
                                description={`市场: ${item.market} | 行业: ${item.industry}`}
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};

export default Market;
