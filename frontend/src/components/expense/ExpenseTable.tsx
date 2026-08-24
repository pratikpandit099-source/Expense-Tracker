import React, { useState } from 'react';
import { Expense } from '../../types/index.js';
import { ExpenseRow } from './ExpenseRow.js';
import { Skeleton } from '../common/Skeleton.js';
import { EmptyState } from '../common/EmptyState.js';
import { Button } from '../common/Button.js';
import { ConfirmDialog } from '../common/ConfirmDialog.js';
import { ChevronLeft, ChevronRight, Receipt } from 'lucide-react';
import { api } from '../../api/client.js';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Badge } from '../common/Badge.js';
import { formatCurrency, formatDate } from '../../lib/utils.js';
import { Edit2, Trash2 } from 'lucide-react';

interface ExpenseTableProps {
  expenses: Expense[];
  isLoading: boolean;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onEditExpense: (expense: Expense) => void;
  onAddNewExpense: () => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  isLoading,
  total,
  page,
  limit,
  totalPages,
  onPageChange,
  onEditExpense,
  onAddNewExpense,
}) => {
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/expenses/${expenseToDelete._id}`);
      toast.success('Expense deleted successfully');
      
      // Invalidate queries
      await queryClient.invalidateQueries({ queryKey: ['expenses'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      await queryClient.invalidateQueries({ queryKey: ['category-analytics'] });
      await queryClient.invalidateQueries({ queryKey: ['monthly-analytics'] });
      await queryClient.invalidateQueries({ queryKey: ['trend-analytics'] });

      setExpenseToDelete(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete expense');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <EmptyState
        title="No transactions recorded"
        description="No expenses match your current filters. Add a new expense or adjust your filters above."
        actionText="Add New Expense"
        onAction={onAddNewExpense}
        icon={<Receipt className="w-8 h-8" />}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col">
      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Description</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {expenses.map((expense) => (
              <ExpenseRow
                key={expense._id}
                expense={expense}
                onEdit={onEditExpense}
                onDelete={(exp) => setExpenseToDelete(exp)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View (Visible on mobile) */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {expenses.map((expense) => (
          <div key={expense._id} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Badge category={expense.category} />
              <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {formatCurrency(expense.amount, expense.currency)}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {expense.description || <span className="italic text-slate-400">No description</span>}
            </p>
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <span>{formatDate(expense.expenseDate, 'short')}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditExpense(expense)}
                  className="p-1 text-slate-400 hover:text-emerald-500"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setExpenseToDelete(expense)}
                  className="p-1 text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/30">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{expenses.length > 0 ? (page - 1) * limit + 1 : 0}</span> to{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {Math.min(page * limit, total)}
          </span>{' '}
          of <span className="font-semibold text-slate-800 dark:text-slate-200">{total}</span> records
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 px-2">
            Page {page} of {totalPages || 1}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense Record"
        message={`Are you sure you want to permanently delete this ${
          expenseToDelete?.category
        } expense of ${formatCurrency(expenseToDelete?.amount || 0)}? This action cannot be undone.`}
        confirmText="Delete Expense"
        isLoading={isDeleting}
      />
    </div>
  );
};
