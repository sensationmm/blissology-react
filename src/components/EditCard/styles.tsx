import { styled, Typography } from '@mui/material';

import { hexToRgb } from 'src/utils/common';

export const Subtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.tertiary.main,
  fontWeight: 'bold',
  marginBottom: '5px',
  textTransform: 'uppercase'
}));

export const SubContent = styled('div')(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.tertiary.main}`,
  fontStyle: 'italic',
  marginTop: '20px',
  paddingTop: '10px'
}));

export const Controls = styled('div')<{ show: boolean }>(({ show, theme }) => ({
  '> .MuiButtonBase-root': {
    margin: '5px 0'
  },
  alignItems: 'center',
  background: `rgba(${hexToRgb(theme.palette.tertiary.main)}, 0.8)`,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
  left: 0,
  opacity: show ? 1 : 0,
  position: 'absolute',
  top: 0,
  transition: 'all linear 0.2s',
  width: '100%',
  zIndex: 10
}));
