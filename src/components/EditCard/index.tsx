import { FC, useState } from 'react';

import { Button, Card, Typography } from '@mui/material';

import { capitalize } from 'src/utils/common';

import * as Styled from './styles';

type ICardContent = {
  text: string;
  isSmall?: boolean;
};

type IEditCard = {
  title: string;
  subtitle?: string;
  icon: JSX.Element;
  content: ICardContent[];
  onEdit?: () => void;
  onDelete?: () => void;
};

const EditCard: FC<IEditCard> = ({ title, subtitle, content, icon, onEdit, onDelete }) => {
  const [showControls, setShowControls] = useState<boolean>(false);

  return (
    <Card sx={{ p: '15px' }} onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
      {icon && <Styled.Icon>{icon}</Styled.Icon>}

      {subtitle && <Styled.Subtitle variant="body2">{capitalize(subtitle)}</Styled.Subtitle>}
      <Typography variant="h2" sx={{ mb: '10px' }}>
        {title}
      </Typography>
      {content.map((c, count) => (
        <Typography key={`edit-card-content-${count}`} variant={!c.isSmall ? 'body1' : 'body2'}>
          {c.text}
        </Typography>
      ))}
      {(onEdit || onDelete) && (
        <Styled.Controls show={showControls}>
          {onEdit && (
            <Button variant="contained" onClick={onEdit}>
              Edit Supplier
            </Button>
          )}
          {onDelete && (
            <Button variant="contained" onClick={onDelete}>
              Delete Supplier
            </Button>
          )}
        </Styled.Controls>
      )}
    </Card>
  );
};

export default EditCard;
