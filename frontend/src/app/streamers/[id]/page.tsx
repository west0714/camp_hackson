'use client';
import ChatBox from '@/components/ChatBox';
import DonationStatus from '@/components/DonationStatus';
import { useUser } from '@/app/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Video from '@/components/Video';
import useSWR from 'swr';
import { authFetcher, createAuthSWRKey } from '@/lib/swr';
import axios from 'axios';
import { useDonationTargets } from '@/hooks/useDonationTargets';

// 型定義: window.Twitch を追加
declare global {
  interface Window {
    Twitch?: any;
  }
}

type Stream = {
  id: number;
  title: string | null;
  status: string | null;
  streamer_id: number;
  created_at: string; 
  updated_at: string;
  stream_url:string;
}

// 一覧ページの配信者型定義
type Streamer = {
  id: number;
  name: string;
  email: string;
  youtube_url: string | null;
  twitch_url: string | null;
  donation_share_ratio: number;
  donation_target_id: number;
  created_at: string;
  updated_at: string;
};

// Videoコンポーネント用の型定義
type VideoParams = {
  id: string;
  stream_id: string;
  name: string;
  streamTitle: string;
  videoUrl?: string;
};


export default function StreamerPage({ params }: { params: Promise<{ id: string }> }) {
  const [streamerId, setStreamerId] = useState<string>('');
  const { id, token, isLoading } = useUser();
  const router = useRouter();
  
  // 寄付先データを取得（常に呼び出す）
  const { donationTargets } = useDonationTargets();
  
  // 個人の寄付金額取得用
  const [totalDonations, setTotalDonations] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  
  // 認証付きfetcher

  const fetcher = (url: string) =>
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => res.data);

  // 
  const { data: DonationGet } = useSWR(
    streamerId && token ? [`https://geek-camp-hackason-back.onrender.com/api/v1/get_donations_amount?streamer_id=${streamerId}`, token] : null,
    ([url]) => fetcher(url),
    {
      refreshInterval: 5000, // 5秒ごとに自動更新
      revalidateOnFocus: true, // フォーカス時に再検証
      revalidateOnReconnect: true, // 再接続時に再検証
    }
  )
  console.log("DonationGet:", DonationGet)
  console.log("streamerId:", streamerId)

  // DonationGetが変更された時に状態を更新
  useEffect(() => {
    if (DonationGet) {
      console.log("Updating donation amounts:", DonationGet);
      setTotalDonations(DonationGet.total_donation || 0);
      setTotalAmount(DonationGet.total_amount || 0);
    }
  }, [DonationGet]);

  // paramsを非同期で取得
  useEffect(() => {
    params.then((resolvedParams) => {
      setStreamerId(resolvedParams.id);
    });
  }, [params]);

  //一覧ページのデータを再利用
  const { data: streamersList } = useSWR<Streamer[]>(
    createAuthSWRKey('https://geek-camp-hackason-back.onrender.com/api/v1/streamers', token),
    authFetcher
  );

  
  // streamer_idをAPIに投げてstream_idを取得
  const { data: streamIdData, error: streamIdError, isLoading: streamIdLoading } = useSWR<Stream[]>(
    streamerId && token 
      ? createAuthSWRKey(`https://geek-camp-hackason-back.onrender.com/api/v1/get_selected_streamers_stream?streamer_id=${streamerId}`, token)
      : null,
    authFetcher
  );
  console.log("getStream", streamIdData)
  console.log("url",streamIdData?.[0]?.stream_url)

  useEffect(() => {
    if (!isLoading && !id) {
      router.push('/login');
    }
  }, [id, isLoading, router]);

  // ローディング中はローディング表示
  if (isLoading || !streamerId || streamIdLoading) {
    return (
      <main className="min-h-screen bg-white p-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      </main>
    );
  }

  // 未ログイン時は何も表示しない（リダイレクト中）
  if (!id) {
    return null;
  }

  // stream_id取得エラー時の表示
  if (streamIdError) {
    return (
      <main className="min-h-screen bg-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">エラーが発生しました</h2>
            <p className="text-red-700">配信IDの取得に失敗しました。</p>
            <p className="text-sm text-red-600 mt-2">エラー詳細: {streamIdError.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              再読み込み
            </button>
          </div>
        </div>
      </main>
    );
  }

  // 一覧データから該当する配信者を検索
  const streamerFromList = streamersList?.find(s => s.id.toString() === streamerId);


  // 配信者が見つからない場合のエラー表示
  if (!streamerFromList) {
    return (
      <main className="min-h-screen bg-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">配信者が見つかりません</h2>
            <p className="text-red-700">指定された配信者ID: {streamerId} の情報が見つかりませんでした。</p>
            <button 
              onClick={() => router.push('/streamers')} 
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              配信者一覧に戻る
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Videoコンポーネント用のデータを作成
  const videoParams: VideoParams = {
    id: streamerId,
    stream_id: streamIdData?.[0]?.id?.toString() || streamerId, // Stream.idをstream_idとして使用
    name: streamerFromList.name,
    streamTitle: streamIdData?.[0]?.title || "新作RPGを初見プレイ！一緒に冒険しよう",
    videoUrl: streamIdData?.[0]?.stream_url || "",
  };

  // 配信者情報を表示する部分で、donation_target_idをnameに変換
  const getDonationTargetName = (targetId: number) => {
    if (!donationTargets || !Array.isArray(donationTargets)) return '';
    const target = donationTargets.find(t => t.id === targetId);
    return target ? target.name : '';
  };

  return (
    <main className="min-h-screen bg-white p-6">

      {/* 配信者情報（ページ上部・幅揃える） */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{streamerFromList.name}</h1>
            <p className='text-xl pt-2'>{streamIdData?.[0]?.title}</p>
            <p>{getDonationTargetName(streamerFromList.donation_target_id)}</p>
          </div>
        </div>
      </div>

      {/* メインコンテンツ：2カラムレイアウト */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 左カラム（2/3幅） */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
            <Video params={videoParams} />
          </div>
          <DonationStatus totalDonations={totalDonations} totalAmount={totalAmount} />
        </div>
        {/* 右カラム（1/3幅） */}
        <div className='h-full flex flex-col'>
          <ChatBox streamerId={streamerId} stream_id={videoParams.stream_id} />
        </div>

      </div>

    </main>
  );
} 