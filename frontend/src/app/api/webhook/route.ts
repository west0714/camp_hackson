import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text(); // ← raw body
  const signature = req.headers.get('stripe-signature'); // ← 修正

  if (!signature) {
    return new NextResponse('Missing Stripe signature header', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('❌ Webhook verification failed:', message);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  // ✅ イベント処理
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const userId = paymentIntent.metadata?.user_id || 'unknown';
    const streamerId = paymentIntent.metadata?.streamer_id || 'unknown';
    const amount = paymentIntent.amount;
    const comment = paymentIntent.metadata?.comment || '';

    console.log(`✅ 支払い成功：ユーザー=${userId}、金額=${amount / 100}円、コメント=${comment}`);
  }

  return NextResponse.json({ received: true });
}