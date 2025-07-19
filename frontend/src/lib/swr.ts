import { SWRConfiguration } from 'swr';

// 認証付きのfetcher関数
export const fetcherWithAuth = async (url: string, token: string) => {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // 認証エラーの場合、ローカルストレージをクリア
      localStorage.removeItem('userSession');
      throw new Error('認証エラーです。再度ログインしてください。');
    }
    throw new Error('データの取得に失敗しました。');
  }

  return response.json();
};

// 配列形式のキーに対応した認証付きfetcher関数
export const authFetcher = (args: [string, string]) => {
  return fetcherWithAuth(args[0], args[1]);
};

// 通常のfetcher関数（認証不要）
export const fetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('データの取得に失敗しました。');
  }
  
  return response.json();
};

// SWRのグローバル設定
export const swrConfig: SWRConfiguration = {
  // エラー時に自動リトライ
  errorRetryCount: 3,
  // フォーカス時に再取得
  revalidateOnFocus: false,
  // ネットワーク復旧時に再取得
  revalidateOnReconnect: true,
  // デバウンス時間
  dedupingInterval: 2000,
  // エラー時の処理
  onError: (error) => {
    console.error('SWR Global Error:', error);
  },
};

// 認証付きSWRフックのヘルパー関数
export const createAuthSWRKey = (url: string, token: string | undefined) => {
  return token ? [url, token] : null;
}; 