import { FC } from 'react';

import * as Styled from './styles';

type IActions = {
  children: JSX.Element | JSX.Element[];
};

const Actions: FC<IActions> = ({ children }) => {
  return <Styled.Container>{children}</Styled.Container>;
};

export default Actions;
