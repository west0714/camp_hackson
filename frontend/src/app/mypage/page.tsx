import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type Donation = {
  streamerId: string;
  amount: number;
  comment: string;
  date: string;
};

const donations: Donation[] = [
      { streamerId: 'Streamer A', amount: 1000, comment: '応援してます！', date: '2025-07-10' },
      { streamerId: 'Streamer B', amount: 300, comment: '少しですが...', date: '2025-07-09' },
];

export default async function MyPage() {
  const session = await getServerSession(authOptions);

  // 金額の合計
  const totalDonations = donations.reduce((acc, donation) => acc + donation.amount, 0);

  if (!session) {
    redirect('/login');
  }  

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">マイページ</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">ユーザー情報</h2>
        <p><strong>名前：</strong> {session.user?.name}</p>
        <p><strong>メール：</strong> {session.user?.email}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">寄付履歴</h2>
        <p className="mb-4"><strong>総寄付額：</strong> ¥{totalDonations.toLocaleString()}</p>
        {donations.length === 0 ? (
          <p>寄付履歴がありません。</p>
        ) : (
          <ul className="space-y-3">
            {donations.map((donation, idx) => (
              <li key={idx} className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                <p><strong>配信者:</strong> {donation.streamerId}</p>
                <p><strong>金額:</strong> ¥{donation.amount.toLocaleString()}</p>
                <p><strong>コメント:</strong> {donation.comment}</p>
                <p className="text-sm text-gray-500">{donation.date}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}