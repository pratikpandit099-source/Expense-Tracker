import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client.js';
import { ApiResponse, DashboardSummary, PaginatedExpenses, CategoryAnalyticsItem, MonthlyAnalyticsItem } from '../types/index.js';
import { StatCard } from '../components/dashboard/StatCard.js';
import { RecentExpensesTable } from '../components/dashboard/RecentExpensesTable.js';
import { CategoryPieChart } from '../components/charts/CategoryPieChart.js';
import { MonthlyBarChart } from '../components/charts/MonthlyBarChart.js';
import { ExpenseFormModal } from '../components/expense/ExpenseFormModal.js';
import { Button } from '../components/common/Button.js';
import { formatCurrency } from '../lib/utils.js';
import {
  Wallet,
  Calendar,
  Clock,
  CalendarDays,
  PlusCircle,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 1. Fetch Dashboard Summary
  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<DashboardSummary>>('/expenses/dashboard/summary');
      return res.data.data;
    },
  });

  // 2. Fetch Recent 5 Expenses
  const { data: recentExpensesData, isLoading: isRecentLoading } = useQuery({
    queryKey: ['expenses', 'recent'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PaginatedExpenses>>('/expenses?limit=5&sortBy=expenseDate&sortOrder=desc');
      return res.data.data;
    },
  });

  // 3. Fetch Category Analytics
  const { data: categoryData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['category-analytics'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ categories: CategoryAnalyticsItem[] }>>('/expenses/analytics/category');
      return res.data.data.categories;
    },
  });

  // 4. Fetch Monthly Analytics
  const { data: monthlyData, isLoading: isMonthlyLoading } = useQuery({
    queryKey: ['monthly-analytics'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ monthly: MonthlyAnalyticsItem[] }>>('/expenses/analytics/monthly');
      return res.data.data.monthly;
    },
  });

  const totalSpent = summaryData?.totalSpent || 0;
  const spentToday = summaryData?.spentToday || 0;
  const spentThisWeek = summaryData?.spentThisWeek || 0;
  const spentThisMonth = summaryData?.spentThisMonth || 0;
  const totalCount = summaryData?.totalCount || 0;

  return (
    <div className="space-y-6">
      {/* Top Banner / Quick Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Financial Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time snapshot of your personal expenditures and trends
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Add Expense
          </Button>
        </div>
      </div>

      {/* 4 Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Expenditure"
          value={formatCurrency(totalSpent)}
          subtitle={`${totalCount} total ${totalCount === 1 ? 'record' : 'records'}`}
          icon={<Wallet className="w-5 h-5" />}
          variant="emerald"
          isLoading={isSummaryLoading}
        />

        <StatCard
          title="Spent Today"
          value={formatCurrency(spentToday)}
          subtitle="Since 12:00 AM today"
          icon={<Clock className="w-5 h-5" />}
          variant="indigo"
          isLoading={isSummaryLoading}
        />

        <StatCard
          title="Spent This Week"
          value={formatCurrency(spentThisWeek)}
          subtitle="Current calendar week"
          icon={<Calendar className="w-5 h-5" />}
          variant="amber"
          isLoading={isSummaryLoading}
        />

        <StatCard
          title="Spent This Month"
          value={formatCurrency(spentThisMonth)}
          subtitle="Current calendar month"
          icon={<CalendarDays className="w-5 h-5" />}
          variant="teal"
          isLoading={isSummaryLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart
          data={categoryData || []}
          isLoading={isCategoryLoading}
        />

        <MonthlyBarChart
          data={monthlyData || []}
          isLoading={isMonthlyLoading}
        />
      </div>

      {/* Recent Transactions List */}
      <div>
        <RecentExpensesTable
          expenses={recentExpensesData?.expenses || []}
          isLoading={isRecentLoading}
          onAddNewExpense={() => setIsAddModalOpen(true)}
        />
      </div>

      {/* Add Expense Modal */}
      <ExpenseFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
