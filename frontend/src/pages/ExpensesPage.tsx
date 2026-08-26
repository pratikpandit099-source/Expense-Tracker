import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client.js';
import { Expense, ExpenseFilterParams, PaginatedExpenses, ApiResponse } from '../types/index.js';
import { ExpenseFilters } from '../components/expense/ExpenseFilters.js';
import { ExpenseTable } from '../components/expense/ExpenseTable.js';
import { ExpenseFormModal } from '../components/expense/ExpenseFormModal.js';
import { Button } from '../components/common/Button.js';
import { PlusCircle } from 'lucide-react';
import { centsToDollars, formatDate } from '../lib/utils.js';
import { toast } from 'sonner';

export const ExpensesPage: React.FC = () => {
  const [filters, setFilters] = useState<ExpenseFilterParams>({
    page: 1,
    limit: 10,
    sortBy: 'expenseDate',
    sortOrder: 'desc',
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch paginated expenses based on filters
  const { data, isLoading } = useQuery({
    queryKey: ['expenses', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.from) params.append('from', filters.from);
      if (filters.to) params.append('to', filters.to);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const res = await api.get<ApiResponse<PaginatedExpenses>>(`/expenses?${params.toString()}`);
      return res.data.data;
    },
  });

  const handleFilterChange = (newFilters: Partial<ExpenseFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: 'expenseDate',
      sortOrder: 'desc',
    });
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      let exportItems: Expense[] = [];

      try {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.from) params.append('from', filters.from);
        if (filters.to) params.append('to', filters.to);
        if (filters.search) params.append('search', filters.search);
        params.append('limit', '100'); // Export matching items

        const res = await api.get<ApiResponse<PaginatedExpenses>>(`/expenses?${params.toString()}`);
        exportItems = res.data.data.expenses;
      } catch {
        // Fallback to currently displayed expenses
        exportItems = data?.expenses || [];
      }

      if (!exportItems || exportItems.length === 0) {
        toast.info('No expenses available to export');
        return;
      }

      // Build CSV Content with UTF-8 BOM for Excel compatibility
      const headers = ['ID', 'Date', 'Category', 'Description', 'Amount (INR)', 'Currency'];
      const rows = exportItems.map((item) => [
        `"${item._id}"`,
        `"${formatDate(item.expenseDate, 'short')}"`,
        `"${item.category}"`,
        `"${(item.description || '').replace(/"/g, '""')}"`,
        `"${centsToDollars(item.amount).toFixed(2)}"`,
        `"${item.currency || 'USD'}"`,
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ExpenseFlow_Export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${exportItems.length} expenses to CSV`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Expenses History
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Search, filter, categorize, and manage all your expenditure records
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => {
            setExpenseToEdit(null);
            setIsAddModalOpen(true);
          }}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Add Expense
        </Button>
      </div>

      {/* Filters Bar */}
      <ExpenseFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onExportCSV={handleExportCSV}
        isExporting={isExporting}
      />

      {/* Expenses Table */}
      <ExpenseTable
        expenses={data?.expenses || []}
        isLoading={isLoading}
        total={data?.total || 0}
        page={filters.page || 1}
        limit={filters.limit || 10}
        totalPages={data?.totalPages || 1}
        onPageChange={(newPage) => handleFilterChange({ page: newPage })}
        onEditExpense={(expense) => {
          setExpenseToEdit(expense);
          setIsAddModalOpen(true);
        }}
        onAddNewExpense={() => {
          setExpenseToEdit(null);
          setIsAddModalOpen(true);
        }}
      />

      {/* Add / Edit Expense Modal */}
      <ExpenseFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setExpenseToEdit(null);
        }}
        expenseToEdit={expenseToEdit}
      />
    </div>
  );
};
