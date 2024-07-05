import { FC } from 'react';

import { CardProps } from '@mui/material';

import Icon from 'src/components/Icon';

import * as Styled from './styles';

type IAddCard = {
  title: string;
  content: Array<string | JSX.Element>;
  selected?: boolean;
  image?: string;
  onSelect?: () => void;
  sx?: CardProps['sx'];
};

const ListCard: FC<IAddCard> = ({ title, content, image, selected = undefined, sx = {}, onSelect = undefined }) => {
  return (
    <Styled.Card sx={{ paddingRight: selected !== undefined ? '35px' : 0, ...sx }}>
      <Styled.Typography component="h2" variant="h3" sx={{ mb: '10px' }}>
        {title}
      </Styled.Typography>

      {content &&
        content.length &&
        content.map((item, count) =>
          typeof item === 'string' ? (
            <Styled.Typography key={`list-card-content-${count}`} variant={'body1'}>
              {item}
            </Styled.Typography>
          ) : (
            item
          )
        )}
      {selected !== undefined && (
        <Styled.SelectedIcon onClick={onSelect}>
          <Icon iconKey={selected ? 'selected' : 'unselected'} color="primary" />
        </Styled.SelectedIcon>
      )}
      {image && (
        <Styled.Image>
          <img src={image} />
        </Styled.Image>
      )}
    </Styled.Card>
  );
};

export default ListCard;
