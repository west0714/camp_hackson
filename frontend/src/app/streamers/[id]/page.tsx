'use client';

import ChatBox from '@/components/ChatBox';
import DonationStatus from '@/components/DonationStatus';
import { use } from 'react';


export default function StreamerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const streamerId = resolvedParams.id;
  
  return (
    <main className="min-h-screen bg-white p-6">
      {/* 配信者情報の表示 */}
      <div className="max-w-4xl mx-auto mb-6">
          <h1 className="text-3xl font-bold mb-6 text-center">ここに配信者情報を表示</h1>
      </div>

      {/* チャット欄と寄付状況を横並びに配置 */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 寄付状況 */}
          <DonationStatus />
          
          {/* チャット欄 */}
          <ChatBox streamerId={streamerId} />
        </div>
      </div>
    </main>
  );
} 