import { useSelector } from 'react-redux';

import { Card, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import { RootState } from 'src/store';

import Layout from 'src/components/Layout/Layout';

import { blissDate, currencyFormat } from 'src/utils/common';
import { generateQuote } from 'src/utils/generateQuote';

const Quote = () => {
  const state = (state: RootState) => state;
  const {
    drinks,
    drinkChoices,
    guests: Guests,
    menu: Menu,
    menuChoices: MenuChoices,
    orders: Orders,
    payments: Payments,
    quoteConfig: QuoteConfig,
    roomAllocations: RoomAllocations,
    rooms: Rooms,
    upgrades: Upgrades,
    upgradeChoices: UpgradeChoices,
    wedding: Wedding
  } = useSelector(state);

  // if (UI.isLoading) return <CircularProgress />;

  const quote = generateQuote(QuoteConfig, drinks, drinkChoices, Guests, Menu, MenuChoices, Orders, Payments, RoomAllocations, Rooms, Upgrades, UpgradeChoices, Wedding);

  return (
    <Layout title="Your Latest Quote">
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Card sx={{ padding: 0 }}>
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
                <TableBody className="invoice">
                  {quote.items.map((item: Record<string, string | null>, count: number) => {
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
          {quote.issues.length > 0 && (
            <Card sx={{ mb: '20px' }}>
              <Typography variant="h2">Issues</Typography>
              {quote.issues.map((issue: string, count: number) => {
                return (
                  <Typography
                    key={`issue-${count}`}
                    variant="body1"
                    sx={{ borderTop: (theme) => `1px solid ${theme.palette.tertiary.main}`, mt: '10px', pt: '10px', textAlign: 'center' }}>
                    {issue}
                  </Typography>
                );
              })}
            </Card>
          )}

          <Card sx={{ mb: '20px' }}>
            <Typography variant="h2">Payments</Typography>
            {Payments.map((payment) => {
              return (
                <Grid key={`payment_${payment.id}`} container sx={{ borderTop: (theme) => `1px solid ${theme.palette.tertiary.main}`, mt: '10px', pt: '10px' }}>
                  <Grid item xs={6}>
                    <Typography variant="body1">{payment.label}</Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="body2" gutterBottom>
                      {blissDate(payment.date, true)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {currencyFormat(payment.amount)}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Quote;
