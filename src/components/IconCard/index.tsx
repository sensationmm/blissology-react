/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react';

import { Card } from '@mui/material';

import * as Styled from './styles';

type IIconCard = {
  children: any;
  icon: JSX.Element;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const IconCard: FC<IIconCard> = ({ children, icon, onMouseEnter, onMouseLeave }) => {
  return (
    <Card onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {icon && <Styled.Icon>{icon}</Styled.Icon>}

      {children}
    </Card>
  );
};

export default IconCard;
