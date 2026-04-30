import api from './api';

export const stockService = {
    search: (keyword: string) => api.get(`/stock/search?keyword=${keyword}`),
    getList: (page: number, size: number, market?: string) =>
        api.get('/stock/list', { params: { page, size, market } }),
    getDetail: (symbol: string) => api.get(`/stock/${symbol}`),
};
