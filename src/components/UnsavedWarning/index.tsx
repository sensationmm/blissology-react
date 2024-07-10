import { FC } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

type IUnsavedWarning = {
  title: string;
  subtitle?: string;
  confirmButton: string;
  cancelButton: string;
  isUnsaved: boolean;
  onCancel: () => void;
  onProceed: () => void;
};

const UnsavedWarning: FC<IUnsavedWarning> = ({ isUnsaved = false, onCancel, onProceed, title, subtitle, confirmButton, cancelButton }) => {
  return (
    <Dialog open={isUnsaved} fullWidth={true} maxWidth="sm">
      <DialogTitle variant="h2" color="primary">
        {title}
      </DialogTitle>
      {subtitle && (
        <DialogContent>
          <DialogContentText variant="body1">{subtitle}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button color="secondary" variant="contained" onClick={onCancel}>
          {cancelButton}
        </Button>
        <Button variant="contained" onClick={onProceed}>
          {confirmButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnsavedWarning;
