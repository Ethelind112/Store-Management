import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "../../services/transactionService";
import { CreateTransactionPayload } from "../../types/transaction";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      transactionService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
