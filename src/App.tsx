import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import * as Styled from 'src/App.styles';
import navigation from 'src/config/navigation';
import store, { RootState } from 'src/store';

import Login from 'src/pages/Login';
import AuthClass from 'src/api/Auth';

import SnackbarProvider from 'src/components/Snackbar';

import { readCookie } from 'src/utils/cookie';
import { blissologyTheme } from 'src/utils/theme';

import { wpRestApiHandler } from './api/wordpress';
import { UnsavedProvider } from './providers/UnsavedProvider';
import { formatDrinkChoicesResponse } from './utils/wordpress/drinkChoices';
import { formatMenuChoicesResponse } from './utils/wordpress/menuChoices';
import { formatQuestionAnswersResponse } from './utils/wordpress/questionsConfig';
import { formatQuoteConfigResponse } from './utils/wordpress/quote';
import { formatSuppliersResponse } from './utils/wordpress/supplier';
import { formatUpgradeChoicesResponse, formatUpgradeOrdersResponse } from './utils/wordpress/upgradeChoices';
import { formatCustomInvoiceReponse, formatWeddingGuestsResponse } from './utils/wordpress/wedding';

const App: React.FC = () => {
  const authState = (state: RootState['auth']) => state.auth;
  const { isLoggedIn, token, userName } = useSelector(authState);
  const [loading, setIsLoading] = useState<boolean>(true);
  const [primaryColor, setPrimaryColor] = useState();
  const [secondaryColor, setSecondaryColor] = useState();

  const getMe = async (username: string, authToken: string) => {
    const response = await fetch(`http://hydehouse.blissology.local/wp-json/wp/v2/users/?search=${username}`);
    const user = await response.json();
    await getMyWedding(user[0].id);
    await getOptions(authToken);
    store.dispatch({
      payload: { token: authToken, userID: user[0].id, userName: username },
      type: 'auth/login'
    });
  };

  const getMyWedding = async (user: string) => {
    const response = await fetch(`http://hydehouse.blissology.local/wp-json/wp/v2/wedding?author=${user}`);
    const wedding = await response.json();
    store.dispatch({
      payload: {
        customInvoiceEntries: formatCustomInvoiceReponse(wedding[0]?.acf?.custom_invoice),
        date: wedding[0]?.acf?.wedding_date,
        deadlines: wedding[0]?.acf?.deadlines,
        drinkChoices: formatDrinkChoicesResponse(wedding[0]?.acf?.drinkChoices),
        guests: formatWeddingGuestsResponse(wedding[0]?.acf?.guests),
        menuChoices: formatMenuChoicesResponse(wedding[0]?.acf?.menuChoices),
        orders: formatUpgradeOrdersResponse(wedding[0]?.acf?.upgradeChoices),
        payments: wedding[0]?.acf?.payments || [],
        questions: formatQuestionAnswersResponse(wedding[0]?.acf?.questions_answers) || [],
        quoteLocked: wedding[0]?.acf?.quote_locked || false,
        roomAllocations: wedding[0]?.acf?.room_allocations || [],
        suppliers: formatSuppliersResponse(wedding[0]?.acf?.suppliers),
        upgradeChoices: formatUpgradeChoicesResponse(wedding[0]?.acf?.upgradeChoices),
        weddingID: wedding[0].id,
        weddingName: wedding[0].title.rendered
      },
      type: 'wedding/set'
    });
  };

  const getOptions = (authToken: string) =>
    wpRestApiHandler(`options/all`, undefined, 'GET', authToken, false).then(async (resp) => {
      const respJson = await resp.json();

      const dispatchPayload = formatQuoteConfigResponse(respJson);
      setPrimaryColor(respJson.color_primary);
      setSecondaryColor(respJson.color_secondary);

      await store.dispatch({
        payload: dispatchPayload,
        type: 'quoteConfig/update'
      });
      store.dispatch({
        payload: { isLoading: false },
        type: 'ui/setLoading'
      });
    });

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

  const router = createBrowserRouter([{ element: <Login />, path: '/' }].concat(navigation.map((item) => ({ element: <item.Component />, path: item.url }))));

  return (
    <ThemeProvider theme={blissologyTheme(primaryColor, secondaryColor)}>
      <UnsavedProvider>
        <SnackbarProvider>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </UnsavedProvider>
    </ThemeProvider>
  );
};

export default App;
