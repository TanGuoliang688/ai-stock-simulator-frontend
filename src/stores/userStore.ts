import { create } from 'zustand';

export interface UserInfo {
    id?: string | number;
    username?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    nickname?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface UserState {
    token: string | null;
    userInfo: UserInfo | null;
    setToken: (token: string) => void;
    setUserInfo: (info: UserInfo) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    token: localStorage.getItem('access_token'),
    userInfo: null,
    setToken: (token) => {
        localStorage.setItem('access_token', token);
        set({ token });
    },
    setUserInfo: (info) => set({ userInfo: info }),
    logout: () => {
        localStorage.removeItem('access_token');
        set({ token: null, userInfo: null });
    },
}));
