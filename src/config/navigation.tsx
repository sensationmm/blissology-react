import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

import Accommodation from 'src/pages/Accommodation';
import Dashboard from 'src/pages/Dashboard';
import Guests from 'src/pages/Guests';
import Menu from 'src/pages/Menu';

export type INavigation = {
  icon: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>> & { muiName: string };
  label: string;
  url: string;
  Component: () => JSX.Element;
};

const navigation: INavigation[] = [
  {
    icon: DashboardIcon,
    label: 'Dashboard',
    url: '/dashboard',
    Component: Dashboard
  },
  {
    icon: GroupsIcon,
    label: 'Guests',
    url: '/guests',
    Component: Guests
  },
  {
    icon: RestaurantMenuIcon,
    label: 'Menu',
    url: '/menu',
    Component: Menu
  },
  {
    icon: HotelIcon,
    label: 'Accommodation',
    url: '/accommodation',
    Component: Accommodation
  }
];

export default navigation;
