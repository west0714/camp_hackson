'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

type UserContextType = {
  id?: string;
  token?: string;
  userName?: string;
  userType?: string;
  isLoading: boolean;
  logout: () => void;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserContextType>({
    isLoading: true,
    logout: () => {},
  });

  const logout = () => {
    localStorage.removeItem('userSession');
    setUser({ isLoading: false, logout });
  };

  // ユーザーネームをAPIから取得
  const fetchUserName = async (id: string, token: string, userType: string) => {
    try {
      const endpoint = userType === 'streamer' 
        ? `https://geek-camp-hackason-back.onrender.com/api/v1/streamers/${id}`
        : `https://geek-camp-hackason-back.onrender.com/api/v1/viewers/${id}`;

      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data.userName || response.data.name || 'Unknown User';
    } catch (error) {
      console.error('ユーザーネーム取得エラー:', error);
      return 'Unknown User';
    }
  };

  useEffect(() => {
    const session = localStorage.getItem('userSession');
    if (session) {
      try {
        const userData = JSON.parse(session);
        
        // 初期状態を設定（userNameは後で取得）
        setUser({
          id: userData.id,
          token: userData.token,
          userType: userData.userType,
          userName: userData.userName || undefined, // セッションに保存されている場合は使用
          isLoading: false,
          logout,
        });

        // セッションにuserNameがない場合のみAPIから取得
        if (!userData.userName && userData.id && userData.token && userData.userType) {
          fetchUserName(userData.id, userData.token, userData.userType)
            .then(userName => {
              setUser(prev => ({
                ...prev,
                userName,
              }));
            })
            .catch(() => {
              // エラーの場合はデフォルト値を設定
              setUser(prev => ({
                ...prev,
                userName: 'Unknown User',
              }));
            });
        }
      } catch (error) {
        console.error('セッション情報の解析エラー:', error);
        localStorage.removeItem('userSession');
        setUser({ isLoading: false, logout });
      }
    } else {
      setUser({ isLoading: false, logout });
    }
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};