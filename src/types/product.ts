export interface Product { 
    id: string;
    name: string;
    description: string;
    quantity: number;
    min_price: number;
    max_price: number;
    category: string;
}

export interface GetProductsParams {
  page?: number;
  category?: string | number;
}