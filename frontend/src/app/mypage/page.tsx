import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { redirect } from 'next/navigation';

export default async function MyPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); // 未ログインならログインページへ
  }

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">マイページ</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">プロフィール</h2>
          <div className="space-y-2">
            <p><strong>名前:</strong> {session.user?.name}</p>
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