import { useEffect, useState } from 'react';
import { useAuthContext } from 'contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { WPAuthReponse } from 'types/wp-rest-api';

import { Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';

const Login = () => {
  const [username, setUsername] = useState('brianandkevin');
  const [password, setPassword] = useState('Bruno319!');
  const { isLoggedIn, setToken } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    isLoggedIn && navigate('/posts');
  }, [isLoggedIn]);

  const HandleLogin = async () => {
    const doAuth = await fetch('http://hydehouse.blissology.local:50011/wp-json/jwt-auth/v1/token', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    const auth: WPAuthReponse = await doAuth.json();

    setToken(auth.token);
  };

  return (
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
  );
};

export default Login;
