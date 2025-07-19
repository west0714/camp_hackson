'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/app/context/UserContext';
import axios from 'axios';

export default function HomePage() {
  const { id, isLoading } = useUser();
  const router = useRouter();

  // 全体の寄付金額取得
  const [totalDonations, setTotalDonations] = useState<number>(0);
  useEffect(() => {
    const fetchTotalDonations = async () => {
      try {
        const res = await axios.get('https://geek-camp-hackason-back.onrender.com/api/v1/get_donations_amount');
        setTotalDonations(res.data?.amount || 0);
      } catch (e) {
        setTotalDonations(0);
      }
    };
    fetchTotalDonations();
  }, []);

  useEffect(() => {
    if (!isLoading && !id) {
      router.push('/login');
    }
  }, [id, isLoading, router]);

  //全体の寄付金額をAPIで取得
  

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </main>
    );
  }

  if (!id) {
    return null; // リダイレクト中
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          配信者を応援しよう
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          お気に入りの配信者に投げ銭で応援の気持ちを伝えましょう
        </p>
        <Link href="/streamers" className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">配信者を探す</Link>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">¥{totalDonations.toLocaleString()}</div>
          <div className="text-gray-600">総投げ銭額</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">89,012</div>
          <div className="text-gray-600">応援メッセージ数</div>
        </div>
      </div>

      {/* 機能紹介 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">簡単投げ銭</h3>
          <p className="text-gray-600">クレジットカードで簡単に投げ銭ができます</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">リアルタイムチャット</h3>
          <p className="text-gray-600">配信者とリアルタイムでやり取りできます</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">投げ銭ランキング</h3>
          <p className="text-gray-600">人気配信者や投げ銭額をランキングで確認</p>
        </div>
      </div>
    </main>
  );
}