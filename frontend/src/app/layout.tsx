import React from "react";
import './globals.css';
import Header from '@/components/Header';
import AuthProvider from '@/components/AuthProvider';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <Header />
          <main className="container mx-auto px-4 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}