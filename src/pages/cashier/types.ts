// Local product model used by the Cashier page (operates on sample/offline data)
export interface CashierProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface CartItem {
  product: CashierProduct;
  quantity: number;
}