import React from 'react';
import { Link } from 'react-router-dom';
import { Expense } from '../../types/index.js';
import { Badge } from '../common/Badge.js';
import { formatCurrency, formatDate } from '../../lib/utils.js';
import { ArrowRight, Receipt } from 'lucide-react';
import { Skeleton } from '../common/Skeleton.js';
import { EmptyState } from '../common/EmptyState.js';

interface RecentExpensesTableProps {
  expenses: Expense[];
  isLoading: boolean;
  onAddNewExpense: () => void;
}

export const RecentExpensesTable: React.FC<RecentExpensesTableProps> = ({
  expenses,
  isLoading,
  onAddNewExpense,
}) => {
  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Recent Transactions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your latest recorded expenditures
          </p>
        </div>

        <Link
          to="/expenses"
          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 inline-flex items-center gap-1 group"
        >
          View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {expenses.length === 0 ? (
        <EmptyState
          title="No recent expenses"
          description="You haven't logged any expenses yet. Click below to add your first transaction."
          actionText="Add Expense"
          onAction={onAddNewExpense}
          icon={<Receipt className="w-6 h-6" />}
        />
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {expenses.map((expense) => (
            <div
              key={expense._id}
              className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Badge category={expense.category} />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {expense.description || expense.category}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {formatDate(expense.expenseDate, 'short')}
                  </p>
                </div>
              </div>

              <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 font-mono flex-shrink-0">
                {formatCurrency(expense.amount, expense.currency)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
