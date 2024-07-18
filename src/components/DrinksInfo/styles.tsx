import { styled } from '@mui/material';

export const Icon = styled('div')(({ theme }) => ({
  boxSizing: 'content-box',
  color: theme.palette.secondary.main,
  display: 'flex',
  fontSize: '2em',
  position: 'relative'
}));

export const Icons = styled('div')(() => ({
  display: 'inline-flex',
  width: 'auto'
}));
