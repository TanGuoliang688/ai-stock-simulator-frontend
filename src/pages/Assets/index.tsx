import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import { tradeService, Position } from '@/services/trade';

interface TradeResponse {
    code: number;
    data: Position[];
    message?: string;
}

const Assets: React.FC = () => {
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        void loadAssets();
    }, []);

    const loadAssets = async () => {
        setLoading(true);
        try {
            const res = await tradeService.getPositions() as unknown as TradeResponse;
            if (res.code === 200) {
                setPositions(res.data);
            }
        } catch (error: unknown) {
            console.error('加载资产失败', error);
        } finally {
            setLoading(false);
        }
    };

    const totalMarketValue = positions.reduce((sum, p) => sum + p.totalCost, 0);

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="总资产"
                            value={1000000}
                            precision={2}
                            prefix={<WalletOutlined />}
                            suffix="元"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="可用资金"
                            value={1000000 - totalMarketValue}
                            precision={2}
                            suffix="元"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="持仓市值"
                            value={totalMarketValue}
                            precision={2}
                            suffix="元"
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="持仓明细" loading={loading}>
                <div style={{ textAlign: 'center', color: '#999' }}>
                    暂无持仓数据
                </div>
            </Card>
        </div>
    );
};

export default Assets;
