'use client';

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl mb-4">ログインしてください</h1>
      <button
        onClick={() => signIn('google', { callbackUrl: '/' })} // ← ログイン後にホームへ戻す
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Googleでログイン
      </button>
    </main>
  );
}