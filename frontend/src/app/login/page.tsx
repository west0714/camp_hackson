'use client';

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const { data: session } = useSession();

  if (session) {
    redirect("/"); // ログイン済みならホームへ
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-xs space-y-6 rounded bg-white p-8">
        <h1 className="text-2xl font-bold text-green-700 text-center">DonaCheer</h1>
        <p className="text-center">持っているアカウントでログイン</p>
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })} // ← ログイン後にホームへ戻す
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Googleでログイン
        </button>
        <button
          onClick={() => signIn('twitter', { callbackUrl: '/' })} // ← ログイン後にホームへ戻す
          className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900 mt-4"
        >
          Xでログイン
        </button>
      </div>
    </main>
  );
}