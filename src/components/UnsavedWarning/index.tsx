import { FC } from 'react';
import { useBlocker } from 'react-router-dom';

import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

type IUnsavedWarning = {
  isUnsaved: boolean;
  onDiscard: () => void;
  onSave: () => void;
};

const UnsavedWarning: FC<IUnsavedWarning> = ({ isUnsaved = false, onDiscard }) => {
  const savedStatus = useBlocker(isUnsaved);

  const handleDiscard = async () => {
    await onDiscard();
    savedStatus.proceed?.();
  };

  const handleSave = async () => {
    savedStatus.reset?.();
  };

  return (
    <Dialog
      open={savedStatus.state === 'blocked'}
      // onClose={onCancelEdit}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      fullWidth={true}
      maxWidth="sm">
      <DialogTitle>You have unsaved changes</DialogTitle>
      <DialogActions>
        <Button color="secondary" variant="contained" onClick={handleSave}>
          Go back
        </Button>
        <Button variant="contained" onClick={handleDiscard}>
          Discard changes and proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnsavedWarning;
