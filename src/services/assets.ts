import api from './api';
import type { Position } from '@/services/trade';

export interface AssetSummary {
    totalAssets: number;
    availableBalance: number;
    marketValue: number;
    totalProfit: number;
    profitRate: number;
}

export interface AssetHistory {
    date: string;
    totalAssets: number;
    dailyProfit: number;
}

export interface PositionDistribution {
    symbol: string;
    name: string;
    value: number;
    percentage: number;
}

export const assetService = {
    // 获取资产概览
    getSummary: () => api.get<AssetSummary>('/assets/summary'),

    // 获取资产历史（模拟数据）
    getHistory: async (days: number = 30): Promise<AssetHistory[]> => {
        return generateMockAssetHistory(days);
    },

    // 获取持仓分布
    getDistribution: async (positions: Position[]): Promise<PositionDistribution[]> => {
        if (!positions || positions.length === 0) {
            return [];
        }

        const totalValue = positions.reduce((sum, p) => sum + (p.avgCostPrice * p.quantity), 0);

        return positions.map(p => ({
            symbol: p.symbol,
            name: p.symbol,
            value: p.avgCostPrice * p.quantity,
            percentage: totalValue > 0 ? ((p.avgCostPrice * p.quantity) / totalValue) * 100 : 0,
        }));
    },
};

// 生成模拟资产历史数据
function generateMockAssetHistory(days: number): AssetHistory[] {
    const data: AssetHistory[] = [];
    let baseAssets = 100000;
    const now = new Date();

    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // 随机波动 -2% 到 +3%
        const change = (Math.random() - 0.45) * 0.05;
        const totalAssets = baseAssets * (1 + change);
        const dailyProfit = totalAssets - baseAssets;

        data.push({
            date: date.toISOString().split('T')[0],
            totalAssets: parseFloat(totalAssets.toFixed(2)),
            dailyProfit: parseFloat(dailyProfit.toFixed(2)),
        });

        baseAssets = totalAssets;
    }

    return data;
}
