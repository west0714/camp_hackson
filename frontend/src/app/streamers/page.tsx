import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';

//配信者の仮データ
const dummyStreamers = [
  { id: '1', name: '配信者A', category: 'ゲーム' },
  { id: '2', name: '配信者B', category: '雑談' },
];

export default async function StreamersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }  
  return (
    <main className="min-h-screen p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">配信者一覧</h1>
        <p className="text-gray-600">お気に入りの配信者を見つけて応援しよう！</p>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dummyStreamers.map((streamer) => (
          <li
            key={streamer.id}
            className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold">{streamer.name}</h3>
            <p className="mt-2 text-sm text-gray-500">カテゴリ: {streamer.category}</p>
            <Link 
                href={`/streamers/${streamer.id}`}
                className="mt-4 inline-block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
            >
              配信ページへ
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}