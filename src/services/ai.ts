import api from './api';

export interface AIResponse {
    code: number;
    data: string;
    message: string;
}

export const aiService = {
    // 智能选股推荐
    getStockRecommendations: (marketTrend?: string) =>
        api.get('/ai/recommendations', { params: { marketTrend } }) as Promise<AIResponse>,

    // 交易建议
    getTradeAdvice: () =>
        api.get('/ai/trade-advice') as Promise<AIResponse>,

    // 市场分析
    getMarketAnalysis: () =>
        api.get('/ai/market-analysis') as Promise<AIResponse>,

    // 持仓分析
    getPortfolioAnalysis: () =>
        api.get('/ai/portfolio-analysis') as Promise<AIResponse>,
};
