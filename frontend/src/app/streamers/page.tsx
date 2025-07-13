import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import Link from 'next/link';

//配信者の仮データ
const dummyStreamers = [
  { id: '1', name: '配信者A', category: 'ゲーム' },
  { id: '2', name: '配信者B', category: '雑談' },
];

export default async function StreamersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); // 未ログインならログインページへ
  }

  return (
    <main className="min-h-screen p-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">配信者一覧</h1>
      <p className="text-gray-600">お気に入りの配信者を見つけて応援しよう！</p>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {dummyStreamers.map((streamer) => (
          <li
            key={streamer.id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-2">{streamer.name}</h3>
            <p className="text-sm text-gray-500 mb-2">カテゴリ: {streamer.category}</p>
            <Link
              href={`/streamers/${streamer.id}`}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-center block font-medium"
            >
              配信ページへ
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}