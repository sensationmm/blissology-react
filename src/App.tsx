import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { CircularProgress } from '@mui/material';

import Login from 'src/pages/Login';
import Menu from 'src/pages/Menu';

import AuthContext from 'src/contexts/authContext';

import AuthClass from './api/Auth';
import * as Styled from './App.styles';
import Accommodation from './pages/Accommodation';
import { readCookie } from './utils/cookie';

const App: React.FC = () => {
  const [accountName, setAccountName] = useState<string | undefined>(undefined);
  const [loading, setIsLoading] = useState<boolean>(false);

  const isLoggedIn = !!accountName;

  const validateUser = async () => {
    setIsLoading(true);
    const authToken = readCookie('auth_token');
    const validate = authToken && (await AuthClass.Validate(authToken));

    if (!authToken || !validate.isValidUser) {
      setAccountName(undefined);
    } else {
      if (!isLoggedIn) {
        setAccountName(readCookie('username'));
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    validateUser();
  }, []);

  if (loading) {
    return (
      <Styled.Loader>
        <CircularProgress color="secondary" />
      </Styled.Loader>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, accountName, setAccountName }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/accommodation" element={<Accommodation />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
