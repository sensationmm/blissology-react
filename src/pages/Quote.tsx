import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Card, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import store, { RootState } from 'src/store';

import { wpRestApiHandler } from 'src/api/wordpress';

import Layout from 'src/components/Layout/Layout';

import { formatQuoteConfigResponse, generateQuote } from 'src/utils/wordpress/quote';

const Quote = () => {
  const state = (state: RootState) => state;
  const { auth, guests: Guests, quoteConfig: QuoteConfig, rooms: Rooms } = useSelector(state);
  // const authState = (state: RootState['auth']) => state.auth;
  // const { token } = useSelector(authState);
  // const quoteConfig = (state: RootState['auth']) => state.quoteConfig;
  // const QuoteConfig = useSelector(quoteConfig);
  // const guests = (state: RootState['auth']) => state.guests;
  // const Guests = useSelector(guests);
  // const upgrades = (state: RootState['upgrades']) => state.upgrades;
  // const Upgrades = useSelector(upgrades);

  useEffect(() => {
    store.dispatch({
      payload: { isLoading: true },
      type: 'ui/setLoading'
    });
    wpRestApiHandler(`options/all`, undefined, 'GET', auth.token, false).then(async (resp) => {
      const respJson = await resp.json();

      const dispatchPayload = formatQuoteConfigResponse(respJson);

      await store.dispatch({
        payload: dispatchPayload,
        type: 'quoteConfig/update'
      });
      store.dispatch({
        payload: { isLoading: false },
        type: 'ui/setLoading'
      });
    });
  }, []);

  const quote = generateQuote(QuoteConfig, Guests, Rooms);

  return (
    <Layout title="Your Latest Quote">
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Card>
            <TableContainer>
              <Table sx={{ width: '100%' }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quote.map((item: Record<string, string | null>, count: number) => {
                    const { description, quantity, total, unitPrice } = item;
                    return (
                      <TableRow key={`set-fee-${count}`}>
                        <TableCell component="th" scope="row">
                          {description}
                        </TableCell>
                        <TableCell align="center">{quantity}</TableCell>
                        <TableCell align="right">{unitPrice}</TableCell>
                        <TableCell align="right">{total}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        <Grid item xs={4}>
          <Card sx={{ mb: '20px' }}>
            <Typography variant="h2">Payments</Typography>
          </Card>
          <Card>
            <Typography variant="h2">Payment Schedule</Typography>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Quote;
