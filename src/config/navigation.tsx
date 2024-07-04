import Accommodation from 'src/pages/Accommodation';
import Dashboard from 'src/pages/Dashboard';
import Guests from 'src/pages/Guests';
import Menu from 'src/pages/Menu';
import Suppliers from 'src/pages/Suppliers';

import { IIconKey } from 'src/components/Icon';

export type INavigation = {
  icon: IIconKey;
  label: string;
  url: string;
  Component: () => JSX.Element;
};

const navigation: INavigation[] = [
  {
    Component: Dashboard,
    icon: 'dashboard',
    label: 'Dashboard',
    url: '/dashboard'
  },
  {
    Component: Guests,
    icon: 'guests',
    label: 'Guests',
    url: '/guests'
  },
  {
    Component: Suppliers,
    icon: 'suppliers',
    label: 'Suppliers',
    url: '/suppliers'
  },
  {
    Component: Menu,
    icon: 'dining',
    label: 'Menu',
    url: '/menu'
  },
  {
    Component: Accommodation,
    icon: 'accommodation',
    label: 'Accommodation',
    url: '/accommodation'
  }
];

export default navigation;
