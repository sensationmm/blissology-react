/* eslint-disable @typescript-eslint/no-explicit-any */
import { differenceInDays, formatDate } from 'date-fns';

import { CircularProgress } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Layout from 'src/components/Layout/Layout';

import { useAuthContext } from 'src/contexts/authContext';
import useFetch from 'src/hooks/useFetch';
import { wpDateToTimestamp } from 'src/utils/common';

type IDeadline = { [key: string]: any };

type IWedding = {
  acf?: IDeadline;
} | null;

const Dashboard = () => {
  const { userID } = useAuthContext();

  if (userID === null) {
    return <CircularProgress />;
  }

  const MyWedding: IWedding = useFetch(`http://hydehouse.blissology.local:50011/wp-json/wp/v2/wedding?author=${userID}`)?.[0] || {};

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography component="h1">Welcome!</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography component="h2">Upcoming Deadlines</Typography>
          <Grid container spacing={2} sx={{ marginTop: '0px' }}>
            {MyWedding?.acf?.deadlines
              .sort((a: IDeadline, b: IDeadline) => (a.date > b.date ? 1 : -1))
              .map((deadline: any, index: number) => (
                <Grid item xs={12} key={`deadline-${index}`}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" component="p">
                        Due in {differenceInDays(wpDateToTimestamp(deadline.date), new Date())} days
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {deadline.name}
                      </Typography>
                      <Typography variant="body2" component="p">
                        {formatDate(wpDateToTimestamp(deadline.date), 'd MMMM yyyy')}
                      </Typography>
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
