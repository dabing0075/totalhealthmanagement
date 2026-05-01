// @ts-nocheck
/**
 * 认证上下文 - 包含手机号登录逻辑
 */
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL || 'http://localhost:9091';

interface User {
  id: number;
  phone: string;
  nickname: string;
  avatar: string;
  gender: string;
  birthday: string;
  height: number;
  weight: number;
  signature: string;
  vipLevel: number;
  vipExpireDate: string;
  points: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时从存储恢复登录状态
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('auth_token');
        const savedUser = await AsyncStorage.getItem('user_data');
        
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          
          // 验证 token 是否有效
          await refreshUser();
        }
      } catch (error) {
        console.error('初始化认证状态失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // 刷新用户信息
  const refreshUser = useCallback(async () => {
    try {
      const savedToken = await AsyncStorage.getItem('auth_token');
      if (!savedToken) return;

      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${savedToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      } else {
        // Token 失效，清除登录状态
        await logout();
      }
    } catch (error) {
      console.error('刷新用户信息失败:', error);
    }
  }, []);

  // 登录
  const login = async (newToken: string, userData: User) => {
    try {
      await AsyncStorage.setItem('auth_token', newToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
    } catch (error) {
      console.error('保存登录状态失败:', error);
      throw error;
    }
  };

  // 登出
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('清除登录状态失败:', error);
    }
  };

  // 更新用户信息
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
