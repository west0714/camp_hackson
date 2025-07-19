//DonateModal
'use client';

import { useState } from 'react';
import { PaymentForm } from './PaymentForm';

type DonationData = {
  amount: number;
  comment: string;
};

type Props = {
  streamer_id: string;
  onClose: () => void;
  onDonationSuccess?: (donationData: DonationData) => void;
};

export default function DonateModal({ streamer_id, onClose, onDonationSuccess }: Props) {
  const [amount, setAmount] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 金額テンプレート
  const presetAmounts = [100, 300, 500, 1000, 2000, 5000];

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAmount(value);
  };

  const handlePaymentSuccess = () => {
    setIsSuccess(true);
    
    // 支払い成功時のコールバックを呼び出し
    if (onDonationSuccess) {
      onDonationSuccess({
        amount: amount,
        comment: comment,
      });
    }
  };

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
              
              {/* 金額選択 */}
              <div className="mb-6">
                <label className="block mb-3 text-sm text-gray-600">金額を選択</label>
                
                {/* キリの良い金額テンプレート */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {presetAmounts.map((presetAmount) => (
                    <button
                      key={presetAmount}
                      onClick={() => handleAmountSelect(presetAmount)}
                      className={`px-3 py-2 rounded border text-sm font-medium transition-colors ${
                        amount === presetAmount
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-green-500 hover:text-green-600'
                      }`}
                    >
                      ¥{presetAmount}
                    </button>
                  ))}
                </div>

                {/* カスタム金額入力 */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm text-gray-600">カスタム金額（円）</label>
                  <input
                    type="number"
                    min="100"
                    placeholder="例: 750"
                    className="w-full border rounded px-3 py-2"
                    value={amount === 0 ? '' : amount}
                    onChange={handleCustomAmountChange}
                  />
                </div>

              </div>

              {/* コメント入力 */}
              <div className="mb-6">
                <label className="block mb-2 text-sm text-gray-600">コメント（任意）</label>
                <textarea
                  placeholder="コメントを入力してください"
                  className="w-full border rounded px-3 py-2 h-20 resize-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <button
                onClick={() => amount > 0 ? setShowPaymentForm(true) : alert('金額を選択してください')}
                disabled={amount === 0}
                className="w-full bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {amount > 0 ? '決済画面に進む' : '金額を選択してください'}
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
              <PaymentForm 
                amount={amount} 
                comment={comment}  
                streamer_id={streamer_id} 
                onSuccess={handlePaymentSuccess} 
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}