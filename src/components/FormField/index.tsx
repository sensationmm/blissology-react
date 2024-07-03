import { FC } from 'react';

import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';

import { capitalize } from 'src/utils/common';

export type IFormInputType = 'text' | 'select';

export type IFormConfig = {
  [key: string]: {
    type: IFormInputType;
    items?: Array<string>;
  };
};

type IFormField = {
  fieldId: string;
  formConfig: IFormConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup: any;
};

const FormField: FC<IFormField> = ({ fieldId, formConfig, setup }) => {
  const inputType = formConfig[fieldId] || 'text';
  const { onChangeEvent, helperText, ...rest } = setup;

  return inputType.type === 'select' ? (
    <Grid key={`field-${fieldId}`} item xs={12}>
      <FormControl fullWidth>
        <InputLabel id={`${fieldId}-label`} error={rest.error}>
          {capitalize(fieldId)}
        </InputLabel>
        <Select labelId={`${fieldId}-label`} {...rest} onChange={(e) => onChangeEvent(fieldId, e.target?.value as string)}>
          {formConfig[fieldId].items?.map((item: string, count: number) => (
            <MenuItem key={`${fieldId}-item-${count}`} value={item}>
              {capitalize(item)}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText error={rest.error}>{helperText}</FormHelperText>
      </FormControl>
    </Grid>
  ) : (
    <Grid key={`field-${fieldId}`} item xs={12}>
      <TextField type="text" {...rest} helperText={helperText} onChange={(e) => onChangeEvent(fieldId, e.target?.value)} />
    </Grid>
  );
};

export default FormField;
