import React, {useState, useEffect} from 'react';
import {Card, Tabs, Form, Input, InputNumber, Button, message, Statistic, Row, Col} from 'antd';
import {ArrowUpOutlined, ArrowDownOutlined, WalletOutlined} from '@ant-design/icons';
import {tradeService, Position} from '@/services/trade';
import {stockService} from '@/services/stock';
import {userService, UserInfo} from '@/services/user';

interface StockVO {
    symbol: string;
    name: string;
    market: string;
    industry: string;
}

interface PriceData {
    price: number;
}

interface TradeResponse {
    code: number;
    data: unknown;
    message?: string;
}

interface SearchResponse {
    code: number;
    data: StockVO[];
    message?: string;
}

interface PriceResponse {
    code: number;
    data: PriceData;
    message?: string;
}

interface UserResponse {
    code: number;
    data: UserInfo;
    message?: string;
}

interface PositionsResponse {
    code: number;
    data: Position[];
    message?: string;
}

interface TradeFormValues {
    symbol: string;
    price: number;
    quantity: number;
}

const Trade: React.FC = () => {
    const [activeTab, setActiveTab] = useState('buy');
    const [loading, setLoading] = useState(false);
    const [selectedStock, setSelectedStock] = useState<StockVO | null>(null);
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [userPositions, setUserPositions] = useState<Position[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        void loadUserInfo();
        void loadPositions();
    }, []);

    const loadPositions = async () => {
        try {
            const res = await tradeService.getPositions() as unknown as PositionsResponse;
            if (res.code === 200) {
                setUserPositions(res.data);
            }
        } catch (error: unknown) {
            console.error('加载持仓失败', error);
        }
    };

    const loadUserInfo = async () => {
        try {
            const res = await userService.getCurrentUser() as unknown as UserResponse;
            if (res.code === 200) {
                setUserInfo(res.data);
            }
        } catch (error: unknown) {
            console.error('加载用户信息失败', error);
        }
    };

    const handleSearchStock = async (keyword: string) => {
        if (!keyword || keyword.length < 2) return;

        try {
            const res = await stockService.search(keyword) as unknown as SearchResponse;
            if (res.code === 200 && res.data.length > 0) {
                const stock = res.data[0];
                setSelectedStock(stock);
                form.setFieldsValue({symbol: stock.symbol});

                const priceRes = await stockService.getPrice(stock.symbol) as unknown as PriceResponse;
                if (priceRes.code === 200) {
                    setCurrentPrice(priceRes.data.price);
                    form.setFieldsValue({price: priceRes.data.price});
                }
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err.response?.data?.message || '搜索失败');
        }
    };

    const calculateMaxBuy = (price: number) => {
        if (!userInfo || price <= 0) return 0;
        const maxAmount = userInfo.virtualBalance;
        return Math.floor(maxAmount / price / 100) * 100;
    };

    const getPositionQuantity = (symbol: string) => {
        const position = userPositions.find(p => p.symbol === symbol);
        return position ? position.availableQuantity : 0;
    };

    const handleBuy = async (values: TradeFormValues) => {
        setLoading(true);
        try {
            const res = await tradeService.buy(values.symbol, values.price, values.quantity) as unknown as TradeResponse;
            if (res.code === 200) {
                message.success(`买入成功：${values.quantity}股 @ ${values.price}元`);
                form.resetFields();
                setSelectedStock(null);
                setCurrentPrice(0);
                void loadUserInfo();
                void loadPositions();
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err.response?.data?.message || '买入失败');
        } finally {
            setLoading(false);
        }
    };

    const handleSell = async (values: TradeFormValues) => {
        setLoading(true);
        try {
            const res = await tradeService.sell(values.symbol, values.price, values.quantity) as unknown as TradeResponse;
            if (res.code === 200) {
                message.success(`卖出成功：${values.quantity}股 @ ${values.price}元`);
                form.resetFields();
                setSelectedStock(null);
                setCurrentPrice(0);
                void loadUserInfo();
                void loadPositions();
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err.response?.data?.message || '卖出失败');
        } finally {
            setLoading(false);
        }
    };

    const handleSetMaxQuantity = (type: 'buy' | 'sell') => {
        const price = form.getFieldValue('price');
        const symbol = form.getFieldValue('symbol');

        if (type === 'buy' && price && price > 0) {
            const maxQty = calculateMaxBuy(price);

            if (maxQty >= 100) {
                form.setFieldsValue({ quantity: maxQty });
                void message.success(`已填入最大可买数量: ${maxQty}股`);
            } else {
                void message.warning('资金不足，无法买入');
            }
        } else if (type === 'sell' && symbol) {
            const qty = getPositionQuantity(symbol);

            if (qty >= 100) {
                form.setFieldsValue({ quantity: qty });
                void message.success(`已填入持仓数量: ${qty}股`);
            } else {
                void message.warning('持仓不足，无法卖出');
            }
        } else {
            void message.warning(type === 'buy' ? '请先输入价格' : '请先选择股票');
        }
    };

    const tabItems = [
        {
            key: 'buy',
            label: <span><ArrowUpOutlined/> 买入</span>,
            children: (
                <div>
                    <Row gutter={16} style={{marginBottom: 16}}>
                        <Col span={12}>
                            <Card size="small">
                                <Statistic
                                    title="可用资金"
                                    value={userInfo?.virtualBalance || 0}
                                    precision={2}
                                    prefix={<WalletOutlined/>}
                                    suffix="元"
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card size="small">
                                <Statistic
                                    title="可买数量"
                                    value={currentPrice > 0 ? calculateMaxBuy(currentPrice) : 0}
                                    suffix="股"
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Form form={form} onFinish={handleBuy} layout="vertical">
                        <Form.Item label="股票代码" name="symbol" rules={[{required: true}]}>
                            <Input.Search
                                placeholder="输入代码或名称搜索"
                                onSearch={handleSearchStock}
                                disabled={loading}
                            />
                        </Form.Item>

                        {selectedStock && (
                            <Card size="small" style={{marginBottom: 16}}>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <div>
                                        <strong>{selectedStock.name}</strong> ({selectedStock.symbol})
                                    </div>
                                    {currentPrice > 0 && (
                                        <div style={{fontSize: 18, fontWeight: 'bold', color: '#ff4d4f'}}>
                                            {currentPrice.toFixed(2)}
                                        </div>
                                    )}
                                </div>
                                <div style={{color: '#999', fontSize: 12}}>
                                    {selectedStock.market} | {selectedStock.industry}
                                </div>
                            </Card>
                        )}

                        <Form.Item label="价格" name="price" rules={[{required: true}]}>
                            <InputNumber
                                style={{width: '100%'}}
                                placeholder="委托价格"
                                min={0.01}
                                step={0.01}
                                precision={2}
                                onChange={(value) => {
                                    if (value) {
                                        setCurrentPrice(value);
                                    }
                                }}
                            />
                        </Form.Item>

                        <Form.Item label="数量" name="quantity" rules={[{required: true}]}>
                            <InputNumber
                                style={{width: 'calc(100% - 80px)', marginRight: 8}}
                                placeholder="买入数量（股）"
                                min={100}
                                step={100}
                                value={form.getFieldValue('quantity')}
                            />
                            <Button
                                htmlType="button"
                                onClick={() => handleSetMaxQuantity('buy')}
                            >
                                全部
                            </Button>
                        </Form.Item>

                        {form.getFieldValue('price') && form.getFieldValue('quantity') && (
                            <div style={{marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4}}>
                                <div>预计金额：<strong
                                    style={{color: '#ff4d4f'}}>{(form.getFieldValue('price') * form.getFieldValue('quantity')).toFixed(2)}</strong>
                                </div>
                                <div style={{fontSize: 12, color: '#999'}}>手续费另计</div>
                            </div>
                        )}

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block danger size="large">
                                买入
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ),
        },
        {
            key: 'sell',
            label: <span><ArrowDownOutlined/> 卖出</span>,
            children: (
                <div>
                    <Row gutter={16} style={{marginBottom: 16}}>
                        <Col span={12}>
                            <Card size="small">
                                <Statistic
                                    title="持仓数量"
                                    value={selectedStock ? getPositionQuantity(selectedStock.symbol) : 0}
                                    suffix="股"
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card size="small">
                                <Statistic
                                    title="可用数量"
                                    value={selectedStock ? getPositionQuantity(selectedStock.symbol) : 0}
                                    suffix="股"
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Form form={form} onFinish={handleSell} layout="vertical">
                        <Form.Item label="股票代码" name="symbol" rules={[{required: true}]}>
                            <Input.Search
                                placeholder="输入代码或名称搜索"
                                onSearch={handleSearchStock}
                                disabled={loading}
                            />
                        </Form.Item>

                        {selectedStock && (
                            <Card size="small" style={{marginBottom: 16}}>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <div>
                                        <strong>{selectedStock.name}</strong> ({selectedStock.symbol})
                                    </div>
                                    {currentPrice > 0 && (
                                        <div style={{fontSize: 18, fontWeight: 'bold', color: '#52c41a'}}>
                                            {currentPrice.toFixed(2)}
                                        </div>
                                    )}
                                </div>
                                <div style={{color: '#999', fontSize: 12}}>
                                    持仓: {getPositionQuantity(selectedStock.symbol)} 股
                                </div>
                            </Card>
                        )}

                        <Form.Item label="价格" name="price" rules={[{required: true}]}>
                            <InputNumber
                                style={{width: '100%'}}
                                placeholder="委托价格"
                                min={0.01}
                                step={0.01}
                                precision={2}
                                onChange={(value) => {
                                    if (value) {
                                        setCurrentPrice(value);
                                    }
                                }}
                            />
                        </Form.Item>

                        <Form.Item label="数量" name="quantity" rules={[{required: true}]}>
                            <InputNumber
                                style={{width: 'calc(100% - 80px)', marginRight: 8}}
                                placeholder="卖出数量（股）"
                                min={100}
                                step={100}
                                max={selectedStock ? getPositionQuantity(selectedStock.symbol) : undefined}
                                value={form.getFieldValue('quantity')}
                            />
                            <Button htmlType="button" onClick={() => handleSetMaxQuantity('sell')}>
                                全部
                            </Button>
                        </Form.Item>

                        {form.getFieldValue('price') && form.getFieldValue('quantity') && (
                            <div style={{marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4}}>
                                <div>预计金额：<strong
                                    style={{color: '#52c41a'}}>{(form.getFieldValue('price') * form.getFieldValue('quantity')).toFixed(2)}</strong>
                                </div>
                                <div style={{fontSize: 12, color: '#999'}}>扣除手续费和印花税后到账</div>
                            </div>
                        )}

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block size="large">
                                卖出
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ),
        },
    ];

    return (
        <div style={{padding: 24}}>
            <Card title="模拟交易">
                <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems}/>
            </Card>
        </div>
    );
};

export default Trade;
