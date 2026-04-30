import api from './api';

export interface LoginRequest {
    usernameOrEmail: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    phone?: string;
}

export const authService = {
    login: (data: LoginRequest) => api.post('/auth/login', data),
    register: (data: RegisterRequest) => api.post('/auth/register', data),
    getCurrentUser: () => api.get('/auth/me'),
};
