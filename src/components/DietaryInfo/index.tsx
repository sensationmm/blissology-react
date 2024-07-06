import { FC } from 'react';

import * as Styled from './styles';

export type IDiets = 've' | 'v' | 'gf' | 'df';

type IDietaryInfo = {
  diets: IDiets[];
};

const DietaryInfo: FC<IDietaryInfo> = ({ diets }) => {
  return (
    <Styled.Diets>
      {diets
        .slice()
        .sort((a, b) => (a > b ? 1 : -1))
        .map((diet, count) => (
          <Styled.Diet key={`diet-${count}`}>{diet}</Styled.Diet>
        ))}
    </Styled.Diets>
  );
};

export default DietaryInfo;
