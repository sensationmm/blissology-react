import { createContext, FC, useState } from 'react';

import { Alert, AlertProps, Snackbar as MuiSnackbar, SnackbarOrigin } from '@mui/material';

export const defaultSeverity = 'success';
export const defaultPosition: SnackbarOrigin = { horizontal: 'center', vertical: 'bottom' };
export const defaultDuration = 4000;
export const defaultInterval = 250;

export const SnackbarContext = createContext<{
  openSnackbar: (text: string, severity: AlertProps['severity'], duration: number, position: SnackbarOrigin) => void;
  closeSnackbar: () => void;
}>({ closeSnackbar: () => null, openSnackbar: () => null });

type ISnackbar = {
  children: JSX.Element;
};

const Snackbar: FC<ISnackbar> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [duration, setDuration] = useState(defaultDuration);
  const [position, setPosition] = useState<SnackbarOrigin>(defaultPosition);

  const [severity, setSeverity] = useState<AlertProps['severity'] | undefined>(defaultSeverity);

  const triggerSnackbar = (text: string, severity: AlertProps['severity'], duration: number, position: SnackbarOrigin) => {
    setText(text);
    setSeverity(severity || defaultSeverity);
    setDuration(duration || defaultDuration);
    setPosition(position || defaultPosition);
    setOpen(true);
  };

  const openSnackbar = (text: string, severity: AlertProps['severity'], duration: number, position: SnackbarOrigin) => {
    if (open) {
      setOpen(false);
      setTimeout(() => {
        triggerSnackbar(text, severity, duration, position);
      }, defaultInterval);
    } else {
      triggerSnackbar(text, severity, duration, position);
    }
  };

  const closeSnackbar = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ closeSnackbar, openSnackbar }}>
      {children}

      <MuiSnackbar open={open} autoHideDuration={duration} onClose={closeSnackbar} aria-describedby="client-snackbar" anchorOrigin={position}>
        <Alert variant="filled" onClose={closeSnackbar} severity={severity}>
          {text}
        </Alert>
      </MuiSnackbar>
    </SnackbarContext.Provider>
  );
};

export default Snackbar;
