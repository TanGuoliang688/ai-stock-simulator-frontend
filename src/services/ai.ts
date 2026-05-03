import api from './api';

export interface AIResponse {
    code: number;
    data: string;
    message: string;
}

export const aiService = {
    // 智能选股推荐
    getStockRecommendations: (marketTrend?: string) =>
        api.get<string>('/ai/recommendations', { params: { marketTrend } }),

    // 交易建议
    getTradeAdvice: () =>
        api.get<string>('/ai/trade-advice'),

    // 市场分析
    getMarketAnalysis: () =>
        api.get<string>('/ai/market-analysis'),

    // 持仓分析
    getPortfolioAnalysis: () =>
        api.get<string>('/ai/portfolio-analysis'),
};
