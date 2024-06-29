import { FC } from 'react';
import { formatDate } from 'date-fns';
import { useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { ChevronLeft as ChevronLeftIcon, Menu as MenuIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import { CircularProgress, Grid, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import navigation from 'src/config/navigation';
import siteConfig from 'src/siteConfig';
import store, { RootState } from 'src/store';

import { wpDateToTimestamp } from 'src/utils/common';
import { deleteCookie } from 'src/utils/cookie';

import * as Styled from './styles';
import { blissologyTheme } from './theme';

type LayoutProps = {
  children: JSX.Element | JSX.Element[];
};

const Layout: FC<LayoutProps> = ({ children }) => {
  const appState = (state: RootState['app']) => state.app;
  const authState = (state: RootState['auth']) => state.auth;
  const weddingState = (state: RootState['wedding']) => state.wedding;
  const navigate = useNavigate();
  const location = useLocation();
  const { menuOpen, isLoading } = useSelector(appState);
  const { isLoggedIn } = useSelector(authState);
  const { weddingName, date } = useSelector(weddingState);

  if (!isLoggedIn && location.pathname !== '/') return <Navigate to="/" replace={true} />;

  const toggleDrawer = () => {
    store.dispatch({ type: `app/toggleMenu` });
  };

  const logout = () => {
    store.dispatch({ type: 'auth/logout' });
    deleteCookie('auth_token');
    deleteCookie('username');
  };

  return (
    <ThemeProvider theme={blissologyTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Styled.Header position="absolute" open={menuOpen}>
          <Toolbar
            sx={{
              width: '100%',
              minHeight: '100px',
              display: 'flex',
              alignItems: 'space-between',
              pr: '36px' // keep right padding when drawer closed
            }}>
            {isLoggedIn && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(menuOpen && { display: 'none' })
                }}>
                <MenuIcon />
              </IconButton>
            )}
            <Grid container sx={{ justifyContent: weddingName ? 'flex-end' : 'flex-start', alignItems: 'center' }}>
              <Grid item>
                <Typography component="h1" variant="h6" color="inherit" noWrap>
                  {weddingName || siteConfig.siteTitle}
                </Typography>
                {date && (
                  <Typography variant="body1" component="p" noWrap textAlign={'right'}>
                    {formatDate(wpDateToTimestamp(date), 'd MMMM yyyy')}
                  </Typography>
                )}
              </Grid>

              {isLoggedIn && (
                <Grid item sx={{ pl: '20px' }}>
                  <IconButton color="inherit">
                    <Badge badgeContent={4} color="secondary">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>

                  <IconButton color="inherit" onClick={logout}>
                    <LogoutIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          </Toolbar>
        </Styled.Header>

        {isLoggedIn && (
          <Styled.Drawer variant="permanent" open={menuOpen}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1]
              }}>
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              {navigation.map((item, count) => {
                return (
                  <ListItemButton key={`nav-${count}`} onClick={() => navigate(item.url)} selected={location.pathname === item.url}>
                    <ListItemIcon>
                      <item.icon />
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                );
              })}
              <Divider sx={{ my: 1 }} />
            </List>
          </Styled.Drawer>
        )}

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) => (theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900]),
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto'
          }}>
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {children}
            {/* <Footer sx={{ pt: 4 }} /> */}
          </Container>
        </Box>
      </Box>
      {isLoading && (
        <Styled.LoadingMask>
          <CircularProgress />
        </Styled.LoadingMask>
      )}
    </ThemeProvider>
  );
};

export default Layout;
