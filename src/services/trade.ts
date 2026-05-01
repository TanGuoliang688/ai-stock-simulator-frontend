import api from './api';

export interface TradeOrder {
    id: number;
    userId: number;
    stockId: number;
    symbol: string;
    orderType: 'BUY' | 'SELL';
    price: number;
    quantity: number;
    filledQuantity: number;
    totalAmount: number;
    commission: number;
    status: string;
}

export interface Position {
    id: number;
    userId: number;
    stockId: number;
    symbol: string;
    quantity: number;
    availableQuantity: number;
    avgCostPrice: number;
    totalCost: number;
}

export interface TradeRecord {
    id: number;
    orderId: number;
    symbol: string;
    tradeType: 'BUY' | 'SELL';
    price: number;
    quantity: number;
    totalAmount: number;
    commission: number;
    tradeTime: string;
}

export const tradeService = {
    // 买入股票
    buy: (symbol: string, price: number, quantity: number) =>
        api.post('/trade/buy', null, { params: { symbol, price, quantity } }),

    // 卖出股票
    sell: (symbol: string, price: number, quantity: number) =>
        api.post('/trade/sell', null, { params: { symbol, price, quantity } }),

    // 获取持仓列表
    getPositions: () => api.get('/trade/positions'),

    // 获取交易记录
    getRecords: (limit: number = 50) => api.get('/trade/records', { params: { limit } }),
};
