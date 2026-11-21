export interface TransactionItemPayload {
  product_id: string;
  quantity: number;
  price: number;
}

export interface CreateTransactionPayload {
  admin_id: string;
  payment_method: string;
  items: TransactionItemPayload[];
}

export interface Transaction {
  id?: string;
  admin_id: string;
  payment_method: string;
  items: TransactionItemPayload[];
  total?: number;
}
