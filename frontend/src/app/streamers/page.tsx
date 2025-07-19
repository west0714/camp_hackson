'use client';
import React from 'react';
import Link from 'next/link';
import { useUser } from '@/app/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';
import { createAuthSWRKey, authFetcher } from '@/lib/swr';

type Streamer = {
  id: number;
  name: string;
  email: string;
  youtube_url: string | null;
  twitch_url: string | null;
  donation_share_ratio: number;
  created_at: string;
  updated_at: string;
};

export default function StreamersPage() {
  const { id, token, isLoading } = useUser();
  const router = useRouter();

  // 認証付きでSWRを使用
  const { data, error, mutate } = useSWR<Streamer[]>(
    createAuthSWRKey('https://geek-camp-hackason-back.onrender.com/api/v1/streamers', token),
    authFetcher,
    {
      // エラー時の処理
      onError: (err) => {
        console.error('SWR Error:', err);
        if (err.message.includes('認証エラー')) {
          router.push('/login');
        }
      },
    }
  );

  useEffect(() => {
    if (!isLoading && !id) {
      router.push('/login');
    }
  }, [id, isLoading, router]);

  // ローディング中はローディング表示
  if (isLoading) {
    return (
      <main className="min-h-screen p-6 bg-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      </main>
    );
  }

  // 未ログイン時は何も表示しない（リダイレクト中）
  if (!id) {
    return null;
  }

  // エラーが発生した場合
  if (error) {
    return (
      <main className="min-h-screen p-6 bg-white">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">配信者一覧</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4">
          <p className="font-medium">エラーが発生しました</p>
          <p className="text-sm mt-1">{error.message}</p>
          <button
            onClick={() => mutate()}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            再試行
          </button>
        </div>
      </main>
    );
  }

  // データ取得中
  if (!data) {
    return (
      <main className="min-h-screen p-6 bg-white">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">配信者一覧</h1>
        <p className="text-gray-600">お気に入りの配信者を見つけて応援しよう！</p>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto mb-2"></div>
            <p className="text-gray-500">配信者情報を読み込み中...</p>
          </div>
        </div>
      </main>
    );
  }

  // データが配列でない場合の処理
  const streamers = Array.isArray(data) ? data : [];

  return (
    <main className="min-h-screen p-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">配信者一覧</h1>
      <p className="text-gray-600">お気に入りの配信者を見つけて応援しよう！</p>

      {streamers.length === 0 ? (
        <div className="text-center mt-8">
          <p className="text-gray-500">現在登録されている配信者はいません。</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {streamers.map((streamer) => (
            <div
              key={streamer.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 mr-2">
                        {streamer.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">配信者ID: {streamer.id}</p>
                    {streamer.youtube_url && (
                      <p className="text-sm text-blue-600">
                        <a href={streamer.youtube_url} target="_blank" rel="noopener noreferrer">
                          YouTube
                        </a>
                      </p>
                    )}
                    {streamer.twitch_url && (
                      <p className="text-sm text-purple-600">
                        <a href={streamer.twitch_url} target="_blank" rel="noopener noreferrer">
                          Twitch
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                <Link
                  href={`/streamers/${streamer.id}`}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-center block font-medium"
                >
                  配信ページへ
                </Link>
              </div>
            </div>
          ))}
        </ul>
      )}
    </main>
  );
}