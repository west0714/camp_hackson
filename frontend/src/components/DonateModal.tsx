//DonateModal
'use client';

import { useState } from 'react';
import { PaymentForm } from './PaymentForm';

type Props = {
  onClose: () => void;
};

export default function DonateModal({ onClose }: Props) {
  const [amount, setAmount] = useState<number>(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <>
      {/* 背景の黒半透明 */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* 右からスライドインするモーダル */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-lg overflow-y-auto transition-transform duration-300 transform translate-x-0"
      >
        <div className="relative h-full p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl"
          >
            ✕
          </button>

          {!showPaymentForm ? (
            <>
              <h2 className="text-xl font-semibold mb-4">投げ銭する</h2>
              <label className="block mb-2 text-sm text-gray-600">金額（円）</label>
              <input
                type="number"
                min="100"
                placeholder="例: 500"
                className="w-full border rounded px-3 py-2 mb-4"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <button
                onClick={() => amount > 0 ? setShowPaymentForm(true) : alert('金額を入力してください')}
                className="w-full bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
              >
                次へ（決済画面へ）
              </button>
            </>
          ) : isSuccess ? (
            <div className="text-center mt-16">
              <h2 className="text-xl font-bold text-green-600 mb-4">🎉 決済完了！</h2>
              <p className="text-gray-700 mb-4">応援ありがとうございます。</p>
              <button
                onClick={onClose}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                閉じる
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">支払い画面</h2>
              <PaymentForm amount={amount} onSuccess={() => setIsSuccess(true)} />
            </>
          )}
        </div>
      </div>
    </>
  );
}