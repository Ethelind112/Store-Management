import { useQuery } from "@tanstack/react-query";
import { Product } from "../../types/product";
import { PaginationResponse } from "../../types/response";
import { productService } from "../../services/productService";
import { useState } from "react";

export function useProducts() {

    const [currentPage, setCurrentPage] = useState(1);
    const [categoryId, setCategoryId] = useState<string | null>(null);

    const { data, isLoading, error } = useQuery<PaginationResponse<Product[]>>({
        queryKey: ['products', currentPage, categoryId],
        queryFn: () => productService.getAll({ page: currentPage, categoryId: categoryId || undefined }),
    });

    return {
        data: data?.data || [],
        isLoading,
        error,
        totalPages: data?.meta?.total_pages || 0,
    };
}