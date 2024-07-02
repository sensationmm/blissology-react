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
    MuiAlert: {
      styleOverrides: {
        standardInfo: {
          backgroundColor: palette.secondary.main,
          color: '#fff',
          fontWeight: 'bold',
          '.MuiAlert-icon': {
            color: '#fff'
          }
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          '&.bliss': {
            background: palette.primary.main,
            '.MuiButtonBase-root': {
              color: '#fff'
            },
            '.MuiDivider-root': {
              display: 'none'
            },
            '.MuiDrawer-paper': {
              borderRight: 0
            },
            '.MuiPaper-root': {
              backgroundColor: 'transparent'
            },
            'nav.MuiList-root': {
              paddingTop: 0
            },
            '.MuiListItemButton-root': {
              padding: '16px 16px 16px 8px',
              '&.Mui-selected': {
                background: palette.secondary.main
              }
            },
            '.MuiListItemIcon-root': {
              justifyContent: 'center'
            },
            '.MuiListItemText-primary': {
              paddingLeft: '8px'
            },
            '.MuiSvgIcon-root': {
              fill: '#fff'
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
