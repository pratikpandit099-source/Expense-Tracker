import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client.js';
import { ApiResponse, CategoryAnalyticsItem, MonthlyAnalyticsItem, TrendAnalyticsItem } from '../types/index.js';
import { CategoryPieChart } from '../components/charts/CategoryPieChart.js';
import { MonthlyBarChart } from '../components/charts/MonthlyBarChart.js';
import { SpendingTrendChart } from '../components/charts/SpendingTrendChart.js';
import { StatCard } from '../components/dashboard/StatCard.js';
import { Badge } from '../components/common/Badge.js';
import { formatCurrency } from '../lib/utils.js';
import { Trophy, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Select } from '../components/common/Select.js';
import { CATEGORIES_DATA } from '../lib/constants.js';

export const AnalyticsPage: React.FC = () => {
  const [trendMonths, setTrendMonths] = useState<number>(6);

  // 1. Fetch Category Analytics
  const { data: categoryData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['category-analytics'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ categories: CategoryAnalyticsItem[] }>>('/expenses/analytics/category');
      return res.data.data.categories;
    },
  });

  // 2. Fetch Monthly Analytics
  const { data: monthlyData, isLoading: isMonthlyLoading } = useQuery({
    queryKey: ['monthly-analytics'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ monthly: MonthlyAnalyticsItem[] }>>('/expenses/analytics/monthly');
      return res.data.data.monthly;
    },
  });

  // 3. Fetch Trend Analytics
  const { data: trendData, isLoading: isTrendLoading } = useQuery({
    queryKey: ['trend-analytics', trendMonths],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ trend: TrendAnalyticsItem[] }>>(`/expenses/analytics/trend?months=${trendMonths}`);
      return res.data.data.trend;
    },
  });

  // Calculations
  const categories = categoryData || [];
  const topCategory = categories.length > 0 ? categories[0] : null;

  const totalSpentAcrossCategories = categories.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalCountAcrossCategories = categories.reduce((sum, item) => sum + item.count, 0);
  const averagePerTransaction = totalCountAcrossCategories > 0 ? Math.round(totalSpentAcrossCategories / totalCountAcrossCategories) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Spending Analytics & Insights
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Deep dive into your financial habits with real-time aggregations
          </p>
        </div>

        <div className="w-44">
          <Select
            options={[
              { value: '3', label: 'Last 3 Months' },
              { value: '6', label: 'Last 6 Months' },
              { value: '12', label: 'Last 12 Months' },
            ]}
            value={String(trendMonths)}
            onChange={(e) => setTrendMonths(Number(e.target.value))}
            leftIcon={<Calendar className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Top Spending Category"
          value={topCategory ? topCategory.category : 'N/A'}
          subtitle={topCategory ? `${formatCurrency(topCategory.totalAmount)} (${topCategory.percentage}%)` : 'No expenses recorded'}
          icon={<Trophy className="w-5 h-5" />}
          variant="amber"
          isLoading={isCategoryLoading}
        />

        <StatCard
          title="Average per Transaction"
          value={formatCurrency(averagePerTransaction)}
          subtitle={`Across ${totalCountAcrossCategories} total transactions`}
          icon={<DollarSign className="w-5 h-5" />}
          variant="emerald"
          isLoading={isCategoryLoading}
        />

        <StatCard
          title="Active Categories"
          value={String(categories.length)}
          subtitle="Distinct spending buckets"
          icon={<TrendingUp className="w-5 h-5" />}
          variant="indigo"
          isLoading={isCategoryLoading}
        />
      </div>

      {/* Visualizations Row 1: Category Distribution & Rolling Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart
          data={categories}
          isLoading={isCategoryLoading}
        />

        <SpendingTrendChart
          data={trendData || []}
          isLoading={isTrendLoading}
          title={`${trendMonths}-Month Spending Trend`}
          subtitle="Rolling timeline of monthly financial commitments"
        />
      </div>

      {/* Visualizations Row 2: Annual Monthly Bar Chart */}
      <div>
        <MonthlyBarChart
          data={monthlyData || []}
          isLoading={isMonthlyLoading}
          title={`Monthly Breakdown (${new Date().getFullYear()})`}
        />
      </div>

      {/* Category Breakdown Detail Table */}
      {categories.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Detailed Category Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ranked by total monetary expenditure
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Transactions</th>
                  <th className="py-3 px-4">Share of Spending</th>
                  <th className="py-3 px-4 text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {categories.map((cat) => {
                  const color = CATEGORIES_DATA[cat.category]?.color || '#10b981';
                  return (
                    <tr key={cat.category} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <Badge category={cat.category} />
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {cat.count} {cat.count === 1 ? 'transaction' : 'transactions'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3 max-w-xs">
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${cat.percentage}%`, backgroundColor: color }}
                            />
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 w-12 text-right">
                            {cat.percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-extrabold text-slate-900 dark:text-slate-100 text-right font-mono">
                        {formatCurrency(cat.totalAmount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
