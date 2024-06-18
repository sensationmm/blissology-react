import { useState } from 'react';
import { createContext, useContext } from 'react';

interface AuthContextInterface {
  isLoggedIn: boolean;
  token: string;
  setToken: (value: string) => void;
}

type AuthProviderType = {
  children: JSX.Element;
};

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderType> = ({ children }) => {
  const [token, setToken] = useState<string>('');

  const isLoggedIn = !!token;

  return <AuthContext.Provider value={{ isLoggedIn, token, setToken }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
