'use client';

export default function DonationStatus({ totalDonations, totalAmount }: { totalDonations?: number, totalAmount?:number } = {}) {
  return (
    <div className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm p-4 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">寄付状況</h2>
      </div>
      
      {/* 合計金額 */}
      <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
        <p className="text-sm text-green-700">合計</p>
        <p className="text-2xl font-bold text-green-800">¥{totalAmount?.toLocaleString() || 0}</p>
      </div>
      <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
        <p className="text-sm text-green-700">寄付金額</p>
        <p className="text-2xl font-bold text-green-800">¥{totalDonations?.toLocaleString() || 0}</p>
      </div>
    </div>
  );
} 