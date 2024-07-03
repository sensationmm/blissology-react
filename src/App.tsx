import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { CircularProgress } from '@mui/material';

import * as Styled from 'src/App.styles';
import navigation from 'src/config/navigation';
import store, { RootState } from 'src/store';

import Login from 'src/pages/Login';
import AuthClass from 'src/api/Auth';

import { readCookie } from 'src/utils/cookie';

import { formatSuppliersResponse } from './utils/wordpress/supplier';
import { formatWeddingGuestsResponse } from './utils/wordpress/wedding';

const App: React.FC = () => {
  const authState = (state: RootState['auth']) => state.auth;
  const { isLoggedIn, token, userName } = useSelector(authState);
  const [loading, setIsLoading] = useState<boolean>(true);

  const getMe = async (username: string, authToken: string) => {
    const response = await fetch(`http://hydehouse.blissology.local:50011/wp-json/wp/v2/users/?search=${username}`);
    const user = await response.json();
    await getMyWedding(user[0].id);
    store.dispatch({
      payload: { token: authToken, userID: user[0].id, userName: username },
      type: 'auth/login'
    });
  };

  const getMyWedding = async (user: string) => {
    const response = await fetch(`http://hydehouse.blissology.local:50011/wp-json/wp/v2/wedding?author=${user}`);
    const wedding = await response.json();
    store.dispatch({
      payload: {
        date: wedding[0]?.acf?.wedding_date,
        deadlines: wedding[0]?.acf?.deadlines,
        weddingID: wedding[0].id,
        weddingName: wedding[0].title.rendered
      },
      type: 'wedding/set'
    });

    store.dispatch({
      payload: formatWeddingGuestsResponse(wedding[0]?.acf?.guests),
      type: 'guests/set'
    });

    store.dispatch({
      payload: formatSuppliersResponse(wedding[0]?.acf?.suppliers),
      type: 'suppliers/set'
    });
  };

  const validateUser = async () => {
    setIsLoading(true);
    const authToken = readCookie('auth_token');
    const validate = authToken && (await AuthClass.Validate(authToken));

    if (!authToken || !validate.isValidUser) {
      store.dispatch({ type: 'auth/logout' });
    } else {
      if (!isLoggedIn) {
        const username = readCookie('username');

        await getMe(username, authToken);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    validateUser();
  }, []);

  useEffect(() => {
    isLoggedIn && getMe(userName, token);
  }, [userName]);

  if (loading) {
    return (
      <Styled.Loader>
        <CircularProgress color="secondary" />
      </Styled.Loader>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {navigation.map((item) => (
          <Route key={`route-${item.url}`} path={item.url} element={<item.Component />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
