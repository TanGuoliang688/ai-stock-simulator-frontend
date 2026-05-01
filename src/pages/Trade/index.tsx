import React, { useState } from 'react';
import { Card, Tabs, Form, Input, InputNumber, Button, message } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { tradeService } from '@/services/trade';
import { stockService } from '@/services/stock';
import { StockItem } from '@/pages/Market';

interface TradeResponse {
    code: number;
    data: unknown;
    message?: string;
}

interface SearchResponse {
    code: number;
    data: StockItem[];
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
    const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
    const [form] = Form.useForm();

    // 搜索股票
    const handleSearchStock = async (keyword: string) => {
        if (!keyword || keyword.length < 2) return;

        try {
            const res = await stockService.search(keyword) as unknown as SearchResponse;
            if (res.code === 200 && res.data.length > 0) {
                setSelectedStock(res.data[0]);
                form.setFieldsValue({ symbol: res.data[0].symbol });
            }
        } catch {
            message.error('搜索失败');
        }
    };

    // 买入
    const handleBuy = async (values: TradeFormValues) => {
        setLoading(true);
        try {
            const res = await tradeService.buy(values.symbol, values.price, values.quantity) as unknown as TradeResponse;
            if (res.code === 200) {
                message.success(`买入成功：${values.quantity}股 @ ${values.price}元`);
                form.resetFields();
                setSelectedStock(null);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err.response?.data?.message || '买入失败');
        } finally {
            setLoading(false);
        }
    };

    // 卖出
    const handleSell = async (values: TradeFormValues) => {
        setLoading(true);
        try {
            const res = await tradeService.sell(values.symbol, values.price, values.quantity) as unknown as TradeResponse;
            if (res.code === 200) {
                message.success(`卖出成功：${values.quantity}股 @ ${values.price}元`);
                form.resetFields();
                setSelectedStock(null);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err.response?.data?.message || '卖出失败');
        } finally {
            setLoading(false);
        }
    };

    const tabItems = [
        {
            key: 'buy',
            label: <span><ArrowUpOutlined /> 买入</span>,
            children: (
                <Form form={form} onFinish={handleBuy} layout="vertical">
                    <Form.Item label="股票代码" name="symbol" rules={[{ required: true }]}>
                        <Input.Search
                            placeholder="输入代码或名称搜索"
                            onSearch={handleSearchStock}
                            disabled={loading}
                        />
                    </Form.Item>

                    {selectedStock && (
                        <Card size="small" style={{ marginBottom: 16 }}>
                            <div>{selectedStock.name} ({selectedStock.symbol})</div>
                            <div style={{ color: '#999', fontSize: 12 }}>{selectedStock.market}</div>
                        </Card>
                    )}

                    <Form.Item label="价格" name="price" rules={[{ required: true }]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="委托价格"
                            min={0.01}
                            step={0.01}
                            precision={2}
                        />
                    </Form.Item>

                    <Form.Item label="数量" name="quantity" rules={[{ required: true }]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="买入数量（手）"
                            min={100}
                            step={100}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block danger>
                            买入
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            key: 'sell',
            label: <span><ArrowDownOutlined /> 卖出</span>,
            children: (
                <Form form={form} onFinish={handleSell} layout="vertical">
                    <Form.Item label="股票代码" name="symbol" rules={[{ required: true }]}>
                        <Input.Search
                            placeholder="输入代码或名称搜索"
                            onSearch={handleSearchStock}
                            disabled={loading}
                        />
                    </Form.Item>

                    {selectedStock && (
                        <Card size="small" style={{ marginBottom: 16 }}>
                            <div>{selectedStock.name} ({selectedStock.symbol})</div>
                            <div style={{ color: '#999', fontSize: 12 }}>{selectedStock.market}</div>
                        </Card>
                    )}

                    <Form.Item label="价格" name="price" rules={[{ required: true }]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="委托价格"
                            min={0.01}
                            step={0.01}
                            precision={2}
                        />
                    </Form.Item>

                    <Form.Item label="数量" name="quantity" rules={[{ required: true }]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="卖出数量（手）"
                            min={100}
                            step={100}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            卖出
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card title="模拟交易">
                <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
            </Card>
        </div>
    );
};

export default Trade;
