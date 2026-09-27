import { categoryService } from "../../services/categoryService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Category } from "../../types/category";

export function useCategories() {

    const { data: cat, isLoading, error } = useQuery<Category[]>({
        queryKey: ['users'],
        queryFn: () => categoryService.getAll(),
    });

    return cat;
}
