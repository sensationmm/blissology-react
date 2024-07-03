/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationError } from 'yup';

export const getYupErrors = (error: ValidationError): Record<string, string> => {
  const errors: Record<string, string> = {};
  error.errors.map((err) => {
    const parts = err.split(' ');

    errors[parts[0]] = err;
  });

  return errors;
};
