import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { comment, amount, id, stream_id } = body;

    // バリデーション
    if (!comment || !id || !stream_id) {
      return NextResponse.json(
        { error: '必須パラメータが不足しています' },
        { status: 400 }
      );
    }

    // 外部APIに送信
    const apiUrl = 'https://geek-camp-hackason-back.onrender.com/api/v1/comments';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment,
        amount: amount || 0,
        id,
        stream_id,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('外部APIエラー:', response.status, errorData);
      return NextResponse.json(
        { error: `外部APIエラー: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('API送信成功:', result);

    return NextResponse.json({
      success: true,
      message: 'メッセージが正常に送信されました',
      data: result
    });

  } catch (error) {
    console.error('API送信エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 