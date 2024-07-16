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
    dark: '#aaaaaa',
    light: '#dfdfdf',
    main: '#c4c4c4'
  }
};

const initialThemeSetup = createTheme({
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
    },
    h3: {
      color: palette.secondary.main,
      fontSize: '1.4rem',
      fontWeight: 400
    }
  }
});

export const blissologyTheme = createTheme({
  ...initialThemeSetup,
  // eslint-disable-next-line sort-keys
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          '&.condensed': {
            paddingBottom: 0,
            paddingTop: '1px'
          },
          fontWeight: 'bold'
        },
        standardInfo: {
          '.MuiAlert-icon': {
            color: '#fff'
          },
          backgroundColor: palette.secondary.main,
          color: '#fff'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          fontWeight: 600
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderTop: `4px solid ${initialThemeSetup.palette.primary.main}`,
          padding: '15px'
        }
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          position: 'relative'
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        '.MuiBox-root': {
          width: '100%'
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
            },
            '> div': {
              width: '100%'
            },
            '> div > div > .MuiBox-root': {
              padding: '36px 0 0 18px'
            }
          }
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600
        }
      }
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          borderBottom: `2px solid ${initialThemeSetup.palette.tertiary.dark}`,
          borderTop: `2px solid ${initialThemeSetup.palette.tertiary.dark}`
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          borderTop: `2px solid ${initialThemeSetup.palette.tertiary.dark}`
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-of-type': {
            borderTop: `2px solid ${initialThemeSetup.palette.tertiary.dark}`
          }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '&.secondLevel': {
            background: initialThemeSetup.palette.tertiary.light
          },
          background: initialThemeSetup.palette.tertiary.main,
          boxSizing: 'content-box',
          // marginLeft: '-20px',
          // marginRight: '-40px',
          // paddingLeft: '40px',
          width: '100%'
        }
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            '&:hover': {
              background: initialThemeSetup.palette.secondary.main
            },
            background: initialThemeSetup.palette.primary.main,
            color: '#fff'
          },
          '&:hover': {
            background: initialThemeSetup.palette.secondary.main
          },
          background: initialThemeSetup.palette.tertiary.light,
          borderColor: `${initialThemeSetup.palette.tertiary.dark} !important`,
          borderTopWidth: '1px',
          fontWeight: 600,
          padding: '5px 20px'
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
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: initialThemeSetup.palette.secondary.main
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          whiteSpace: 'pre-wrap'
        }
      }
    }
  }
});
