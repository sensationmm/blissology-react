import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { CircularProgress } from '@mui/material';

import Login from 'src/pages/Login';
import Menu from 'src/pages/Menu';

import AuthContext from 'src/contexts/authContext';

import AuthClass from './api/Auth';
import * as Styled from './App.styles';
import Accommodation from './pages/Accommodation';
import Dashboard from './pages/Dashboard';
import { readCookie } from './utils/cookie';

const App: React.FC = () => {
  const [accountName, setAccountName] = useState<string | undefined>(undefined);
  const [userID, setUserID] = useState<string | undefined>(undefined);
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
        const username = readCookie('username');
        setAccountName(username);

        const response = await fetch(`http://hydehouse.blissology.local:50011/wp-json/wp/v2/users/?search=${username}`);
        const user = await response.json();
        setUserID(user[0].id);
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
    <AuthContext.Provider value={{ isLoggedIn, userID, setUserID, accountName, setAccountName }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/accommodation" element={<Accommodation />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
