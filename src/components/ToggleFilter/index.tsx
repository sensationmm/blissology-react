import { FC } from 'react';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import * as Styled from './styles';

type IToggleFilterItem = {
  label: string;
  value: string;
};
type IToggleFilter = {
  id: string;
  label?: string;
  onSelect: (value: IToggleFilterItem['value']) => void;
  options: IToggleFilterItem[];
  value: string[];
};

const ToggleFilter: FC<IToggleFilter> = ({ id, label = 'Filter by', onSelect, options, value }) => {
  return (
    <Styled.Container>
      <Styled.Label color="tertiary">{label}:</Styled.Label>
      <ToggleButtonGroup id={id} color="primary" size="small" value={value} exclusive onChange={(_, value) => onSelect(value)}>
        {options.map((option: IToggleFilterItem, count: number) => (
          <ToggleButton key={`${id}-option-${count}`} value={option.value}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Styled.Container>
  );
};

export default ToggleFilter;
