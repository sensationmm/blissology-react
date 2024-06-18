import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { mainListItems } from '../../listItems';
import Footer from '../Footer/Footer';
import * as Styled from './styles';
import { useAuthContext } from '../../contexts/authContext';
import { theme } from './theme';
import siteConfig from '../../styleConfig';

type LayoutProps = {
  children: JSX.Element;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoggedIn } = useAuthContext();
  const [open, setOpen] = React.useState(isLoggedIn);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Styled.Header position='absolute' open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            {isLoggedIn && (
              <IconButton
                edge='start'
                color='inherit'
                aria-label='open drawer'
                onClick={toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography component='h1' variant='h6' color='inherit' noWrap sx={{ flexGrow: 1 }}>
              {siteConfig.siteTitle}
            </Typography>
            <IconButton color='inherit'>
              <Badge badgeContent={4} color='secondary'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </Styled.Header>

        {isLoggedIn && (
          <Styled.Drawer variant='permanent' open={open}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component='nav'>
              {mainListItems}
              <Divider sx={{ my: 1 }} />
            </List>
          </Styled.Drawer>
        )}

        <Box
          component='main'
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
            {children}
            <Footer sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
