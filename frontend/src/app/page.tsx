'use client';

import DonateButton from '@/components/DonateButton';

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">トップページ（仮）</h1>

      {/* 配信画面＋チャット 横並び */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* 配信映像（16:9） */}
        <section className="flex-1 aspect-[16/9] bg-black text-white flex items-center justify-center rounded">
          🎥 配信映像（仮）
        </section>

        {/* チャット欄 */}
        <section className="w-full md:w-1/3 bg-white border rounded p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">💬 チャット欄（仮）</h2>
          <div className="space-y-2">
            <p><strong>ユーザー1:</strong> ナイス！</p>
          </div>
        </section>
      </div>

      {/* 投げ銭ボタン */}
      <div className="flex justify-center">
        <DonateButton />
      </div>
    </main>
  );
}