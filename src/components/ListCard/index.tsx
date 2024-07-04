import { FC } from 'react';

import { Card, Typography } from '@mui/material';

import Icon from 'src/components/Icon';

import * as Styled from './styles';

type IAddCard = {
  title: string;
  content: Array<string>;
  selected: boolean;
};

const ListCard: FC<IAddCard> = ({ title, content, selected = false }) => {
  return (
    <Card>
      <Typography variant="h3" sx={{ mb: '10px' }}>
        {title}
      </Typography>

      {content.map((item, count) => (
        <Typography key={`list-card-content-${count}`} variant={'body1'}>
          {item}
        </Typography>
      ))}
      <Styled.SelectedIcon>
        <Icon iconKey={selected ? 'selected' : 'unselected'} color="success" />
      </Styled.SelectedIcon>
    </Card>
  );
};

export default ListCard;
