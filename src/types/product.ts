import { Category } from "./category";

export interface Product { 
    id: string;
    name: string;
    description: string;
    quantity: number;
    min_price: number;
    max_price: number;
    category: Category;
    image?: string;
}

export interface GetProductsParams {
  page?: number;
  per_page?: number;
  category?: string | number;
  name?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: 'name' | 'min_price';
  order?: 'asc' | 'desc';
}