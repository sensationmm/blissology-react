import { styled, Typography } from '@mui/material';

import { CardIcon } from 'src/components/AddCard/styles';

import { hexToRgb } from 'src/utils/common';

export const Icon = styled(CardIcon)(() => ({
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  opacity: 0.2,
  zIndex: 1
}));

export const Subtitle = styled(Typography)(({ theme }) => ({
  textTransform: 'uppercase',
  marginBottom: '5px',
  fontWeight: 'bold',
  color: theme.palette.tertiary.main
}));

export const SubContent = styled('div')(({ theme }) => ({
  paddingTop: '10px',
  borderTop: `1px solid ${theme.palette.tertiary.main}`,
  marginTop: '20px',
  fontStyle: 'italic'
}));

export const Controls = styled('div')<{ show: boolean }>(({ show, theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: `rgba(${hexToRgb(theme.palette.tertiary.main)}, 0.8)`,
  '> .MuiButtonBase-root': {
    margin: '5px 0'
  },
  zIndex: 10,
  opacity: show ? 1 : 0,
  transition: 'all linear 0.2s'
}));
