import { Card as MuiCard, styled, Typography as MuiTypography } from '@mui/material';

export const SelectedIcon = styled('div')(() => ({
  '> svg': {
    display: 'block'
  },
  background: 'rgba(255,255,255,0.7)',
  borderRadius: '4px',
  bottom: '5px',
  cursor: 'pointer',
  position: 'absolute',
  right: '5px',
  zIndex: 2
}));

export const Card = styled(MuiCard)(() => ({
  position: 'relative'
}));

export const Description = styled('div')(() => ({
  marginTop: '20px',
  maxHeight: '50px',
  overflow: 'hidden'
}));

export const Icons = styled('div')(() => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  marginTop: '20px'
}));

export const Typography = styled(MuiTypography)(() => ({
  overflow: 'hidden',
  position: 'relative',
  textOverflow: 'ellipsis',
  textShadow: '0px 0px 3px #fff',
  zIndex: 2
})) as typeof MuiTypography;

export const Image = styled('div')(() => ({
  '&:before': {
    background: 'linear-gradient(to right, #ffffff , transparent);',
    content: '""',
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100px'
  },
  '> img': {
    height: '100%'
  },
  height: '100%',
  overflow: 'hidden',
  position: 'absolute',
  right: 0,
  top: 0,
  zIndex: 1
}));
