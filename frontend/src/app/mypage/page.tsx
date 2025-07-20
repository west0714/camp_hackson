'use client';

import useSWR from 'swr';
import axios from 'axios';
import { useUser } from '@/app/context/UserContext';

export default function MyPage() {
  const { id, userName, token } = useUser();

  // 認証付きfetcher
  const fetcher = (url: string) =>
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => res.data);

  const { data, error, isLoading } = useSWR(
    id && token ? [`https://geek-camp-hackason-back.onrender.com/api/v1/get_comment_history?viewer_id=${id}`, token] : null,
    ([url]) => fetcher(url)
  );

  // 金額1円以上、最新10件だけ
  const filtered = (data || []).filter((item: any) => item.amount > 0).slice(0, 10);

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

  if (error) {
    return (
      <main className="min-h-screen bg-white p-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-red-600">エラーが発生しました</div>
        </div>
      </main>
    );
  }

  if (!id) {
    return null; // リダイレクト中
  }

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">マイページ</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">プロフィール</h2>
          <div className="space-y-2">
            <p><strong>ID:</strong> {id}</p>
            <p><strong>ユーザー名：</strong>{userName}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">投げ銭履歴（最新10件）</h2>
          {filtered.length === 0 ? (
            <p className="text-gray-600">まだ投げ銭履歴はありません。</p>
          ) : (
            <ul>
              {filtered.map((item: any, idx: number) => (
                <li key={idx} className="border-b py-2">
                  <div>内容: {item.content}</div>
                  <div>金額: <span className="font-bold text-green-700">¥{item.amount}</span></div>
                  <div>配信名: {item.stream_name}</div>
                  <div>日付: {item.stream_date}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}