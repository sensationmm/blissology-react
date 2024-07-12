import { FC } from 'react';

import { CardProps } from '@mui/material';

import { IMenuItem } from 'src/store/reducers/menu';

import Icon from 'src/components/Icon';

import * as Styled from './styles';

type IListCardContentArgs = {
  key: string;
  value: keyof IMenuItem;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IListCardContent = { id?: keyof IMenuItem; Component?: FC<any>; args?: IListCardContentArgs };

type IListCard = {
  title: string;
  content: IListCardContent[];
  icons?: IListCardContent[];
  selected?: boolean;
  image?: string;
  item: IMenuItem;
  onSelect?: () => void;
  sx?: CardProps['sx'];
};

const ListCard: FC<IListCard> = ({ title, content, icons, image, item, selected = undefined, sx = {}, onSelect = undefined }) => {
  const paddingRight = image ? '40%' : selected !== undefined ? '35px' : 0;

  const parseItem = (itemKey: IListCardContent, count: number) => {
    const { id, Component, args } = itemKey;
    const argsObj = args ? { [args.key]: item[args.value] } : {};
    if (Component && id && item[id]) {
      return <Component key={id} {...argsObj} />;
    }
    const string: string = item[id as keyof IMenuItem] as string;
    return (
      <Styled.Description key={`list-card-content-${count}`}>
        <Styled.Typography variant={'body1'}>{string}</Styled.Typography>
      </Styled.Description>
    );
  };

  return (
    <Styled.Card sx={{ paddingRight: paddingRight, ...sx }}>
      <Styled.Typography component="h2" variant="h3" sx={{ mb: '10px' }}>
        {title}
      </Styled.Typography>

      {content && content.length > 0 && content.map(parseItem)}
      {icons && icons.length > 0 && <Styled.Icons>{icons.map(parseItem)}</Styled.Icons>}

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
