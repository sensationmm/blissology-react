import { FC, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';

import * as Styled from './styles';

type IAddCard = {
  label: string;
  onClick: () => void;
};

const AddCard: FC<IAddCard> = ({ label, onClick }) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  return (
    <Styled.Container onClick={onClick} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      <Styled.CardIcon>
        <AddIcon color={!isHovering ? 'secondary' : 'primary'} fontSize="inherit" />
      </Styled.CardIcon>
      <Styled.AddLabel variant="body1" color={!isHovering ? 'secondary' : 'primary'} sx={{}}>
        {label}
      </Styled.AddLabel>
    </Styled.Container>
  );
};

export default AddCard;
