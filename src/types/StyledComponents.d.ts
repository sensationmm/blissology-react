import { StyledComponentProps } from '@material-ui/core/styles';

declare module 'react' {
  interface Attributes {
    css?: StyledComponentProps<any> | {};
  }
}
