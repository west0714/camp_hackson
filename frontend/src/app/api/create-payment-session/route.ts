import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(req: Request) {
  const { amount, comment, user_id, streamer_id } = await req.json();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // ← 500円（単位：1円 = 100）
      currency: 'jpy',
      automatic_payment_methods: { enabled: true }, // 支払い方法自動対応
        metadata: {
            user_id: user_id || '', // ← ユーザーID
            streamer_id: streamer_id || '', // ← ストリーマーID
            comment: comment || '', // ← コメントを保存（空の場合は空文字）
        },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('[Stripe Error]', error);
    return new NextResponse('Failed to create PaymentIntent', { status: 500 });
  }
}