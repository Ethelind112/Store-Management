import {
  PointOfSale as PointOfSaleIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { ROUTE } from '../../constants/route';

export const MenuItems = [
    { text: 'Kasir', path: ROUTE.HOME, icon: PointOfSaleIcon },
    { text: 'Produk', path: ROUTE.PRODUCT, icon: InventoryIcon },
];

export const MenuWidth = 240;