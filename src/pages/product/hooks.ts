import { useQuery } from "@tanstack/react-query";
import { Product } from "../../types/product";
import { PaginationResponse } from "../../types/response";
import { productService } from "../../services/productService";
import { useState } from "react";
import { Category } from "../../types/category";

export function useProducts() {

    const [currentPage, setCurrentPage] = useState(1);
    const [category, setCategory] = useState<Category | null>(null);

    const { data, isLoading, error, refetch, isRefetching } = useQuery<PaginationResponse<Product[]>>({
        queryKey: ['products', currentPage, category?.id],
        queryFn: () => productService.getAll({ page: currentPage, category: category?.id || undefined }),
    });

    return {
        data: data?.data || [],
        isLoading,
        error,
        totalPages: data?.meta?.total_pages || 0,
        currentPage,
        setCurrentPage,
        category,
        setCategory,
        refetch,
        isRefetching,
    };
}