"use client";
import { useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StreamerDashboard() {
  // サンプルデータ（実際はAPIから取得）
  {/* 配信者情報 APIから取得 */}
  const streamerInfo = {
    id: "1",
    name: "田中ゲーマー",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
    followers: 15420,
    totalDonations: 234500,
    isLive: false,
  };
  const { id, isLoading } = useUser();
  const router = useRouter();
    
  useEffect(() => {
    if (!isLoading && !id) {
      router.push('/login');
    }
  }, [id, isLoading, router]);

  const [isLive, setIsLive] = useState(streamerInfo.isLive);
  const [streamUrl, setStreamUrl] = useState("");
  const [streamTitle, setStreamTitle] = useState("");
  const [streamCategory, setStreamCategory] = useState("");
  const [streamDescription, setStreamDescription] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

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

  const handleStartStream = () => {
    if (!streamUrl.trim()) {
      alert("配信URLを入力してください");
      return;
    }
    if (!streamTitle.trim()) {
      alert("配信タイトルを入力してください");
      return;
    }
    
    setIsLive(true);
    setShowUrlInput(false);
    // 実際はAPIに配信開始を通知
    console.log("配信開始:", { streamUrl, streamTitle, streamCategory, streamDescription });
  };

  const handleStopStream = () => {
    setIsLive(false);
    // 実際はAPIに配信停止を通知
    console.log("配信停止");
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
              <img
                src={streamerInfo.avatar}
                alt={streamerInfo.name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{streamerInfo.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span>{streamerInfo.followers.toLocaleString()} フォロワー</span>
                  <span>¥{streamerInfo.totalDonations.toLocaleString()} 総投げ銭</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                isLive 
                  ? "bg-red-100 text-red-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  isLive ? "bg-red-500" : "bg-gray-400"
                }`}></div>
                {isLive ? "配信中" : "オフライン"}
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
              
              {!isLive ? (
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

                  {/* カテゴリ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      カテゴリ
                    </label>
                    <select
                      value={streamCategory}
                      onChange={(e) => setStreamCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">カテゴリを選択</option>
                      <option value="ゲーム">ゲーム</option>
                      <option value="雑談">雑談</option>
                      <option value="音楽">音楽</option>
                      <option value="料理">料理</option>
                      <option value="勉強">勉強</option>
                      <option value="その他">その他</option>
                    </select>
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
                    {streamCategory && (
                      <p className="text-gray-600 mb-2">カテゴリ: {streamCategory}</p>
                    )}
                    {streamDescription && (
                      <p className="text-gray-700 text-sm">{streamDescription}</p>
                    )}
                  </div>

                  <button
                    onClick={handleStopStream}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg text-lg"
                  >
                    ⏹️ 配信終了
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
                  <span className="text-gray-600">フォロワー</span>
                  <span className="font-semibold">{streamerInfo.followers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">総投げ銭</span>
                  <span className="font-semibold text-green-600">¥{streamerInfo.totalDonations.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* クイックアクション */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h3>
              <div className="space-y-3">
                <a
                  href={`/streamers/${streamerInfo.id}`}
                  target="_blank"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium"
                >
                  配信ページを開く
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/streamers/${streamerInfo.id}`)}
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-2 px-4 rounded-lg text-sm font-medium"
                >
                  配信URLをコピー
                </button>
                <a
                  href="/streamers"
                  className="block w-full bg-green-100 hover:bg-green-200 text-green-800 text-center py-2 px-4 rounded-lg text-sm font-medium"
                >
                  配信者一覧を見る
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}