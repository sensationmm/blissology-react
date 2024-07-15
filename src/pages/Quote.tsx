import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import store, { RootState } from 'src/store';

import { wpRestApiHandler } from 'src/api/wordpress';

import Layout from 'src/components/Layout/Layout';

import { formatQuoteConfigResponse, generateQuote } from 'src/utils/wordpress/quote';

const Quote = () => {
  const authState = (state: RootState['auth']) => state.auth;
  const { token } = useSelector(authState);
  const quoteConfig = (state: RootState['auth']) => state.quoteConfig;
  const QuoteConfig = useSelector(quoteConfig);

  useEffect(() => {
    store.dispatch({
      payload: { isLoading: true },
      type: 'ui/setLoading'
    });
    wpRestApiHandler(`options/all`, undefined, 'GET', token, false).then(async (resp) => {
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

  const quote = generateQuote(QuoteConfig);

  return (
    <Layout title="Your Latest Quote">
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <TableContainer component={Paper}>
            <Table sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Total</TableCell>
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
                      <TableCell>{quantity}</TableCell>
                      <TableCell>{unitPrice}</TableCell>
                      <TableCell component="th" scope="row">
                        {total}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h2">Payments</Typography>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Quote;
