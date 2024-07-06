import { styled } from '@mui/material';

export const Diet = styled('div')(() => ({
  boxSizing: 'content-box',
  color: '#fff',
  fontSize: '0.8em',
  fontWeight: 600,
  padding: '0 5px',
  position: 'relative',
  textAlign: 'center',
  textTransform: 'uppercase'
}));

export const Diets = styled('div')(({ theme }) => ({
  background: theme.palette.secondary.main,
  borderRadius: '4px',
  display: 'inline-flex',
  marginTop: '10px',
  overflow: 'hidden',
  padding: '5px',
  width: 'auto'
}));
