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
  typography: {
    h1: {
      fontSize: '3rem',
      color: palette.primary.main,
      fontWeight: 400
    },
    h2: {
      fontSize: '2rem',
      color: palette.primary.main,
      fontWeight: 400
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
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          '&.cards': {
            '.MuiGrid-item': {
              display: 'flex',
              position: 'relative',
              justifyItems: 'stretch',
              alignItems: 'stretch',

              '> div': {
                width: '100%',
                position: 'relative'
              }
            }
          }
        }
      }
    }
  }
});
