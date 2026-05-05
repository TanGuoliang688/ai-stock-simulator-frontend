import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Skeleton, Empty } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined } from '@ant-design/icons';
// 注意：这里导入的是 assets (复数)
import { assetService, type AssetSummary, type AssetHistory } from '@/services/assets';
import AssetChart from '@/components/AssetChart';
import ProfitChart from '@/components/ProfitChart';
import PieChart from '@/components/PieChart';

const { Title } = Typography;

const Assets: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [assetData, setAssetData] = useState<AssetSummary | null>(null);
    const [historyData, setHistoryData] = useState<AssetHistory[]>([]);

    useEffect(() => {
        const fetchAssets = async () => {
            setLoading(true);
            try {
                // 1. 获取资产概览
                const summaryRes = await assetService.getSummary();
                setAssetData(summaryRes);

                // 2. 获取资产历史
                const historyRes = await assetService.getHistory(30);
                setHistoryData(historyRes);

            } catch (error) {
                console.error('获取资产失败', error);
            } finally {
                setLoading(false);
            }
        };

        void fetchAssets();
    }, []);

    return (
        <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
            <Title level={2}>💰 资产概览</Title>

            {/* 核心指标卡片 */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Skeleton active loading={loading}>
                            <Statistic
                                title="总资产"
                                value={assetData?.totalAssets || 0}
                                precision={2}
                                styles={{ content: { color: '#1890ff', fontSize: 24 } }}
                                prefix={<DollarOutlined />}
                                suffix="元"
                            />
                        </Skeleton>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Skeleton active loading={loading}>
                            <Statistic
                                title="持仓市值"
                                value={assetData?.marketValue || 0}
                                precision={2}
                                suffix="元"
                            />
                        </Skeleton>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Skeleton active loading={loading}>
                            <Statistic
                                title="可用资金"
                                value={assetData?.availableBalance || 0}
                                precision={2}
                                styles={{ content: { color: '#52c41a', fontSize: 24 } }}
                                suffix="元"
                            />
                        </Skeleton>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Skeleton active loading={loading}>
                            <Statistic
                                title="累计盈亏"
                                value={assetData?.totalProfit || 0}
                                precision={2}
                                styles={{
                                    content: {
                                        color: (assetData?.totalProfit || 0) >= 0 ? '#cf1322' : '#3f8600',
                                        fontSize: 24
                                    }
                                }}
                                prefix={(assetData?.totalProfit || 0) >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                suffix="元"
                            />
                        </Skeleton>
                    </Card>
                </Col>
            </Row>

            {/* 图表分析区 */}
            <Row gutter={16}>
                <Col span={24}>
                    <Card title="资产变动趋势">
                        <Skeleton active loading={loading}>
                            {historyData.length > 0 ? (
                                <AssetChart data={historyData} height={350} />
                            ) : <Empty description="暂无历史数据" />}
                        </Skeleton>
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                    <Card title="每日盈亏分布">
                        <Skeleton active loading={loading}>
                            <ProfitChart data={historyData} height={300} />
                        </Skeleton>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="持仓分布占比">
                        <Skeleton active loading={loading}>
                            <PieChart data={[]} height={300} />
                        </Skeleton>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Assets;
