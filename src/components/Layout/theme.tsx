import { createTheme } from '@mui/material/styles';

import siteConfig from 'src/siteConfig';

const palette = {
  primary: {
    main: siteConfig.colorPalette.primary
  },
  secondary: {
    main: siteConfig.colorPalette.secondary
  },
  tertiary: {
    main: '#c4c4c4'
  }
};

export const blissologyTheme = createTheme({
  palette: palette,
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
