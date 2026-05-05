import React, { useState, useEffect } from 'react';
import { Input, List, Card, message, Button, Tag, Skeleton, Typography } from 'antd';
import { SearchOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { stockService } from '@/services/stock';
import { useUserStore } from '@/stores/userStore';

const { Text } = Typography;

// --- 类型定义 ---
export interface StockVO {
    id: number;
    symbol: string;
    name: string;
    market: string;
    industry: string;
}

interface PriceData {
    price: number;
    changePercent: number;
}

export interface PricesMap {
    [symbol: string]: PriceData;
}

interface ApiResponse<T> {
    code: number;
    data: T;
    message?: string;
}

const Market: React.FC = () => {
    const navigate = useNavigate();
    const logout = useUserStore((state) => state.logout);

    // 状态管理
    const [stocks, setStocks] = useState<StockVO[]>([]);
    const [loading, setLoading] = useState(false);
    const [prices, setPrices] = useState<PricesMap>({});

    // 每3秒刷新一次价格
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await stockService.getAllPrices() as unknown as ApiResponse<PricesMap>;
                if (res.code === 200) {
                    setPrices(res.data);
                }
            } catch (error) {
                console.error('获取实时价格失败', error);
            }
        };

        void fetchPrices();
        const interval = setInterval(fetchPrices, 3000);

        return () => clearInterval(interval);
    }, []);

    // 搜索处理
    const handleSearch = async (keyword: string) => {
        if (!keyword) {
            setStocks([]);
            return;
        }

        setLoading(true);
        try {
            const res = await stockService.search(keyword) as unknown as ApiResponse<StockVO[]>;
            if (res.code === 200) {
                setStocks(res.data);
            } else {
                void message.error(res.message || '搜索失败');
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            void message.error(err.response?.data?.message || '网络错误，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
            <Card
                title="📈 股票行情中心"
                extra={
                    <div>
                        <Button onClick={() => navigate('/dashboard')} style={{ marginRight: 8 }}>
                            返回首页
                        </Button>
                        <Button type="primary" onClick={() => navigate('/trade')}>
                            模拟交易
                        </Button>
                    </div>
                }
            >
                <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
                    <Input.Search
                        placeholder="输入股票代码或名称 (如: 贵州茅台)"
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        onSearch={handleSearch}
                        loading={loading}
                        style={{ maxWidth: 500 }}
                    />
                    <Button danger onClick={logout}>退出登录</Button>
                </div>

                {/* 骨架屏加载效果 */}
                <Skeleton active loading={loading && stocks.length === 0}>
                    <List
                        itemLayout="horizontal"
                        dataSource={stocks}
                        renderItem={(item) => {
                            const priceData = prices[item.symbol];
                            const currentPrice = priceData?.price || 0;
                            const changePercent = priceData?.changePercent || 0;
                            const isUp = changePercent > 0;

                            return (
                                <List.Item
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        background: '#fff',
                                        marginBottom: 8,
                                        padding: '16px',
                                        borderRadius: 8,
                                        border: '1px solid #f0f0f0'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.borderColor = '#d9d9d9';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.borderColor = '#f0f0f0';
                                    }}
                                    onClick={() => navigate(`/stock/${item.symbol}`)}
                                >
                                    <List.Item.Meta
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <Text strong style={{ fontSize: 16 }}>{item.name}</Text>
                                                <Text type="secondary">({item.symbol})</Text>
                                                {currentPrice > 0 && (
                                                    <Tag color={isUp ? 'volcano' : 'green'} icon={isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}>
                                                        {isUp ? '+' : ''}{Number(changePercent).toFixed(2)}%
                                                    </Tag>
                                                )}
                                            </div>
                                        }
                                        description={
                                            <div style={{ marginTop: 8 }}>
                                                <Tag bordered={false}>{item.market}</Tag>
                                                <Tag bordered={false} color="blue">{item.industry}</Tag>
                                            </div>
                                        }
                                    />
                                    <div style={{ textAlign: 'right', minWidth: 120 }}>
                                        <div style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                            color: currentPrice > 0 ? (isUp ? '#ff4d4f' : '#52c41a') : '#000'
                                        }}>
                                            {Number(currentPrice).toFixed(2)}
                                        </div>
                                        <Text type="secondary" style={{ fontSize: 12 }}>实时价格</Text>
                                    </div>
                                </List.Item>
                            );
                        }}
                    />
                </Skeleton>

                {!loading && stocks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                        请输入股票代码或名称开始搜索
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Market;
