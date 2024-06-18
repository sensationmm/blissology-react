import { createTheme } from '@mui/material/styles';
import siteConfig from '../../styleConfig';

export const theme = createTheme({
  palette: {
    primary: {
      main: siteConfig.colorPalette.primary,
    },
    secondary: {
      main: siteConfig.colorPalette.secondary,
    },
  },
});
