export interface KLineData {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export const klineService = {
    // 获取K线数据（模拟数据，实际应从后端获取）
    getKLineData: async (_symbol: string, days: number = 30): Promise<KLineData[]> => {
        // TODO: 调用后端接口
        // return api.get<KLineData[]>(`/stock/kline/${symbol}?days=${days}`);

        // 临时生成模拟数据
        return generateMockKLineData(days);
    },
};

// 生成模拟K线数据
function generateMockKLineData(days: number): KLineData[] {
    const data: KLineData[] = [];
    let basePrice = 100 + Math.random() * 900;
    const now = new Date();

    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // 随机波动 -3% 到 +3%
        const change = (Math.random() - 0.5) * 0.06;
        const open = basePrice;
        const close = basePrice * (1 + change);
        const high = Math.max(open, close) * (1 + Math.random() * 0.02);
        const low = Math.min(open, close) * (1 - Math.random() * 0.02);
        const volume = Math.floor(Math.random() * 1000000) + 100000;

        data.push({
            date: date.toISOString().split('T')[0],
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2)),
            volume,
        });

        basePrice = close;
    }

    return data;
}
