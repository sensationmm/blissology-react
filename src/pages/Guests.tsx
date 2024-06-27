import { useSelector } from 'react-redux';

import { CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { RootState } from 'src/store';

import Layout from 'src/components/Layout/Layout';

const Guests = () => {
  const authState = (state: RootState['auth']) => state.auth;
  const { userID } = useSelector(authState);

  if (userID === null) {
    return <CircularProgress />;
  }

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography component="h1">Guest List</Typography>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Guests;
