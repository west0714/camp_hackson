'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import DonateButton from './DonateButton';
import { useUser } from '@/app/context/UserContext';
import axios from 'axios';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000');

type ChatMessage = {
  userName: string;
  comment: string;
  type?: 'chat' | 'donation';
  amount?: number;
  timestamp?: string;
};

export default function ChatBox({ streamerId, stream_id }: { streamerId: string; stream_id: string }) {
  const { userName, id, token } = useUser();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    socket.emit('join', streamerId);

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000'}/history/${streamerId}`);
        const history: ChatMessage[] = await res.json();
        setMessages(history);
      } catch (err) {
        console.error('履歴取得失敗:', err);
      }
    };

    fetchHistory();

    socket.on('chat:message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('chat:message');
      socket.emit('leave', streamerId);
    };
  }, [streamerId]);

  const saveMessageToAPI = async (message: { content: string; amount?: number }) => {
    if (!token || !id) return;
    try {
      await axios.post('https://geek-camp-hackason-back.onrender.com/api/v1/comments', {
        content: message.content,
        amount: message.amount || 0,
        viewer_id: Number(id),
        stream_id: Number(stream_id),
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      console.error('❌ API送信エラー:', error.response?.data || error.message);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !userName || !id) return;
    setIsLoading(true);

    const message = {
      streamerId,
      userName,
      comment: input,
      type: 'chat'
    };

    socket.emit('chat:message', message);

    await saveMessageToAPI({ content: input });

    setInput('');
    setIsLoading(false);
  };

  const sendDonationMessage = async (donationData: { amount: number; comment: string }) => {
    const message = {
      streamerId,
      userName,
      comment: donationData.comment,
      type: 'donation',
      amount: donationData.amount
    };

    socket.emit('chat:message', message);

    await saveMessageToAPI({
      content: donationData.comment,
      amount: donationData.amount
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  if (!userName) {
    return (
      <div className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">チャット読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">チャット</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-3" style={{ maxHeight: '450px' }}>
        {messages.map((msg, index) => (
          <div key={index} className={`${msg.type === 'donation' ? 'bg-yellow-50 border border-yellow-200 rounded-lg p-3' : ''}`}>
            <div className="flex items-start space-x-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-sm text-gray-900">{msg.userName}</span>
                  {msg.type === 'donation' && (
                    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      ¥{(msg.amount ?? 0).toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700">{msg.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="メッセージを入力..."
          className="flex-1 rounded px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? '送信中...' : '送信'}
        </button>
      </div>

      <div className="px-4 py-2 flex items-center">
        <DonateButton streamerId={streamerId} onDonationSuccess={sendDonationMessage} />
      </div>
    </div>
  );
}