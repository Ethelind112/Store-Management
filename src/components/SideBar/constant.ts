import {
  PointOfSale as PointOfSaleIcon,
  Inventory as InventoryIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { ROUTE } from '../../constants/route';

export const MenuItems = [
  { text: 'Kasir', path: ROUTE.HOME, icon: PointOfSaleIcon },
  { text: 'Produk', path: ROUTE.PRODUCT, icon: InventoryIcon },
];

export const AdminMenuItems = [
  { text: 'Tambah User', path: ROUTE.REGISTER, icon: PersonAddIcon },
];

export const MenuWidth = 240;
