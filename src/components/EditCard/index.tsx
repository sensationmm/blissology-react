import { FC, useState } from 'react';

import { Button, Typography } from '@mui/material';

import { capitalize } from 'src/utils/common';

import * as Styled from './styles';

import IconCard from '../IconCard';

type ICardContent = {
  text: string;
  isSmall?: boolean;
};

type IEditCard = {
  title: string;
  subtitle?: string;
  icon: JSX.Element;
  content: ICardContent[];
  subContent?: ICardContent[];
  onEdit?: () => void;
  onDelete?: () => void;
  context?: string;
};

const EditCard: FC<IEditCard> = ({ title, subtitle, content, subContent, icon, context, onEdit, onDelete }) => {
  const [showControls, setShowControls] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  return (
    <IconCard icon={icon} onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
      {subtitle && <Styled.Subtitle variant="body2">{capitalize(subtitle)}</Styled.Subtitle>}
      <Typography variant="h2" sx={{ mb: '10px' }}>
        {title}
      </Typography>
      {content.map((c, count) => (
        <Typography key={`edit-card-content-${count}`} variant={!c.isSmall ? 'body1' : 'body2'}>
          {c.text}
        </Typography>
      ))}
      {subContent && subContent.length > 0 && (
        <Styled.SubContent>
          {subContent.map((c, count) => (
            <Typography key={`edit-card-content-${count}`} variant={!c.isSmall ? 'body1' : 'body2'}>
              {c.text}
            </Typography>
          ))}
        </Styled.SubContent>
      )}
      {(onEdit || onDelete) && (
        <Styled.Controls show={showControls}>
          {onEdit && !showConfirmDelete && (
            <Button variant="contained" onClick={onEdit}>
              Edit {context}
            </Button>
          )}
          {onDelete && !showConfirmDelete && (
            <Button variant="contained" color="error" onClick={() => setShowConfirmDelete(true)}>
              Delete {context}
            </Button>
          )}
          {showConfirmDelete && (
            <>
              <Typography variant="body1" sx={{ fontWeight: 600, textAlign: 'center' }}>
                Are you sure? <br />
                This action cannot be undone
              </Typography>
              <Button variant="contained" color="error" onClick={onDelete}>
                Confirm Delete
              </Button>
              <Button variant="contained" onClick={() => setShowConfirmDelete(false)}>
                Cancel
              </Button>
            </>
          )}
        </Styled.Controls>
      )}
    </IconCard>
  );
};

export default EditCard;
