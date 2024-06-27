import { createContext, useContext } from 'react';

interface AuthContextInterface {
  isLoggedIn: boolean;
  userID: string | undefined;
  setUserID: (value: AuthContextInterface['userID']) => void;
  accountName: string | undefined;
  setAccountName: (value: AuthContextInterface['accountName']) => void;
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }

  return context;
};

export default AuthContext;
