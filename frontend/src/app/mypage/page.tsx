'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';

export default function MyPage() {
  const { id, isLoading } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !id) {
      router.push('/login');
    }
  }, [id, isLoading, router]);

  // ローディング中はローディング表示
  if (isLoading) {
    return (
      <main className="min-h-screen bg-white p-6">
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

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">マイページ</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">プロフィール</h2>
          <div className="space-y-2">
            <p><strong>ID:</strong> {id}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">投げ銭履歴</h2>
          <p className="text-gray-600">まだ投げ銭履歴はありません。</p>
        </div>
      </div>
    </main>
  );
}