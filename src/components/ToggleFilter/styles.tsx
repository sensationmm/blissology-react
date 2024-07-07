import { styled, Typography } from '@mui/material';

export const Container = styled('div')(() => ({
  alignItems: 'center',
  display: 'flex'
}));

export const Label = styled(Typography)(() => ({
  fontSize: '0.8125rem',
  fontWeight: 600,
  marginRight: '10px',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap'
}));
