import { FC } from 'react';

import { IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';

import Icon from 'src/components/Icon';

import * as Styled from './styles';

type IToggleFilterItem = {
  label: string;
  value: string;
};

type IToggleFilter = {
  id: string;
  label?: string;
  onSelect: (value: IToggleFilterItem['value'] | null) => void;
  options: IToggleFilterItem[];
  value: string | string[];
  secondTier?: JSX.Element;
  showSecondTierTest?: string;
};

const ToggleFilter: FC<IToggleFilter> = ({ id, label = 'Filter by', onSelect, options, value, showSecondTierTest, secondTier }) => {
  return (
    <Styled.Container>
      {label !== '' && <Styled.Label color="tertiary">{label}:</Styled.Label>}
      <ToggleButtonGroup id={id} color="primary" size="small" value={value} exclusive onChange={(_, value) => onSelect(value)}>
        {options
          .filter((option) => value !== showSecondTierTest || option.value == showSecondTierTest)
          .map((option: IToggleFilterItem, count: number) => (
            <ToggleButton key={`${id}-option-${count}`} value={option.value}>
              {option.label}
            </ToggleButton>
          ))}
      </ToggleButtonGroup>

      {value === showSecondTierTest && (
        <Styled.SecondTier>
          <IconButton edge="start" onClick={() => onSelect(null)}>
            <Icon iconKey="close" />
          </IconButton>

          {secondTier}
        </Styled.SecondTier>
      )}
    </Styled.Container>
  );
};

export default ToggleFilter;
