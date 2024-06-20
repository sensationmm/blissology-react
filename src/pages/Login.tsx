import { useEffect, useState } from 'react';
import { addMonths } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import { Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';

import AuthClass from 'src/api/Auth';

import Layout from 'src/components/Layout/Layout';

import { useAuthContext } from 'src/contexts/authContext';
import { bakeCookie } from 'src/utils/cookie';

const Login = () => {
  const [username, setUsername] = useState('brianandkevin');
  const [password, setPassword] = useState('Bruno319!');
  const { isLoggedIn, setAccountName } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    isLoggedIn && navigate('/menu');
  }, [isLoggedIn]);

  const HandleLogin = async () => {
    const auth = await AuthClass.Login(username, password);

    bakeCookie('auth_token', auth.token, addMonths(new Date(), 1));
    bakeCookie('username', auth.user_nicename, addMonths(new Date(), 1));

    setAccountName(auth.user_nicename);
  };

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField id="username1" label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} />
        </Grid>
        <Grid item xs={4}>
          <TextField id="password1" type="password" label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" onClick={HandleLogin}>
            Log In
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Login;
