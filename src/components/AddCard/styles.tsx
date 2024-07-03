import { Card, styled, Typography } from '@mui/material';

export const Container = styled(Card)(() => ({
  alignItems: 'center',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '15px'
}));

export const CardIcon = styled('div')(() => ({
  display: 'inline',
  fontSize: '100px',
  height: 'auto',
  lineHeight: '20px',
  svg: {
    display: 'inline',
    transition: 'all linear 0.2s'
  },
  transition: 'all linear 0.2s'
}));

export const AddLabel = styled(Typography)(() => ({
  fontWeight: 'bold',
  textTransform: 'uppercase',
  transition: 'all linear 0.2s'
}));
