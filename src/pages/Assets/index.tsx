import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Button, message, Spin } from 'antd';
import { WalletOutlined, RiseOutlined, FallOutlined, ReloadOutlined } from '@ant-design/icons';
import { tradeService, Position } from '@/services/trade';
import { userService, UserInfo } from '@/services/user';
import { assetService, AssetSummary, AssetHistory, PositionDistribution } from '@/services/assets';
import AssetChart from '@/components/AssetChart';
import ProfitChart from '@/components/ProfitChart';
import PieChart from '@/components/PieChart';

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

const Assets: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [assetSummary, setAssetSummary] = useState<AssetSummary | null>(null);
    const [assetHistory, setAssetHistory] = useState<AssetHistory[]>([]);
    const [distribution, setDistribution] = useState<PositionDistribution[]>([]);

    // 加载数据
    const loadData = async () => {
        setLoading(true);
        try {
            const [userRes, positionsRes, historyData] = await Promise.all([
                userService.getCurrentUser() as unknown as UserResponse,
                tradeService.getPositions() as unknown as PositionsResponse,
                assetService.getHistory(30),
            ]);

            if (userRes.code === 200 && positionsRes.code === 200) {
                const marketValue = positionsRes.data.reduce(
                    (sum: number, p: Position) => sum + p.avgCostPrice * p.quantity,
                    0
                );
                const totalAssets = userRes.data.virtualBalance + marketValue;
                const initialCapital = 100000;
                const totalProfit = totalAssets - initialCapital;
                const profitRate = (totalProfit / initialCapital) * 100;

                setAssetSummary({
                    totalAssets,
                    availableBalance: userRes.data.virtualBalance,
                    marketValue,
                    totalProfit,
                    profitRate,
                });

                const distData = await assetService.getDistribution(positionsRes.data);
                setDistribution(distData);
            }

            setAssetHistory(historyData);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err.response?.data?.message || '加载资产数据失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadData();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: 24, textAlign: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="总资产"
                            value={assetSummary?.totalAssets || 0}
                            precision={2}
                            prefix={<WalletOutlined />}
                            suffix="元"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="可用资金"
                            value={assetSummary?.availableBalance || 0}
                            precision={2}
                            prefix="¥"
                            suffix="元"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="持仓市值"
                            value={assetSummary?.marketValue || 0}
                            precision={2}
                            prefix="¥"
                            suffix="元"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="总收益"
                            value={assetSummary?.totalProfit || 0}
                            precision={2}
                            prefix={assetSummary && assetSummary.totalProfit >= 0 ? <RiseOutlined /> : <FallOutlined />}
                            suffix={`(${assetSummary?.profitRate?.toFixed(2)}%)`}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={24}>
                    <Card
                        title="资产趋势"
                        extra={
                            <Button icon={<ReloadOutlined />} onClick={() => void loadData()} loading={loading}>
                                刷新
                            </Button>
                        }
                    >
                        <AssetChart data={assetHistory} height={350} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                    <Card title="每日盈亏">
                        <ProfitChart data={assetHistory} height={300} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="持仓分布">
                        <PieChart data={distribution} height={300} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Assets;
