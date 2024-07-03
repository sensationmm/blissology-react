import { FC } from 'react';

import AddIcon from '@mui/icons-material/Add';
import CakeIcon from '@mui/icons-material/Cake';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import GroupsIcon from '@mui/icons-material/Groups';
import HotelIcon from '@mui/icons-material/Hotel';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaletteIcon from '@mui/icons-material/Palette';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VideocamIcon from '@mui/icons-material/Videocam';
import { SvgIconProps } from '@mui/material';

const Icons = {
  photographer: CameraAltIcon,
  videographer: VideocamIcon,
  stylist: PaletteIcon,
  cakeMaker: CakeIcon,
  entertainment: MusicNoteIcon,
  caterer: DinnerDiningIcon,
  coordinator: SupportAgentIcon,
  florist: LocalFloristIcon,
  add: AddIcon,
  close: CloseIcon,
  dashboard: DashboardIcon,
  guests: GroupsIcon,
  suppliers: CameraEnhanceIcon,
  menu: RestaurantMenuIcon,
  accommodation: HotelIcon,
  dining: MenuIcon,
  notification: NotificationsIcon,
  logout: LogoutIcon,
  back: ChevronLeftIcon
};

export type IIconKey = keyof typeof Icons;

interface IIcon extends SvgIconProps {
  iconKey: IIconKey;
}

const Icon: FC<IIcon> = ({ iconKey, ...rest }) => {
  const Icon = Icons[iconKey as keyof typeof Icons];

  return <Icon {...rest} />;
};

export default Icon;
