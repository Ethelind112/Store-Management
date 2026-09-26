import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { ROUTE } from '../../constants/route';

export const MenuItems = [
    { text: 'Kasir', path: ROUTE.HOME, icon: HomeIcon },
    { text: 'Dashboard', path: ROUTE.DASHBOARD, icon: DashboardIcon },
];

export const MenuWidth = 240;