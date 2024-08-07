import { styled } from '@mui/material';

export const Loader = styled('div')(({ theme }) => ({
  alignItems: 'center',
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  height: '100vh',
  justifyContent: 'center',
  left: 0,
  position: 'fixed',
  top: 0,
  width: '100vw',
  zIndex: 100000
}));
