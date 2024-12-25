import { createTheme } from '@mui/material/styles';

const initialThemeSetup = (colorPrimary: string, colorSecondary: string) =>
  createTheme({
    palette: {
      primary: {
        main: colorPrimary
      },
      secondary: {
        main: colorSecondary
      },
      tertiary: {
        dark: '#aaaaaa',
        light: '#dfdfdf',
        main: '#c4c4c4'
      }
    },
    typography: {
      h1: {
        color: colorPrimary,
        fontSize: '3rem',
        fontWeight: 400
      },
      h2: {
        color: colorSecondary,
        fontSize: '2rem',
        fontWeight: 400
      },
      h3: {
        color: colorSecondary,
        fontSize: '1.4rem',
        fontWeight: 400
      }
    }
  });

export const blissologyTheme = (colorPrimary: string = '#a519df', colorSecondary: string = '#da85fd') =>
  createTheme({
    ...initialThemeSetup(colorPrimary, colorSecondary),
    // eslint-disable-next-line sort-keys
    components: {
      MuiAccordion: {
        styleOverrides: {
          root: {
            backgroundColor: '#ffffff',
            borderTop: `4px solid ${initialThemeSetup(colorPrimary, colorSecondary).palette.primary.main}`
          }
        }
      },
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
            backgroundColor: initialThemeSetup(colorPrimary, colorSecondary).palette.secondary.main,
            color: '#fff'
          },
          standardSuccess: {
            '.MuiAlert-icon': {
              color: '#fff'
            },
            backgroundColor: initialThemeSetup(colorPrimary, colorSecondary).palette.secondary.main,
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
            borderTop: `4px solid ${initialThemeSetup(colorPrimary, colorSecondary).palette.primary.main}`,
            padding: '15px',
            position: 'relative'
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
                  background: initialThemeSetup(colorPrimary, colorSecondary).palette.secondary.main
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
              background: initialThemeSetup(colorPrimary, colorSecondary).palette.primary.main,
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
      MuiListItemText: {
        styleOverrides: {
          root: {
            '.MuiTypography-root': {
              whiteSpace: 'nowrap'
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
            '&.invoice': {
              '.MuiTableRow-root': {
                '&:last-of-type': {
                  borderBottom: 0,
                  borderTop: `2px solid ${initialThemeSetup(colorPrimary, colorSecondary).palette.tertiary.dark}`
                }
              }
            },
            borderBottom: 0,
            borderTop: `2px solid ${initialThemeSetup(colorPrimary, colorSecondary).palette.tertiary.dark}`
          }
        }
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '.MuiTableRow-root': {
              border: '0 !important'
            },
            borderTop: 0 //`2px solid ${initialThemeSetup(colorPrimary, colorSecondary).palette.tertiary.dark}`
          }
        }
      },
      // MuiTableRow: {
      //   styleOverrides: {
      //     root: {
      //       '&:last-of-type': {
      //         borderBottom: 0,
      //         borderTop: `2px solid ${initialThemeSetup(colorPrimary, colorSecondary).palette.tertiary.dark}`
      //       }
      //     }
      //   }
      // },
      MuiTabs: {
        styleOverrides: {
          root: {
            '&.secondLevel': {
              background: initialThemeSetup(colorPrimary, colorSecondary).palette.tertiary.light
            },
            background: initialThemeSetup(colorPrimary, colorSecondary).palette.tertiary.main,
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
                background: initialThemeSetup(colorPrimary, colorSecondary).palette.secondary.main
              },
              background: initialThemeSetup(colorPrimary, colorSecondary).palette.primary.main,
              color: '#fff'
            },
            '&:hover': {
              background: initialThemeSetup(colorPrimary, colorSecondary).palette.secondary.main
            },
            background: initialThemeSetup(colorPrimary, colorSecondary).palette.tertiary.light,
            borderColor: `${initialThemeSetup(colorPrimary, colorSecondary).palette.tertiary.dark} !important`,
            borderTopWidth: '1px',
            fontWeight: 600,
            padding: '5px 20px',
            whiteSpace: 'nowrap'
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
            backgroundColor: initialThemeSetup(colorPrimary, colorSecondary).palette.secondary.main
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
