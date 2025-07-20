'use client';

import Link from 'next/link';
import { useUser } from '@/app/context/UserContext';

export default function Header() {
  const { id, userName, userType, isLoading, logout } = useUser();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-green-700">
          DonaCheer
        </Link>

        <nav className="flex items-center space-x-4">
          {isLoading ? (
            <span className="text-gray-500">Loading...</span>
          ) : id ? (
            <>
              <Link href="/" className="text-gray-700 hover:text-green-600">ホーム</Link>
              <Link href="/streamers" className="text-gray-700 hover:text-green-600">配信者一覧</Link>
              {userType === 'streamer' ? (
                <Link href="/streamer/dashboard" className="text-gray-700 hover:text-green-600">マイページ</Link>
              ) : (
                <Link href="/mypage" className="text-gray-700 hover:text-green-600">マイページ</Link>
              )}
              <span className="text-gray-600">
                {userName && userName !== 'Unknown User' ? (
                  `こんにちは、${userName}さん`
                ) : (
                  `${userType === 'streamer' ? '配信者' : 'ユーザー'} (ID: ${id})`
                )}
              </span>
              <button
                onClick={logout}
                className="text-gray-700 hover:text-green-600 px-3 py-1 rounded border border-gray-300 hover:border-green-600"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link href='/signup' className='text-gray-700 hover:text-green-600 px-3 py-1 rounded border border-gray-300 hover:border-green-600'>サインアップ</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}