import React, { useState } from 'react';
import { Card, Button, message, Spin, Collapse } from 'antd';
import { RobotOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { aiService } from '@/services/ai';
import ReactMarkdown from 'react-markdown';

const { Panel } = Collapse;

interface AIResponse {
    code: number;
    data: string;
    message?: string;
}

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
            const [recsRes, adviceRes, analysisRes, portfolioRes] = await Promise.all([
                aiService.getStockRecommendations() as unknown as AIResponse,
                aiService.getTradeAdvice() as unknown as AIResponse,
                aiService.getMarketAnalysis() as unknown as AIResponse,
                aiService.getPortfolioAnalysis() as unknown as AIResponse,
            ]);

            if (recsRes.code === 200) setRecommendations(recsRes.data);
            if (adviceRes.code === 200) setTradeAdvice(adviceRes.data);
            if (analysisRes.code === 200) setMarketAnalysis(analysisRes.data);
            if (portfolioRes.code === 200) setPortfolioAnalysis(portfolioRes.data);

            message.success('AI 分析完成');
        } catch {
            message.error('AI 分析失败，请稍后重试');
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
                <Collapse defaultActiveKey={['1']}>
                    <Panel header="🎯 智能选股推荐" key="1">
                        {recommendations ? (
                            <div style={{ whiteSpace: 'pre-wrap' }}><ReactMarkdown>{recommendations}</ReactMarkdown></div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                                点击"开始分析"获取智能选股推荐
                            </div>
                        )}
                    </Panel>

                    <Panel header="💡 交易建议" key="2">
                        {tradeAdvice ? (
                            <div style={{ whiteSpace: 'pre-wrap' }}><ReactMarkdown>{tradeAdvice}</ReactMarkdown></div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                                点击"开始分析"获取交易建议
                            </div>
                        )}
                    </Panel>

                    <Panel header="📈 市场分析" key="3">
                        {marketAnalysis ? (
                            <div style={{ whiteSpace: 'pre-wrap' }}><ReactMarkdown>{marketAnalysis}</ReactMarkdown></div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                                点击"开始分析"获取市场分析
                            </div>
                        )}
                    </Panel>

                    <Panel header="📊 持仓分析" key="4">
                        {portfolioAnalysis ? (
                            <div style={{ whiteSpace: 'pre-wrap' }}><ReactMarkdown>{portfolioAnalysis}</ReactMarkdown></div>
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
