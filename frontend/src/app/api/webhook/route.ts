import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Webhook verification failed:', message);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const userId = paymentIntent.metadata?.user_id || 'unknown';
    const amount = paymentIntent.amount; // 単位は「円 × 100」

    console.log(`✅ 支払い成功：ユーザー=${userId}、金額=${amount / 100}円`);

    /* // ここで外部APIに支払い情報を送信
    const res = await fetch('https://example.com/api/receive-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        amount: amount,
        stripe_id: paymentIntent.id,
      }),
    });
    console.log('📡 外部APIに送信ステータス:', res.status);*/

  }

  return NextResponse.json({ received: true });
}