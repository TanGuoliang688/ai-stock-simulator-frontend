import React, { useEffect, useState } from 'react';
import { Card, Table, Button, message, Space } from 'antd';
import { tradeService, Position } from '@/services/trade';

interface TradeResponse {
    code: number;
    data: Position[];
    message?: string;
}

const Portfolio: React.FC = () => {
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(false);

    // 加载持仓
    const loadPositions = async () => {
        setLoading(true);
        try {
            const res = await tradeService.getPositions() as unknown as TradeResponse;
            if (res.code === 200) {
                setPositions(res.data);
            }
        } catch {
            message.error('加载持仓失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadPositions();
    }, []);

    const columns = [
        {
            title: '股票代码',
            dataIndex: 'symbol',
            key: 'symbol',
        },
        {
            title: '持仓数量',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: '可用数量',
            dataIndex: 'availableQuantity',
            key: 'availableQuantity',
        },
        {
            title: '成本价',
            dataIndex: 'avgCostPrice',
            key: 'avgCostPrice',
            render: (price: number) => `¥${price.toFixed(2)}`,
        },
        {
            title: '总成本',
            dataIndex: 'totalCost',
            key: 'totalCost',
            render: (cost: number) => `¥${cost.toFixed(2)}`,
        },
        {
            title: '操作',
            key: 'action',
            render: (_: unknown, record: Position) => (
                <Space>
                    <Button size="small" onClick={() => handleSell(record.symbol)}>
                        卖出
                    </Button>
                </Space>
            ),
        },
    ];

    const handleSell = (symbol: string) => {
        // TODO: 跳转到交易页面，预填卖出信息
        void message.info(`准备卖出 ${symbol}`);
    };

    return (
        <div style={{ padding: 24 }}>
            <Card
                title="我的持仓"
                extra={<Button onClick={loadPositions} loading={loading}>刷新</Button>}
            >
                <Table
                    dataSource={positions}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    locale={{ emptyText: '暂无持仓' }}
                />

                <div style={{ marginTop: 16, textAlign: 'right' }}>
                    <strong>总市值：¥{positions.reduce((sum, p) => sum + p.totalCost, 0).toFixed(2)}</strong>
                </div>
            </Card>
        </div>
    );
};

export default Portfolio;
