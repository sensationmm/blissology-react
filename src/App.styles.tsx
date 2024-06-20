import { styled } from '@mui/material';

import { blissologyTheme } from './components/Layout/theme';

export const Loader = styled('div')({
  position: 'fixed',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
  top: 0,
  left: 0,
  zIndex: 100000,
  backgroundColor: blissologyTheme.palette.primary.main
});
