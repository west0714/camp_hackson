'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDonationTargets } from '@/hooks/useDonationTargets';

export default function SignupPage() {
  const [activeTab, setActiveTab] = useState<'user' | 'streamer'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [youtubeURL, setYoutubeURL] = useState('');
  const [twitchURL, settwichURL] =useState('');
  const [donationRatio, setDonationRatio] = useState('');
  const [donationTarget, setDonationTarget] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log("パスワード", password)
    console.log("userName", userName)
    console.log("email:", email)

    try {
      if (activeTab === 'user') {
        axios.post('https://geek-camp-hackason-back.onrender.com/api/v1/viewers', {
            viewer: {
                name: userName,
                email: email,
                password: password
            }
        });
      } else {
        axios.post('https://geek-camp-hackason-back.onrender.com/api/v1/streamers', {
            streamer: {
                name: userName,
                email: email,
                password: password,
                youtube_url: youtubeURL,
                twitch_url: twitchURL,
                donation_share_ratio: donationRatio,
                donation_target_id: donationTarget
            }
        });        
      }
      alert('アカウント作成に成功しました。ログインしてください')
      router.push('/login');
    } catch (error: unknown) {
      console.error('❌ サインアップ失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const {donationTargets} = useDonationTargets();


  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              ユーザー名
            </label>
            <input
              id="name"
              type="name"
              placeholder="ユーザー名を入力"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
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

          {activeTab === 'streamer' && (
            <>
            <div>
              <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-700 mb-1">
                YoutubeURL
              </label>
              <input
                id="youtube_url"
                placeholder="あなたのYoutubeチャンネルのURLを入力"
                value={youtubeURL}
                onChange={(e) => setYoutubeURL(e.target.value)}
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
               />
            </div>
            <div>
              <label htmlFor="twitch_url" className="block text-sm font-medium text-gray-700 mb-1">
                twitchURL
              </label>
              <input
                id="twitch_url"
                placeholder="あなたのtwitchチャンネルのURLを入力"
                value={twitchURL}
                onChange={(e) => settwichURL(e.target.value)}
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
               />
            </div>
            <div>
              <label htmlFor="donation_share_ratio" className="block text-sm font-medium text-gray-700 mb-1">
                寄付比率
              </label>
              <input
                id="donation_share_ratio"
                placeholder="寄付比率を入力"
                value={donationRatio}
                onChange={(e) => setDonationRatio(e.target.value)}
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
               />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                寄付先
              </label>
              <select
                value={donationTarget}
                onChange={(e) => setDonationTarget(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">寄付先を選択</option>
                  {Array.isArray(donationTargets) &&
                    donationTargets.map((donesaki) => (
                      <option key={donesaki.id} value={donesaki.id}>
                        {donesaki.name}
                      </option>
                    ))}
              </select>
            </div>
            </>
          )}
          
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
                新規登録中...
              </div>
            ) : (
              activeTab === 'user' ? 'ユーザー' : '配信者'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}