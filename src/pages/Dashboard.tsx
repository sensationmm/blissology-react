/* eslint-disable @typescript-eslint/no-explicit-any */
import { differenceInDays } from 'date-fns';
import { useSelector } from 'react-redux';

import { CircularProgress } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { RootState } from 'src/store';
import { IWeddingDeadline } from 'src/store/reducers/wedding';

import Layout from 'src/components/Layout/Layout';

import { blissDate, wpDateToTimestamp } from 'src/utils/common';

// type IWedding = {
//   acf?: IDeadline;
// } | null;

const Dashboard = () => {
  const authState = (state: RootState['auth']) => state.auth;
  const weddingState = (state: RootState['wedding']) => state.wedding;
  const { userID } = useSelector(authState);
  const { deadlines } = useSelector(weddingState);

  if (userID === null) {
    return <CircularProgress />;
  }

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h1">Welcome!</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h2">Upcoming Deadlines</Typography>
          <Grid container spacing={2} sx={{ marginTop: '0px' }}>
            {deadlines
              .slice()
              .sort((a: IWeddingDeadline, b: IWeddingDeadline) => (a.date > b.date ? 1 : -1))
              .map((deadline: any, index: number) => (
                <Grid item xs={12} key={`deadline-${index}`}>
                  <Card>
                    <CardContent>
                      <Typography variant="body1">Due in {differenceInDays(wpDateToTimestamp(deadline.date), new Date())} days</Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {deadline.name}
                      </Typography>
                      <Typography variant="body1">{blissDate(deadline.date)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;
