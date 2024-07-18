import { FC } from 'react';

import { IconButton, Tooltip, Typography } from '@mui/material';

import Icon from 'src/components/Icon';

import * as Styled from './styles';

export type IDrinkType = 'wine' | 'sparkling' | 'beer' | 'spirits';
export type IWineType = 'red' | 'white' | 'rose';

type IDrinksInfo = {
  drinkType: IDrinkType;
  wineType?: IWineType;
};

enum EDrinkLabel {
  'beer' = 'Beer & Ale',
  'red' = 'Red Wine',
  'rose' = 'Rose Wine',
  'sparkling' = 'Sparkling',
  'spirits' = 'Spirits & Cocktails',
  'white' = 'White Wine',
  'wine' = 'Wine'
}

enum EDrinkColor {
  'red' = '#910707',
  'white' = '#f5dab5',
  'rose' = '#e292d8'
}

const DrinksInfo: FC<IDrinksInfo> = ({ drinkType, wineType }) => {
  const renderIcon = (type: IDrinkType | IWineType, Component: JSX.Element) => (
    <Tooltip title={<Typography>{EDrinkLabel[type]}</Typography>}>
      <IconButton sx={{ padding: 0 }}>{Component}</IconButton>
    </Tooltip>
  );

  return (
    <Styled.Icons>
      <Styled.Icon>
        {renderIcon(drinkType, <Icon iconKey={drinkType} fontSize="large" color="secondary" />)}
        {drinkType === 'wine' && wineType && renderIcon(wineType, <Icon iconKey="liquid" fontSize="large" sx={{ color: EDrinkColor[wineType] }} />)}
      </Styled.Icon>
    </Styled.Icons>
  );
};

export default DrinksInfo;
