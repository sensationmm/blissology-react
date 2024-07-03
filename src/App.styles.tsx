import { styled } from '@mui/material';

import { blissologyTheme } from './components/Layout/theme';

export const Loader = styled('div')({
  alignItems: 'center',
  backgroundColor: blissologyTheme.palette.primary.main,
  display: 'flex',
  height: '100vh',
  justifyContent: 'center',
  left: 0,
  position: 'fixed',
  top: 0,
  width: '100vw',
  zIndex: 100000
});
