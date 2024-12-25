import { styled } from '@mui/material';

import { CardIcon } from 'src/components/AddCard/styles';

export const Icon = styled(CardIcon)(() => ({
  bottom: '10px',
  opacity: 0.2,
  position: 'absolute',
  right: '10px',
  zIndex: 1
}));

export const Content = styled('div')(() => ({
  position: 'relative'
}));
