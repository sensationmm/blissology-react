import { FC } from 'react';
import { formatDate } from 'date-fns';
import { useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Alert, CircularProgress, Grid, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
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
import { IWeddingDeadline } from 'src/store/reducers/wedding';

import Icon from 'src/components/Icon';

import { blissDate, wpDateToTimestamp } from 'src/utils/common';
import { deleteCookie } from 'src/utils/cookie';

import * as Styled from './styles';
import { blissologyTheme } from './theme';

type LayoutProps = {
  title?: string;
  children: JSX.Element | JSX.Element[];
};

const Layout: FC<LayoutProps> = ({ title, children }) => {
  const uiState = (state: RootState['ui']) => state.ui;
  const authState = (state: RootState['auth']) => state.auth;
  const weddingState = (state: RootState['wedding']) => state.wedding;
  const navigate = useNavigate();
  const location = useLocation();
  const { menuOpen, isLoading } = useSelector(uiState);
  const { isLoggedIn } = useSelector(authState);
  const { weddingName, date, deadlines } = useSelector(weddingState);
  const page = location.pathname.split('/')[1];

  if (!isLoggedIn && location.pathname !== '/') return <Navigate to="/" replace={true} />;

  const toggleDrawer = () => {
    store.dispatch({ type: `ui/toggleMenu` });
  };

  const logout = () => {
    store.dispatch({ type: 'auth/logout' });
    deleteCookie('auth_token');
    deleteCookie('username');
  };

  const getAlert = () => {
    const nextDeadline = deadlines
      .slice()
      .filter((dl: IWeddingDeadline) => dl.attach_to.includes(page))
      .sort((a: IWeddingDeadline, b: IWeddingDeadline) => (a.date > b.date ? 1 : -1))
      .map((dl: IWeddingDeadline) => dl);

    return (
      nextDeadline.length > 0 && (
        <Alert severity="info">
          {nextDeadline[0].name} due {blissDate(nextDeadline[0].date)}
        </Alert>
      )
    );
  };

  return (
    <ThemeProvider theme={blissologyTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Styled.Header position="absolute" open={menuOpen}>
          <Toolbar
            className="bliss"
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
                <Icon iconKey="menu" />
              </IconButton>
            )}
            <Grid container sx={{ justifyContent: weddingName ? 'flex-end' : 'flex-start', alignItems: 'center' }}>
              <Grid item>
                <Typography variant="body1" color="inherit" noWrap sx={{ fontSize: '1.6rem', fontWeight: 400 }}>
                  {weddingName || siteConfig.siteTitle}
                </Typography>
                {date && (
                  <Typography variant="body2" noWrap textAlign={'right'} sx={{ fontSize: '1.2rem', fontWeight: 400 }}>
                    {formatDate(wpDateToTimestamp(date), 'd MMMM yyyy')}
                  </Typography>
                )}
              </Grid>

              {isLoggedIn && (
                <Grid item sx={{ pl: '20px' }}>
                  <IconButton color="inherit">
                    <Badge badgeContent={4} color="secondary">
                      <Icon iconKey="notification" />
                    </Badge>
                  </IconButton>

                  <IconButton color="inherit" onClick={logout}>
                    <Icon iconKey="logout" />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          </Toolbar>
        </Styled.Header>

        {isLoggedIn && (
          <Styled.Drawer className="bliss" variant="permanent" open={menuOpen}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1]
              }}>
              <IconButton onClick={toggleDrawer}>
                <Icon iconKey="back" />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              {navigation.map((item, count) => {
                return (
                  <ListItemButton key={`nav-${count}`} onClick={() => navigate(item.url)} selected={location.pathname === item.url}>
                    <ListItemIcon>
                      <Icon iconKey={item.icon} />
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
          <Container sx={{ my: 4, px: [4] }}>
            {title && (
              <Styled.HeaderBar>
                <>
                  <Typography variant="h1">{title}</Typography>
                  {getAlert()}
                </>
              </Styled.HeaderBar>
            )}
            {children}
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
