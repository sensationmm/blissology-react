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
      color: palette.primary.main,
      fontSize: '3rem',
      fontWeight: 400
    },
    h2: {
      color: palette.secondary.main,
      fontSize: '2rem',
      fontWeight: 400
    }
  },
  // eslint-disable-next-line sort-keys
  components: {
    MuiAlert: {
      styleOverrides: {
        colorSuccess: {
          background: 'red',
          border: '2px solid red !important'
        },
        root: {
          background: 'red',
          border: '2px solid red !important'
        },
        standardInfo: {
          '.MuiAlert-icon': {
            color: '#fff'
          },
          backgroundColor: palette.secondary.main,
          color: '#fff',
          fontWeight: 'bold'
        },
        standardSuccess: {
          background: 'red',
          border: '2px solid red !important'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: '15px'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          '&.bliss': {
            '.MuiButtonBase-root': {
              color: '#fff'
            },
            '.MuiDivider-root': {
              display: 'none'
            },
            '.MuiDrawer-paper': {
              borderRight: 0
            },
            '.MuiListItemButton-root': {
              '&.Mui-selected': {
                background: palette.secondary.main
              },
              padding: '16px 16px 16px 8px'
            },
            '.MuiListItemIcon-root': {
              justifyContent: 'center'
            },
            '.MuiListItemText-primary': {
              paddingLeft: '8px'
            },
            '.MuiPaper-root': {
              backgroundColor: 'transparent'
            },
            '.MuiSvgIcon-root': {
              fill: '#fff'
            },
            background: palette.primary.main,
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
              '> div': {
                position: 'relative',
                width: '100%'
              },
              alignItems: 'stretch',
              display: 'flex',
              justifyItems: 'stretch',
              position: 'relative'
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
