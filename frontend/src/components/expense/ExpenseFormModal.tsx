import React, { useState } from 'react';
import { Modal } from '../common/Modal.js';
import { ExpenseForm } from './ExpenseForm.js';
import { Expense, ExpenseCategory, ApiResponse } from '../../types/index.js';
import { api } from '../../api/client.js';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseToEdit?: Expense | null;
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  onClose,
  expenseToEdit,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (data: {
    category: ExpenseCategory;
    amount: number;
    expenseDate: string;
    description?: string;
  }) => {
    setIsLoading(true);
    try {
      if (expenseToEdit) {
        // Update existing expense
        await api.put<ApiResponse<{ expense: Expense }>>(`/expenses/${expenseToEdit._id}`, data);
        toast.success('Expense updated successfully!');
      } else {
        // Create new expense
        await api.post<ApiResponse<{ expense: Expense }>>('/expenses', data);
        toast.success('Expense recorded successfully!');
      }

      // Invalidate all expense-related queries so dashboard, table, charts auto-refresh
      await queryClient.invalidateQueries({ queryKey: ['expenses'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      await queryClient.invalidateQueries({ queryKey: ['category-analytics'] });
      await queryClient.invalidateQueries({ queryKey: ['monthly-analytics'] });
      await queryClient.invalidateQueries({ queryKey: ['trend-analytics'] });

      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save expense');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expenseToEdit ? 'Edit Expense Record' : 'Record New Expense'}
      description={expenseToEdit ? 'Update transaction details below' : 'Log an expenditure in under 15 seconds'}
    >
      <ExpenseForm
        initialData={expenseToEdit}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onCancel={onClose}
      />
    </Modal>
  );
};
