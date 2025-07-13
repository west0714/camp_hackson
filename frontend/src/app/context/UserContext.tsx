import { createContext } from 'react';
import { useContext } from 'react';

type UserContextType = {
  userName: string;
  email: string;
};

export const UserContext = createContext<UserContextType | null>(null);
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}