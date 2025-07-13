'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useUser } from '@/app/context/UserContext';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
);

type Props = {
  streamer_id: string;
  amount: number;
  comment: string;
  onSuccess: () => void;
};

export function PaymentForm({ streamer_id, amount, comment, onSuccess }: Props) {
  const { userName } = useUser();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/create-payment-session', {
      method: 'POST',
      body: JSON.stringify({ 
        amount: amount * 100,
        comment: comment || '',
        user_id: userName || '',
        streamer_id: streamer_id || '',
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount, comment, userName, streamer_id]);

  if (!clientSecret) return <p>Loading...</p>;

  return (
    <Elements options={{ clientSecret }} stripe={stripePromise}>
      <Checkout streamer_id={streamer_id} amount={amount} onSuccess={onSuccess} />
    </Elements>
  );
}

function Checkout({ streamer_id, amount, onSuccess }: { streamer_id: string; amount: number; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', 
    });

    if (error) {
      alert(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(); // 💡 決済成功 → 表示切り替え
    }

    setLoading(false);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <PaymentElement />
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={!stripe || loading}
        className="w-full bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
      >
        {loading ? '処理中...' : `¥${amount.toLocaleString()} 支払う`}
      </button>
    </form>
  );
}