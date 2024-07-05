import { Grid, styled } from '@mui/material';

export const Diet = styled(Grid)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontSize: '0.8em',
  fontWeight: 600,
  marginTop: '10px',
  position: 'relative',
  textTransform: 'uppercase'
}));
