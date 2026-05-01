import api from './api';

export interface UserInfo {
    id: number;
    username: string;
    email: string;
    phone: string;
    avatarUrl: string;
    virtualBalance: number;
    totalAssets: number;
    status: string;
}

export const userService = {
    // 获取当前用户信息
    getCurrentUser: () => api.get<UserInfo>('/auth/me'),
};
