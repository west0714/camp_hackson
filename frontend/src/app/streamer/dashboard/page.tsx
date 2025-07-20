"use client";
import { useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from 'swr';
import axios from 'axios';
import Link from 'next/link';

export default function StreamerDashboard() {
  const { id, userName, isLoading, token } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !id) {
      router.push('/login');
    }
  }, [id, isLoading, router]);

  // 認証付きfetcher
  const fetcher = (url: string) =>
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => res.data);

  // 配信ステータスを取得?? live中だと返ってくる？
  const { data, error } = useSWR(
    id && token ? [`https://geek-camp-hackason-back.onrender.com/api/v1/streams?streamer_id=${id}`, token] : null,
    ([url]) => fetcher(url)
  );
  console.log("配信ステータス：",data)
  const countStream = data?.length - 1
  const StreamID = data?.[countStream]?.id
  console.log("id:", StreamID)
  console.log("配信ステータスエラー：",error)

  const [isLive, setIsLive] = useState(data?.[countStream]?.status || "ended");
  const [streamUrl, setStreamUrl] = useState("");
  const [streamTitle, setStreamTitle] = useState("");
  const [streamDescription, setStreamDescription] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  // dataが更新されたときにisLiveも更新
  useEffect(() => {
    if (data?.[countStream]?.status) {
      setIsLive(data[countStream].status);
    }
    console.log("Live:", isLive)
  }, [data]);


  // 個人の寄付金額取得用
  const [totalDonations, setTotalDonations] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    if (!id) return;
    const fetchTotalDonations = async () => {
      try {
        const res = await axios.get(`https://geek-camp-hackason-back.onrender.com/api/v1/get_donations_amount?streamer_id=${id}`,{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setTotalDonations(res.data?.total_donation || 0);
        setTotalAmount(res.data?.total_amount || 0);
      } catch (e) {
        setTotalDonations(0);
        setTotalAmount(0);
      }
    };
    console.log(totalDonations)
    fetchTotalDonations();
  }, [id]);

  // URLからプラットフォーム情報を取得
  const getStreamPlatform = (url: string) => {
    if (!url) return { platform: "none", channel: null };
    
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return { platform: "youtube", channel: "YouTube" };
    }
    if (url.includes("twitch.tv")) {
      const channel = url.split("twitch.tv/")[1]?.split("/")[0];
      return { platform: "twitch", channel: channel };
    }
    return { platform: "other", channel: "その他" };
  };

  const handleStartStream = async () => {
    if (!streamUrl.trim()) {
      alert("配信URLを入力してください");
      return;
    }
    if (!streamTitle.trim()) {
      alert("配信タイトルを入力してください");
      return;
    }
    //ストリーム情報を保存
    try {
      await axios.post('https://geek-camp-hackason-back.onrender.com/api/v1/streams', {
        title:streamTitle,
        description: streamDescription,
        stream_url: streamUrl,
        streamer_id: id,
        status: "live"
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error(error.response?.data);
      } else {
        console.error('Unknown error');
    }}
    setIsLive("live");
    setShowUrlInput(false);
  };

  const handleStopStream = async () => {
    // 配信状態を変更
    try {
      await axios.patch(`https://geek-camp-hackason-back.onrender.com/api/v1/streams/${StreamID}`, {
        status: "ended"
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
          console.error(error.response?.data);
      } else {
        console.error('Unknown error');
    }}
    console.log("配信停止");
    setIsLive("ended");
  };


  const platformInfo = getStreamPlatform(streamUrl);


  return (
    <div className="min-h-screen bg-white">
      <header className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">配信者ダッシュボード</h1>
            </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 配信者情報 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{userName}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                isLive==="live" 
                  ? "bg-red-100 text-red-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  isLive==="live"  ? "bg-red-500" : "bg-gray-400"
                }`}></div>
                {isLive==="live"  ? "配信中" : "オフライン"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコントロール */}
          <div className="lg:col-span-2 space-y-6">
            {/* 配信コントロール */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">配信コントロール</h2>
              
              {isLive==="ended" ? (
                <div className="space-y-4">
                  {/* 配信タイトル */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      配信タイトル *
                    </label>
                    <input
                      type="text"
                      value={streamTitle}
                      onChange={(e) => setStreamTitle(e.target.value)}
                      placeholder="今日の配信タイトルを入力"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 説明 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      配信説明
                    </label>
                    <textarea
                      value={streamDescription}
                      onChange={(e) => setStreamDescription(e.target.value)}
                      placeholder="配信の内容や予定を説明"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 配信URL設定 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      配信URL *
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="url"
                        value={streamUrl}
                        onChange={(e) => setStreamUrl(e.target.value)}
                        placeholder="YouTube、Twitchなどの配信URLを入力"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm"
                      >
                        ヘルプ
                      </button>
                    </div>
                    
                    {streamUrl && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center text-sm">
                          <span className="text-gray-600 mr-2">プラットフォーム:</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            platformInfo.platform === "twitch" 
                              ? "bg-purple-100 text-purple-800"
                              : platformInfo.platform === "youtube"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {platformInfo.platform.toUpperCase()}
                          </span>
                          {platformInfo.channel && (
                            <>
                              <span className="text-gray-600 ml-4 mr-2">チャンネル:</span>
                              <span className="font-medium">{platformInfo.channel}</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* URL入力ヘルプ */}
                  {showUrlInput && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-3">配信URL設定ガイド</h4>
                      <div className="space-y-3 text-sm text-blue-800">
                        <div>
                          <strong>YouTube Live:</strong>
                          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                            <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
                            <li>https://youtu.be/VIDEO_ID</li>
                            <li>https://www.youtube.com/live/VIDEO_ID</li>
                          </ul>
                        </div>
                        <div>
                          <strong>Twitch:</strong>
                          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                            <li>https://www.twitch.tv/YOUR_CHANNEL_NAME</li>
                          </ul>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-3">
                          <strong className="text-yellow-800">⚠️ Twitchをご利用の場合:</strong>
                          <p className="text-yellow-700 text-xs mt-1">
                            埋め込み表示のため、Twitchの設定で「埋め込み配信」と「埋め込みチャット」を有効にしてください。
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 配信開始ボタン */}
                  <button
                    onClick={handleStartStream}
                    disabled={!streamUrl.trim() || !streamTitle.trim()}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg text-lg"
                  >
                    配信開始
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mr-3"></div>
                      <span className="text-lg font-semibold text-red-800">配信中</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{streamTitle}</h3>
                    {streamDescription && (
                      <p className="text-gray-700 text-sm">{streamDescription}</p>
                    )}
                  </div>

                  <button
                    onClick={handleStopStream}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg text-lg"
                  >
                    配信終了
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* クイック統計 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">統計</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">総投げ銭</span>
                  <span className="font-semibold">¥{totalAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">総寄付金額</span>
                  <span className="font-semibold text-green-600">¥{totalDonations}</span>
                </div>
              </div>
            </div>

            {/* クイックアクション */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h3>
              <div className="space-y-3">
                <Link
                  href={`/streamers/${id}`}
                  target="_blank"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium"
                >
                  配信ページを開く
                </Link>
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/streamers/${id}`)}
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-2 px-4 rounded-lg text-sm font-medium"
                >
                  配信URLをコピー
                </button>
                <Link
                  href="/streamers"
                  className="block w-full bg-green-100 hover:bg-green-200 text-green-800 text-center py-2 px-4 rounded-lg text-sm font-medium"
                >
                  配信者一覧を見る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}