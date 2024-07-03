import { styled } from '@mui/material';

export const Container = styled('div')(({ theme }) => ({
  '.MuiButton-root': {
    marginLeft: '10px'
  },
  borderRadius: 0,
  borderTop: `1px solid ${theme.palette.tertiary.main}`,
  boxShadow: 'none',
  display: 'flex',
  flexDirection: 'row-reverse',
  justifyContent: 'flex-start',
  marginTop: '40px',
  paddingTop: '20px',
  width: '100%'
}));
