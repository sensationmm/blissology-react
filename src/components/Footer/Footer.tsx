import React from 'react';
import { Link, Typography } from '@mui/material';

const Footer = (props: any) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Blissology
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

export default Footer;
