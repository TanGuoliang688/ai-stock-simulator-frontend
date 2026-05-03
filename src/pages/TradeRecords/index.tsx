import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, message, Statistic, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ReloadOutlined } from '@ant-design/icons';
import { tradeService, TradeRecord } from '@/services/trade';
import dayjs from 'dayjs';

interface RecordsResponse {
    code: number;
    data: TradeRecord[];
    message?: string;
}

const TradeRecords: React.FC = () => {
    const [records, setRecords] = useState<TradeRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [statistics, setStatistics] = useState({
        totalBuy: 0,
        totalSell: 0,
        totalCommission: 0,
    });

    // 加载交易记录
    const loadRecords = async () => {
        setLoading(true);
        try {
            const res = await tradeService.getRecords(100) as unknown as RecordsResponse;
            if (res.code === 200) {
                setRecords(res.data);
                calculateStatistics(res.data);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err.response?.data?.message || '加载交易记录失败');
        } finally {
            setLoading(false);
        }
    };

    // 计算统计数据
    const calculateStatistics = (data: TradeRecord[]) => {
        let totalBuy = 0;
        let totalSell = 0;
        let totalCommission = 0;

        data.forEach(record => {
            if (record.tradeType === 'BUY') {
                totalBuy += record.totalAmount;
            } else {
                totalSell += record.totalAmount;
            }
            totalCommission += record.commission;
        });

        setStatistics({
            totalBuy,
            totalSell,
            totalCommission,
        });
    };

    useEffect(() => {
        void loadRecords();
    }, []);

    // 表格列定义
    const columns = [
        {
            title: '成交时间',
            dataIndex: 'tradeTime',
            key: 'tradeTime',
            width: 180,
            render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '股票代码',
            dataIndex: 'symbol',
            key: 'symbol',
            width: 120,
        },
        {
            title: '类型',
            dataIndex: 'tradeType',
            key: 'tradeType',
            width: 100,
            render: (type: string) => (
                <Tag color={type === 'BUY' ? 'red' : 'green'} icon={type === 'BUY' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}>
                    {type === 'BUY' ? '买入' : '卖出'}
                </Tag>
            ),
        },
        {
            title: '成交价格',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            render: (price: number) => `¥${price.toFixed(2)}`,
        },
        {
            title: '成交数量',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 120,
            render: (quantity: number) => `${quantity}股`,
        },
        {
            title: '成交金额',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 140,
            render: (amount: number, record: TradeRecord) => (
                <span style={{ color: record.tradeType === 'BUY' ? '#ff4d4f' : '#52c41a', fontWeight: 'bold' }}>
                    ¥{amount.toFixed(2)}
                </span>
            ),
        },
        {
            title: '手续费',
            dataIndex: 'commission',
            key: 'commission',
            width: 120,
            render: (commission: number) => `¥${commission.toFixed(2)}`,
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            {/* 统计卡片 */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="总买入金额"
                            value={statistics.totalBuy}
                            precision={2}
                            prefix="¥"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="总卖出金额"
                            value={statistics.totalSell}
                            precision={2}
                            prefix="¥"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="总手续费"
                            value={statistics.totalCommission}
                            precision={2}
                            prefix="¥"
                        />
                    </Card>
                </Col>
            </Row>

            {/* 交易记录表格 */}
            <Card
                title="交易记录"
                extra={
                    <Button icon={<ReloadOutlined />} onClick={() => void loadRecords()} loading={loading}>
                        刷新
                    </Button>
                }
            >
                <Table
                    dataSource={records}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 20,
                        showSizeChanger: true,
                        showTotal: (total) => `共 ${total} 条记录`,
                    }}
                    locale={{ emptyText: '暂无交易记录' }}
                    expandable={{
                        expandedRowRender: (record: TradeRecord) => (
                            <p style={{ margin: 0 }}>
                                订单ID: {record.orderId} |
                                成交时间: {dayjs(record.tradeTime).format('YYYY-MM-DD HH:mm:ss')}
                            </p>
                        ),
                    }}
                />
            </Card>
        </div>
    );
};

export default TradeRecords;
