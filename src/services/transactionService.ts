import { CreateTransactionPayload, Transaction } from '../types/transaction';
import { Response } from '../types/response';
import { apiClient } from './api';

export const transactionService = {
  create: (payload: CreateTransactionPayload) =>
    apiClient<Response<Transaction>>('transactions', { data: payload }),
};
