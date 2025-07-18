'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-green-700">
          DonaCheer
        </Link>

        <nav className="flex items-center space-x-4">
          {status === 'loading' ? (
            <span>Loading...</span>
          ) : session ? (
            <>
              <Link href="/" className="text-gray-700 hover:text-green-600">ホーム</Link>
              <Link href="/streamers" className="text-gray-700 hover:text-green-600">配信者一覧</Link>
              <Link href="/mypage" className="text-gray-700 hover:text-green-600">マイページ</Link>
              <button
                onClick={() => signOut()}
                className="text-gray-700 hover:text-green-600"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}