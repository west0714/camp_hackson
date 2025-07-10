'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
);

type Props = {
  amount: number;
  onSuccess: () => void;
};

export function PaymentForm({ amount, onSuccess }: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/create-payment-session', {
      method: 'POST',
      body: JSON.stringify({ amount: amount * 100 }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  if (!clientSecret) return <p>Loading...</p>;

  return (
    <Elements options={{ clientSecret }} stripe={stripePromise}>
      <Checkout onSuccess={onSuccess} />
    </Elements>
  );
}

function Checkout({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', // 埋め込み型ならリダイレクト不要
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
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? '処理中...' : '支払う'}
      </button>
    </form>
  );
}