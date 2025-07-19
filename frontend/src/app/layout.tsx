import React from "react";
import './globals.css';
import Header from '@/components/Header';
import { UserProvider } from '@/app/context/UserContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <UserProvider>
          <Header />
          <main className="container mx-auto px-4 py-6">{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}