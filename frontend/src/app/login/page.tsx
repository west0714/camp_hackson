'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LoginResponse {
  token: string;
  viewer_id?: string;
  streamer_id?: string;
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'user' | 'streamer'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // ページロード時にセッションをチェック
  useEffect(() => {
    const session = localStorage.getItem('userSession');
    if (session) {
      router.push('/');
    }
  }, [router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = activeTab === 'streamer' 
        ? 'https://geek-camp-hackason-back.onrender.com/api/v1/auth/streamer_login'
        : 'https://geek-camp-hackason-back.onrender.com/api/v1/auth/viewer_login';

      const response = await axios.post<LoginResponse>(endpoint, {
        email,
        password,
      });

      // ユーザーIDを取得
      const userId = activeTab === 'streamer' ? response.data.streamer_id : response.data.viewer_id;
      const token = response.data.token;

      // ユーザーIDとトークンが存在することを確認
      if (!userId || !token) {
        throw new Error('ユーザーIDまたはトークンが取得できませんでした。');
      }

      // ユーザーネームを取得
      const userName = await fetchUserName(userId, token, activeTab);

      // ログイン成功時の処理
      const userData = {
        token: token,
        id: userId,
        userName: userName,
        userType: activeTab,
        loginTime: new Date().toISOString(),
      };

      // セッション情報をローカルストレージに保存
      localStorage.setItem('userSession', JSON.stringify(userData));
      
      console.log('✅ ログイン成功:', userData);
      router.push('/');
    } catch (error: any) {
      console.error('❌ ログイン失敗:', error);
      if (error.response?.status === 401) {
        setError('メールアドレスまたはパスワードが正しくありません。');
      } else if (error.response?.status === 404) {
        setError('ユーザーが見つかりません。');
      } else {
        setError('ログイン中にエラーが発生しました。しばらく時間をおいて再度お試しください。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-8">DonaCheer</h1>
        
        {/* タブ */}
        <div className="flex justify-between mb-6">
          <button
            className={`flex-1 py-3 rounded-l-lg transition-colors ${
              activeTab === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('user')}
            disabled={isLoading}
          >
            一般ユーザー
          </button>
          <button
            className={`flex-1 py-3 rounded-r-lg transition-colors ${
              activeTab === 'streamer'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('streamer')}
            disabled={isLoading}
          >
            配信者
          </button>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              placeholder="パスワードを入力"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'user'
                ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'
                : 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
            } text-white`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ログイン中...
              </div>
            ) : (
              activeTab === 'user' ? 'ユーザーログイン' : '配信者ログイン'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}