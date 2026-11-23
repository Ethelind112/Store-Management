import { useQuery } from "@tanstack/react-query";
import { User } from "../../types/auth";
import { PaginationResponse } from "../../types/response";
import { userService } from "../../services/userService";
import { useState } from "react";

export function useUsers() {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    

    const trimmedSearch = search.trim() || undefined;

    const { data, isLoading, error, refetch, isRefetching } = useQuery<PaginationResponse<User[]>>({
        queryKey: ['users', currentPage, trimmedSearch],
        queryFn: () => userService.getUsers({
            page: currentPage,
            name: trimmedSearch,
        }),
    });

    const handleDeleteUser = async (userId: string) => {
        // try {
        //     await userService.deleteUser(userId);
        // } catch (error) {
        //     console.error('Error deleting user:', error);
        // }
        console.log("Delete User")
    };

    return {
        data: data?.data || [],
        isLoading,
        error,
        totalPages: data?.meta?.total_pages || 0,
        totalData: data?.meta?.total_items || 0,
        refetch,
        isRefetching,
        search,
        setSearch,
        currentPage,
        setCurrentPage,
        handleDeleteUser
    }
}