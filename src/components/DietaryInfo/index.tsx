import { FC } from 'react';

import { Grid } from '@mui/material';

import * as Styled from './styles';

export type IDiets = 've' | 'v' | 'gf' | 'df';

type IDietaryInfo = {
  diets: IDiets[];
};

const DietaryInfo: FC<IDietaryInfo> = ({ diets }) => {
  return (
    <Grid container spacing={1}>
      {diets
        .slice()
        .sort((a, b) => (a > b ? 1 : -1))
        .map((diet, count) => (
          <Styled.Diet item key={`diet-${count}`}>
            {diet}
          </Styled.Diet>
        ))}
    </Grid>
  );
};

export default DietaryInfo;
