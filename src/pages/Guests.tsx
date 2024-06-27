import { CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Layout from 'src/components/Layout/Layout';

import { useAuthContext } from 'src/contexts/authContext';

const Guests = () => {
  const { userID } = useAuthContext();

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
