import { StyledComponentProps } from '@material-ui/core/styles';

declare module 'react' {
  interface Attributes {
    css?: StyledComponentProps<any> | {};
  }
}

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    tertiary: Palette['primary'];
  }
  interface PaletteOptions {
    tertiary: PaletteOptions['primary'];
  }
}
