import {
  PointOfSale as PointOfSaleIcon,
  Inventory as InventoryIcon,
  ManageAccounts as ManageAccountsIcon,
} from '@mui/icons-material';
import { ROUTE } from '../../constants/route';

export const MenuItems = [
  { text: 'Kasir', path: ROUTE.HOME, icon: PointOfSaleIcon },
  { text: 'Produk', path: ROUTE.PRODUCT, icon: InventoryIcon },
];

export const SuperAdminMenuItems = [
  { text: 'Manajemen Pengguna', path: ROUTE.USERS, icon: ManageAccountsIcon },
];

export const MenuWidth = 240;
