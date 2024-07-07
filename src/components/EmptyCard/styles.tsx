import { Card as MuiCard, styled, Typography } from '@mui/material';

export const Card = styled(MuiCard)(() => ({
  margin: '50px auto',
  position: 'relative',
  textAlign: 'center',
  width: '50%'
}));

export const Title = styled(Typography)(() => ({
  fontWeight: 600,
  marginRight: '10px',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap'
}));
