import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CategoryAnalyticsItem } from '../../types/index.js';
import { CATEGORIES_DATA } from '../../lib/constants.js';
import { formatCurrency } from '../../lib/utils.js';
import { Skeleton } from '../common/Skeleton.js';
import { EmptyState } from '../common/EmptyState.js';
import { PieChart as PieChartIcon } from 'lucide-react';

interface CategoryPieChartProps {
  data: CategoryAnalyticsItem[];
  isLoading: boolean;
  title?: string;
  subtitle?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as CategoryAnalyticsItem;
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl space-y-1">
        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
          {item.category}
        </p>
        <p className="text-xs text-slate-500 font-mono">
          Amount: <span className="font-bold text-emerald-500">{formatCurrency(item.totalAmount)}</span>
        </p>
        <p className="text-xs text-slate-500">
          Share: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.percentage}%</span> ({item.count} {item.count === 1 ? 'transaction' : 'transactions'})
        </p>
      </div>
    );
  }
  return null;
};

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  data,
  isLoading,
  title = 'Category Breakdown',
  subtitle = 'Distribution of spending across categories',
}) => {
  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-60" />
        <div className="h-64 flex items-center justify-center">
          <Skeleton className="w-48 h-48 rounded-full" />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <EmptyState
          title="No category data"
          description="Log some expenses to see your category breakdown chart."
          icon={<PieChartIcon className="w-6 h-6" />}
        />
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div>
        <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={3}
              dataKey="totalAmount"
              nameKey="category"
            >
              {data.map((entry) => {
                const color = CATEGORIES_DATA[entry.category]?.color || '#10b981';
                return <Cell key={`cell-${entry.category}`} fill={color} />;
              })}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
