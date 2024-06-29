import { FC, useEffect, useState } from 'react';

import { TextField } from '@mui/material';

type IReduxTextField = {
  id: string;
  type: 'text' | 'number';
  initialValue: string | number;
  label: string;
  disabled: boolean;
  onBlur: (value: string) => void;
};

const ReduxTextField: FC<IReduxTextField> = ({ id, initialValue, type, label, disabled, onBlur }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    initialValue !== value && setValue(initialValue);
  }, [initialValue]);

  return <TextField type={type} id={id} label={label} value={value} disabled={disabled} onChange={(e) => setValue(e.target.value)} onBlur={(e) => onBlur(e.target.value)} />;
};

export default ReduxTextField;
