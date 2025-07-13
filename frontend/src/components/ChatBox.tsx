'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import DonateButton from './DonateButton';
import { useUser } from '@/app/context/UserContext';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000'); // ローカル開発用

type ChatMessage = {
  userName: string;
  comment: string;
  type?: 'chat' | 'donation';
  amount?: number; // 投げ銭の場合のみ
};

export default function ChatBox({ streamerId }: { streamerId: string }) {
  const { userName } = useUser();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    socket.emit('join', streamerId);

    socket.on('chat:message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chat:message');
    };
  }, [streamerId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit('chat:message', {
      streamerId,
      userName,
      comment: input,
      type: 'chat',
    });
    setInput('');
  };

  const addDonationMessage = (donationData: { userName: string; amount: number; comment: string }) => {
    socket.emit('chat:message', {
      streamerId,
      userName: donationData.userName,
      amount: donationData.amount,
      comment: donationData.comment,
      type: 'donation',
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">チャット</h2>
      </div>

        {/* メッセージ表示エリア */}
        <div className="h-64 overflow-y-auto rounded p-3 mb-3 bg-white flex flex-col-reverse gap-y-3">
          {messages.slice().reverse().map((msg, index) => (
            <div key={index} className={` ${msg.type === 'donation' ? 'bg-yellow-50 border border-yellow-200 rounded-lg p-3' : ''}`}>
              <div className="flex items-start space-x-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">{msg.userName}</span>
                    {msg.type === 'donation' && (
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                        ¥{(msg.amount ?? 0).toLocaleString()}
                      </span>
                    )}
                  <p className="text-sm text-gray-700">{msg.comment}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      {/* メッセージ入力エリア */}
      <div className="p-4 border-t border-gray-200 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="メッセージを入力..."
          className="flex-1 rounded px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button 
          onClick={sendMessage} 
          disabled={!input.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
        >
          送信
        </button>

      </div>
      {/* 投げ銭ボタン */}
      <div className="px-4 py-2 flex items-center">
        <DonateButton streamerId={streamerId} onDonationSuccess={addDonationMessage} />
      </div>
    </div>
  );
}