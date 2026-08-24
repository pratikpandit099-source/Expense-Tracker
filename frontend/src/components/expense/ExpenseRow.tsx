import React from 'react';
import { Expense } from '../../types/index.js';
import { Badge } from '../common/Badge.js';
import { formatCurrency, formatDate } from '../../lib/utils.js';
import { Edit2, Trash2 } from 'lucide-react';

interface ExpenseRowProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export const ExpenseRow: React.FC<ExpenseRowProps> = ({ expense, onEdit, onDelete }) => {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group">
      {/* Category Badge */}
      <td className="py-3.5 px-4">
        <Badge category={expense.category} />
      </td>

      {/* Description / Note */}
      <td className="py-3.5 px-4 text-sm font-medium text-slate-800 dark:text-slate-200">
        {expense.description ? (
          <span className="line-clamp-1">{expense.description}</span>
        ) : (
          <span className="text-slate-400 dark:text-slate-600 italic">No description</span>
        )}
      </td>

      {/* Date */}
      <td className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {formatDate(expense.expenseDate, 'short')}
      </td>

      {/* Amount */}
      <td className="py-3.5 px-4 text-sm font-extrabold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap font-mono">
        {formatCurrency(expense.amount, expense.currency)}
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100">
          <button
            onClick={() => onEdit(expense)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit expense"
            aria-label="Edit expense"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(expense)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Delete expense"
            aria-label="Delete expense"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
