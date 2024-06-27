import { createTheme } from '@mui/material/styles';

import siteConfig from '../../siteConfig';

export const blissologyTheme = createTheme({
  palette: {
    primary: {
      main: siteConfig.colorPalette.primary
    },
    secondary: {
      main: siteConfig.colorPalette.secondary
    }
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        regular: {
          height: 80,
          minHeight: 80
        }
      }
    }
  }
});
