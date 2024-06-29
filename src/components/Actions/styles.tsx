import { styled } from '@mui/material';

export const Container = styled('div')(({ theme }) => ({
  width: '100%',
  paddingTop: '20px',
  borderTop: `1px solid ${theme.palette.tertiary.main}`,
  marginTop: '40px',
  borderRadius: 0,
  justifyContent: 'flex-start',
  boxShadow: 'none',
  display: 'flex',
  flexDirection: 'row-reverse',
  '.MuiButton-root': {
    marginLeft: '10px'
  }
}));
