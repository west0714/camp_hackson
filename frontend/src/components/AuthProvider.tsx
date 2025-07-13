'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { UserContext } from '@/app/context/UserContext';
import { useSession } from 'next-auth/react';

function UserContextProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  return (
    <UserContext.Provider
      value={{
        userName: session?.user?.name || '',
        email: session?.user?.email || '',
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <UserContextProvider>
        {children}
      </UserContextProvider>
    </SessionProvider>
  );
}