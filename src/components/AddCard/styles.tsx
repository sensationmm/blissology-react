import { Card, styled, Typography } from '@mui/material';

export const Container = styled(Card)(() => ({
  padding: '15px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer'
}));

export const CardIcon = styled('div')(() => ({
  display: 'inline',
  fontSize: '100px',
  lineHeight: '20px',
  height: 'auto',
  svg: {
    display: 'inline'
  }
}));

export const AddLabel = styled(Typography)(() => ({
  textTransform: 'uppercase',
  fontWeight: 'bold'
}));
