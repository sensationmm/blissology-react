import { useContext } from 'react';

import { AlertProps, SnackbarOrigin } from '@mui/material';

import { defaultDuration, defaultPosition, defaultSeverity, SnackbarContext } from 'src/components/Snackbar';

export const useSnackbar = ({ duration: globalDuration = defaultDuration, position: globalPosition = defaultPosition } = {}) => {
  const { openSnackbar, closeSnackbar } = useContext(SnackbarContext);

  function open(text = '', severity?: AlertProps['severity'] | null, duration?: number | null, position?: SnackbarOrigin | null) {
    openSnackbar?.(text, severity || defaultSeverity, duration || globalDuration, position || globalPosition);
  }

  return [open, closeSnackbar];
};
