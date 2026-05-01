import React, { useState, useEffect } from 'react';
import { Input, List, Card, message, Button, Tag } from 'antd';
import { SearchOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { stockService } from '@/services/stock';
import { useUserStore } from '@/stores/userStore';

export interface StockItem {
    name: string;
    symbol: string;
    market: string;
    industry: string;
}

interface PriceData {
    price?: number;
    changePercent?: number;
}

interface SearchResponse {
    code: number;
    data: StockItem[];
    message?: string;
}

interface PricesResponse {
    code: number;
    data: Record<string, PriceData>;
    message?: string;
}

const Market: React.FC = () => {
    const navigate = useNavigate();
    const logout = useUserStore((state) => state.logout);
    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [prices, setPrices] = useState<Record<string, PriceData>>({});

    // 每3秒刷新一次价格
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await stockService.getAllPrices() as unknown as PricesResponse;
                if (res.code === 200) {
                    setPrices(res.data);
                }
            } catch (error: unknown) {
                console.error('获取价格失败', error);
            }
        };

        void fetchPrices();
        const interval = setInterval(() => {
            void fetchPrices();
        }, 3000);

        return () => clearInterval(interval);
    }, []);

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
                        <Button onClick={() => navigate('/trade')}>
                            交易
                        </Button>
                        <Button danger style={{ marginLeft: 8 }} onClick={logout}>
                            退出登录
                        </Button>
                    </div>
                </div>

                <List
                    dataSource={stocks}
                    renderItem={(item: StockItem) => {
                        const priceData = prices[item.symbol] || {};
                        const currentPrice = priceData.price || 0;
                        const changePercent = priceData.changePercent || 0;
                        const isUp = changePercent > 0;

                        return (
                            <List.Item>
                                <List.Item.Meta
                                    title={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span>{item.name} ({item.symbol})</span>
                                            {currentPrice > 0 && (
                                                <Tag color={isUp ? 'red' : 'green'}>
                                                    {isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                                    {Math.abs(Number(changePercent)).toFixed(2)}%
                                                </Tag>
                                            )}
                                        </div>
                                    }
                                    description={
                                        <div>
                                            <div>市场: {item.market} | 行业: {item.industry}</div>
                                            {currentPrice > 0 && (
                                                <div style={{ marginTop: 4, fontSize: 16, fontWeight: 'bold', color: isUp ? '#ff4d4f' : '#52c41a' }}>
                                                    ¥{Number(currentPrice).toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    }
                                />
                            </List.Item>
                        );
                    }}
                />
            </Card>
        </div>
    );
};

export default Market;
