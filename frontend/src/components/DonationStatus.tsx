'use client';

export default function DonationStatus() {
  // 仮データ　
  const donations = [
    { id: 1, name: 'ユーザーA', amount: 500, comment: '応援してます！'},
    { id: 2, name: 'ユーザーB', amount: 1000, comment: '配信楽しみにしてます'},
    { id: 3, name: 'ユーザーC', amount: 300, comment: 'お疲れ様です！'},
  ];

  const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);

  return (
    <div className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm p-4 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">寄付状況</h2>
      </div>
      
      {/* 合計金額 */}
      <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
        <p className="text-sm text-green-700">今日の合計</p>
        <p className="text-2xl font-bold text-green-800">¥{totalAmount.toLocaleString()}</p>
      </div>

    </div>
  );
} 