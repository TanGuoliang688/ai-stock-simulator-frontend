import React, { useState } from 'react';
import { Card, Button, message, Spin, Collapse } from 'antd';
import { RobotOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { aiService } from '@/services/ai';
import ReactMarkdown from 'react-markdown';

const { Panel } = Collapse;

const AIAssistant: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<string>('');
    const [tradeAdvice, setTradeAdvice] = useState<string>('');
    const [marketAnalysis, setMarketAnalysis] = useState<string>('');
    const [portfolioAnalysis, setPortfolioAnalysis] = useState<string>('');

    // 加载所有 AI 分析
    const loadAllAnalysis = async () => {
        setLoading(true);
        try {
            // 并行调用 AI 服务
            const [recsRes, adviceRes, analysisRes, portfolioRes] = await Promise.all([
                aiService.getStockRecommendations(),
                aiService.getTradeAdvice(),
                aiService.getMarketAnalysis(),
                aiService.getPortfolioAnalysis(),
            ]);

            // TypeScript 会自动推断类型，无需显式声明
            if (recsRes.code === 200) setRecommendations(recsRes.data);
            if (adviceRes.code === 200) setTradeAdvice(adviceRes.data);
            if (analysisRes.code === 200) setMarketAnalysis(analysisRes.data);
            if (portfolioRes.code === 200) setPortfolioAnalysis(portfolioRes.data);

            void message.success('AI 分析完成');
        } catch {
            void message.error('AI 分析失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RobotOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                    <span>AI 智能助手</span>
                </div>
            }
            extra={
                <Button
                    type="primary"
                    icon={<ThunderboltOutlined />}
                    onClick={() => void loadAllAnalysis()}
                    loading={loading}
                >
                    开始分析
                </Button>
            }
        >
            <Spin spinning={loading}>
                <Collapse defaultActiveKey={['1', '2', '3', '4']}>
                    <Panel header=" 智能选股推荐" key="1">
                        {recommendations ? (
                            <div style={{ lineHeight: 1.8 }}>
                                <ReactMarkdown>{recommendations}</ReactMarkdown>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                                点击"开始分析"获取智能选股推荐
                            </div>
                        )}
                    </Panel>

                    <Panel header="💡 交易建议" key="2">
                        {tradeAdvice ? (
                            <div style={{ lineHeight: 1.8 }}>
                                <ReactMarkdown>{tradeAdvice}</ReactMarkdown>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                                点击"开始分析"获取交易建议
                            </div>
                        )}
                    </Panel>

                    <Panel header=" 市场分析" key="3">
                        {marketAnalysis ? (
                            <div style={{ lineHeight: 1.8 }}>
                                <ReactMarkdown>{marketAnalysis}</ReactMarkdown>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                                点击"开始分析"获取市场分析
                            </div>
                        )}
                    </Panel>

                    <Panel header="📊 持仓分析" key="4">
                        {portfolioAnalysis ? (
                            <div style={{ lineHeight: 1.8 }}>
                                <ReactMarkdown>{portfolioAnalysis}</ReactMarkdown>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                                点击"开始分析"获取持仓分析
                            </div>
                        )}
                    </Panel>
                </Collapse>
            </Spin>
        </Card>
    );
};

export default AIAssistant;
