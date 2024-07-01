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
      color: palette.secondary.main,
      fontWeight: 400
    }
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        root: {
          '&.bliss': {
            background: palette.primary.main,
            '.MuiPaper-root': {
              backgroundColor: 'transparent'
            },
            '.MuiDivider-root': {
              display: 'none'
            },
            '.MuiSvgIcon-root': {
              fill: '#fff'
            },
            '.MuiButtonBase-root': {
              color: '#fff'
            },
            '.MuiListItemIcon-root': {
              justifyContent: 'center'
            },
            '.MuiListItemButton-root': {
              paddingLeft: '8px'
            },
            '.MuiListItemText-primary': {
              paddingLeft: '8px'
            },
            '.MuiListItemButton-root.Mui-selected': {
              background: palette.secondary.main
            },
            '.MuiDrawer-paper': {
              borderRight: 0
            },
            'nav.MuiList-root': {
              paddingTop: 0
            }
          }
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
    },
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
