import { FC, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import siteConfig from 'src/siteConfig';

import { ChevronLeft as ChevronLeftIcon, Menu as MenuIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
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

import Footer from 'src/components/Footer/Footer';

import { useAuthContext } from 'src/contexts/authContext';

import * as Styled from './styles';
import { blissologyTheme } from './theme';

type LayoutProps = {
  children: JSX.Element;
};

const Layout: FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, accountName } = useAuthContext();
  const [open, setOpen] = useState(isLoggedIn);

  if (!isLoggedIn && location.pathname !== '/') return <Navigate to="/" replace={true} />;

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const navigation = [
    {
      icon: DashboardIcon,
      label: 'Dashboard',
      url: '/dashboard'
    },
    {
      icon: RestaurantMenuIcon,
      label: 'Menu',
      url: '/menu'
    },
    {
      icon: HotelIcon,
      label: 'Accommodation',
      url: '/accommodation'
    }
  ];

  return (
    <ThemeProvider theme={blissologyTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Styled.Header position="absolute" open={open}>
          <Toolbar
            sx={{
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
                  ...(open && { display: 'none' })
                }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, textAlign: accountName ? 'right' : 'left' }}>
              {accountName || siteConfig.siteTitle}
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </Styled.Header>

        {isLoggedIn && (
          <Styled.Drawer variant="permanent" open={open}>
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
            <Footer sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
