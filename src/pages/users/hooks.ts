import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RegisterRequest, User } from "../../types/auth";
import { PaginationResponse } from "../../types/response";
import { userService } from "../../services/userService";
import { useState } from "react";

export function useUsers() {
  const [search, setSearchState] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const trimmedSearch = search.trim() || undefined;

  const { data, isLoading, error, refetch, isRefetching } = useQuery<PaginationResponse<User[]>>({
    queryKey: ['users', currentPage, trimmedSearch],
    queryFn: () =>
      userService.getUsers({
        page: currentPage,
        name: trimmedSearch,
      }),
  });

  const setSearch = (newSearch: string) => {
    setSearchState(newSearch);
    setCurrentPage(1);
  };

  const queryClient = useQueryClient();
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleDeleteUser = async (userId: string) => {
    await deleteUserMutation.mutateAsync(userId);

    // If the deleted row was the only item on a later page, return to the
    // previous page so the list does not remain on an empty page.
    if (currentPage > 1 && data?.data.length === 1) {
      setCurrentPage(currentPage - 1);
    }
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
    handleDeleteUser,
    isDeletingUser: deleteUserMutation.isPending,
  };
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterRequest) => userService.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
