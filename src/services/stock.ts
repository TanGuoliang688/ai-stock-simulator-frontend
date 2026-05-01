import api from './api';

export const stockService = {
    search: (keyword: string) => api.get(`/stock/search?keyword=${keyword}`),
    getList: (page: number, size: number, market?: string) =>
        api.get('/stock/list', { params: { page, size, market } }),
    getDetail: (symbol: string) => api.get(`/stock/${symbol}`),

    // 获取实时价格
    getPrice: (symbol: string) => api.get(`/stock/price/${symbol}`),

    // 获取所有实时价格
    getAllPrices: () => api.get('/stock/prices'),
};
