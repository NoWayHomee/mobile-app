// store/useAuthStore.ts
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import apiClient from "../services/apiClient";

interface AuthState {
  user: any | null;
  isTokenReady: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  checkLocalToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isTokenReady: false, // Dùng để render Splash Screen trong lúc check token

  checkLocalToken: async () => {
    const token = await SecureStore.getItemAsync("access_token");
    if (token) {
      // TODO: Có thể gọi API /auth/me để lấy thông tin user thật
      set({ isTokenReady: true });
    } else {
      set({ isTokenReady: true, user: null });
    }
  },

  login: async (credentials) => {
    try {
      const response: any = await apiClient.post("/auth/login", credentials);
      const token = response.access_token || response.data?.access_token;
      const user = response.user || response.data?.user;

      if (token) {
        await SecureStore.setItemAsync("access_token", token);
        set({ user });
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("access_token");
    set({ user: null });
  },
}));
