import { FC } from 'react';

import AddIcon from '@mui/icons-material/Add';

import * as Styled from './styles';

type IAddCard = {
  label: string;
  onClick: () => void;
};

const AddCard: FC<IAddCard> = ({ label, onClick }) => {
  return (
    <Styled.Container onClick={onClick}>
      <Styled.CardIcon>
        <AddIcon color="primary" fontSize="inherit" />
      </Styled.CardIcon>
      <Styled.AddLabel variant="body1" color="primary" sx={{}}>
        {label}
      </Styled.AddLabel>
    </Styled.Container>
  );
};

export default AddCard;
