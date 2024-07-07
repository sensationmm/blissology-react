import { FC } from 'react';

import * as Styled from './styles';

type IEmptyCard = {
  title?: string;
};

const EmptyCard: FC<IEmptyCard> = ({ title = 'No results to show' }) => {
  return (
    <Styled.Card>
      <Styled.Title>{title}</Styled.Title>
    </Styled.Card>
  );
};

export default EmptyCard;
