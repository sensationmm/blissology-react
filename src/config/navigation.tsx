import Accommodation from 'src/pages/Accommodation';
import Dashboard from 'src/pages/Dashboard';
import Drink from 'src/pages/Drink';
import Guests from 'src/pages/Guests';
import Menu from 'src/pages/Menu';
import Questions from 'src/pages/Questions';
import Quote from 'src/pages/Quote';
import Suppliers from 'src/pages/Suppliers';
import Upgrades from 'src/pages/Upgrades';

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
    Component: Menu,
    icon: 'dining',
    label: 'Food Package',
    url: '/food'
  },
  {
    Component: Drink,
    icon: 'drink',
    label: 'Drinks Package',
    url: '/drink'
  },
  {
    Component: Upgrades,
    icon: 'upgrade',
    label: 'Upgrades',
    url: '/upgrades'
  },
  {
    Component: Suppliers,
    icon: 'suppliers',
    label: 'Suppliers',
    url: '/suppliers'
  },
  {
    Component: Accommodation,
    icon: 'accommodation',
    label: 'Accommodation',
    url: '/accommodation'
  },
  {
    Component: Questions,
    icon: 'questions',
    label: 'Questions',
    url: '/questions'
  },
  {
    Component: Quote,
    icon: 'quote',
    label: 'Quotes',
    url: '/quote'
  }
];

export default navigation;
