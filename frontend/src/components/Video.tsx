'use client';
import { useState, useEffect } from "react";

type VideoProps = {
  params: {
    id: string;
    stream_id: string;
    name?: string;
    streamTitle?: string;
    videoUrl?: string;
  };
};

export default function Video({ params }: VideoProps) {
  const [videoUrl, setVideoUrl] = useState("");
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [twitchPlayer, setTwitchPlayer] = useState<any>(null);

  const handleVideoUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (videoUrl.trim()) {
      // 動画URL更新処理（実際はAPIに送信）
      console.log("動画URL更新:", videoUrl);
      setShowVideoInput(false);
    }
  };

  // URLからプラットフォームとチャンネル情報を取得
  const getVideoInfo = (url: string | undefined) => {
    if (!url)
      return { platform: "none", channel: null, embedUrl: params.videoUrl };

    // YouTube URLの判定と変換
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1].split("&")[0];
      return {
        platform: "youtube",
        channel: null,
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`,
      };
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return {
        platform: "youtube",
        channel: null,
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`,
      };
    }
    if (url.includes("youtube.com/live/")) {
      const videoId = url.split("live/")[1].split("?")[0];
      return {
        platform: "youtube",
        channel: null,
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`,
      };
    }

    // Twitch URLの判定とチャンネル名取得
    if (url.includes("twitch.tv/")) {
      const pathParts = url.split("twitch.tv/")[1].split("/");
      const channel = pathParts[0];
      return {
        platform: "twitch",
        channel: channel,
        embedUrl: url,
      };
    }

    // その他の場合
    return {
      platform: "other",
      channel: null,
      embedUrl: url,
    };
  };

  // Twitchプレイヤーを初期化
  const initializeTwitchPlayer = (channel: string) => {
    // 既存のプレイヤーを削除
    if (twitchPlayer) {
      try {
        twitchPlayer.destroy();
      } catch (error) {
        console.log("プレイヤー削除エラー:", error);
      }
    }

    // Twitch埋め込みスクリプトが読み込まれているかチェック
    if (
      typeof window !== "undefined" &&
      window.Twitch &&
      window.Twitch.Player
    ) {
      try {
        const player = new window.Twitch.Player("twitch-embed", {
          channel: channel,
          width: "100%",
          height: "100%",
          autoplay: false,
          muted: true,
        });
        setTwitchPlayer(player);
        console.log("Twitchプレイヤー初期化完了:", channel);
      } catch (error) {
        console.error("Twitchプレイヤー初期化エラー:", error);
      }
    } else {
      console.log("Twitch埋め込みスクリプトが読み込まれていません");
    }
  };

  // Twitch埋め込みスクリプトを動的に読み込み
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Twitch) {
      const script = document.createElement("script");
      script.src = "https://player.twitch.tv/js/embed/v1.js";
      script.async = true;
      script.onload = () => {
        console.log("Twitch埋め込みスクリプト読み込み完了");
      };
      document.head.appendChild(script);
    }
  }, []);

  // YouTube URLをembed形式に変換（後方互換性のため残す）
  const convertToEmbedUrl = (url: string) => {
    const videoInfo = getVideoInfo(url);
    return videoInfo.embedUrl || url;
  };



  return (
    <div className="w-full h-full relative"> {/* 親要素のサイズにフィットするように変更 */}
      {videoUrl || params.videoUrl ? (
        <div className="w-full h-full relative">
          {(() => {
            const currentUrl = videoUrl || params.videoUrl;
            const videoInfo = getVideoInfo(currentUrl);
            console.log("URL:",`https://player.twitch.tv/?channel=${videoInfo.channel}&parent=localhost`)
            if (videoInfo.platform === "twitch") {
              return (
                <>
                  {/* Twitch埋め込み用のdiv */}
                  <div
                    id="twitch-embed"
                    className="w-full h-full"
                  ></div>

                  {/* Twitchロード中の表示 */}
                  {!twitchPlayer && (
                    <div className="absolute inset-0 flex items-center justify-center bg-purple-900 bg-opacity-75">
                      <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                        <p className="text-sm">
                          Twitchプレイヤーを読み込み中...
                        </p>
                        <p className="text-xs text-purple-200 mt-1">
                          チャンネル: {videoInfo.channel}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              );
            } else {
              // YouTube または その他の動画
              return (
                <iframe
                  src={`https://player.twitch.tv/?channel=${videoInfo.channel}&parent=localhost`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title="配信動画"
                  referrerPolicy="strict-origin-when-cross-origin"
                  onError={() => console.error("iframe読み込みエラー")}
                />
              );
            }
          })()}

          {/* デバッグ情報 */}
          <div className="absolute top-2 right-2">
            <button
              onClick={() => setShowDebugInfo(!showDebugInfo)}
              className="bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded"
            >
              Debug
            </button>
          </div>

          {showDebugInfo && (
            <div className="absolute top-8 right-2 bg-gray-900 bg-opacity-90 text-white text-xs p-3 rounded max-w-sm z-10">
              {(() => {
                const currentUrl = videoUrl || params.videoUrl;
                const videoInfo = getVideoInfo(currentUrl);

                return (
                  <>
                    <div className="mb-2">
                      <strong>プラットフォーム:</strong>
                      <div
                        className={`inline-block ml-2 px-2 py-1 rounded text-xs ${
                          videoInfo.platform === "twitch"
                            ? "bg-purple-600"
                            : videoInfo.platform === "youtube"
                              ? "bg-red-600"
                              : "bg-gray-600"
                        }`}
                      >
                        {videoInfo.platform.toUpperCase()}
                      </div>
                    </div>
                    <div className="mb-2">
                      <strong>元URL:</strong>
                      <div className="break-all">{currentUrl}</div>
                    </div>
                    {videoInfo.platform === "twitch" ? (
                      <div className="mb-2">
                        <strong>チャンネル:</strong>
                        <div>{videoInfo.channel}</div>
                      </div>
                    ) : (
                      <div className="mb-2">
                        <strong>埋め込みURL:</strong>
                        <div className="break-all">
                          {videoInfo.embedUrl}
                        </div>
                      </div>
                    )}
                    <div className="mb-2">
                      <strong>現在のドメイン:</strong>
                      <div>
                        {typeof window !== "undefined"
                          ? window.location.hostname
                          : "サーバー側"}
                      </div>
                    </div>
                    {videoInfo.platform === "twitch" && (
                      <div className="mt-2 p-2 bg-purple-800 rounded">
                        <div className="text-yellow-300 mb-1">
                          Twitch情報:
                        </div>
                        <div className="text-xs">
                          プレイヤー状態:{" "}
                          {twitchPlayer ? "初期化済み" : "未初期化"}
                        </div>
                        <div className="text-xs">
                          スクリプト:{" "}
                          {typeof window !== "undefined" &&
                          window.Twitch
                            ? "読み込み済み"
                            : "読み込み中"}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white">
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-400">動画URLを設定してください</p>
            <button
              onClick={() => setShowVideoInput(true)}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              動画を設定
            </button>
          </div>
        </div>
      )}
      {(videoUrl || params.videoUrl)?.includes("twitch.tv") && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-6"> {/* mt-6 を追加して動画との間にスペースを確保 */}
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h4 className="font-medium text-purple-900 mb-2">
                Twitchが映らない場合の対処法
              </h4>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <h5 className="font-medium text-red-800 mb-2">
                  🔒 埋め込み制限エラーが発生中
                </h5>
                <p className="text-sm text-red-700">
                  このチャンネルは埋め込みが制限されています。以下の方法をお試しください。
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <h5 className="font-medium text-purple-900 mb-2">
                    📱 配信者の方へ - 埋め込み許可設定
                  </h5>
                  <ol className="text-sm text-purple-800 space-y-1 list-decimal list-inside">
                    <li>Twitchのクリエイターダッシュボードにログイン</li>
                    <li>「設定」→「チャンネル」→「配信」を選択</li>
                    <li>
                      「埋め込みチャット」と「埋め込み配信」を
                      <strong>有効</strong>にする
                    </li>
                    <li>「すべてのドメインを許可」を選択</li>
                    <li>変更を保存してページを再読み込み</li>
                  </ol>
                </div>

                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <h5 className="font-medium text-purple-900 mb-2">
                    👥 視聴者の方へ - その他の方法
                  </h5>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• 配信者がオフラインの可能性があります</li>
                    <li>• 配信者に埋め込み許可を依頼してみてください</li>
                    <li>• Twitchで直接視聴することをお勧めします</li>
                    <li>• しばらく時間をおいてから再度お試しください</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <a
                  href={`https://www.twitch.tv/${
                    ((videoUrl || params.videoUrl) ?? "")
                      .split("twitch.tv/")[1]
                      ?.split("/")[0]
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1 rounded"
                >
                  Twitchで直接見る
                </a>
                <a
                  href="https://dashboard.twitch.tv/settings/channel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-100 hover:bg-purple-200 text-purple-800 text-sm px-3 py-1 rounded border border-purple-300"
                >
                  Twitch設定ページ
                </a>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded border border-gray-300"
                >
                  ページを再読み込み
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}