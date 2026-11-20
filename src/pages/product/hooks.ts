import { useQuery } from "@tanstack/react-query";
import { Product } from "../../types/product";
import { PaginationResponse } from "../../types/response";
import { productService } from "../../services/productService";
import { useState } from "react";
import { Category } from "../../types/category";

export interface SortOption {
    sortBy?: 'name' | 'min_price';
    order?: 'asc' | 'desc';
}

export type sortOption = SortOption;

export function useProducts() {

    const [currentPage, setCurrentPage] = useState(1);
    const [category, setCategory] = useState<Category | null>(null);
    const [sort, setSort] = useState<SortOption | null>(null);
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [search, setSearch] = useState<string>("");

    const parsedMinPrice = minPrice !== "" && !isNaN(Number(minPrice)) ? Number(minPrice) : undefined;
    const parsedMaxPrice = maxPrice !== "" && !isNaN(Number(maxPrice)) ? Number(maxPrice) : undefined;
    const trimmedSearch = search.trim() || undefined;

    const { data, isLoading, error, refetch, isRefetching } = useQuery<PaginationResponse<Product[]>>({
        queryKey: ['products', currentPage, category?.id, sort?.sortBy, sort?.order, parsedMinPrice, parsedMaxPrice, trimmedSearch],
        queryFn: () => productService.getAll({
            page: currentPage,
            category: category?.id || undefined,
            sort_by: sort?.sortBy || undefined,
            order: sort?.order || undefined,
            min_price: parsedMinPrice,
            max_price: parsedMaxPrice,
            name: trimmedSearch,
        }),
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
        sort,
        setSort,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        search,
        setSearch,
        refetch,
        isRefetching,
    };
}
