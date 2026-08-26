import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyAnalyticsItem } from '../../types/index.js';
import { centsToDollars, formatCurrency } from '../../lib/utils.js';
import { Skeleton } from '../common/Skeleton.js';
import { BarChart3 } from 'lucide-react';
import { EmptyState } from '../common/EmptyState.js';

interface MonthlyBarChartProps {
  data: MonthlyAnalyticsItem[];
  isLoading: boolean;
  title?: string;
  subtitle?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as MonthlyAnalyticsItem;
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl space-y-1">
        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{label}</p>
        <p className="text-xs text-slate-500 font-mono">
          Total Spent: <span className="font-bold text-emerald-500">{formatCurrency(item.totalAmount)}</span>
        </p>
        <p className="text-xs text-slate-500">
          Transactions: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.count}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({
  data,
  isLoading,
  title = 'Monthly Spending',
  subtitle = 'Expenditure by month throughout the year',
}) => {
  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-60" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const hasData = data.some((d) => d.totalAmount > 0);

  if (!hasData) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <EmptyState
          title="No monthly data"
          description="Log expenses to populate the monthly comparison chart."
          icon={<BarChart3 className="w-6 h-6" />}
        />
      </div>
    );
  }

  const formattedData = data.map((d) => ({
    ...d,
    amountInDollars: centsToDollars(d.totalAmount),
  }));

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
          <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis
              dataKey="month"
              tickFormatter={(v) => v.split(' ')[0]} // Short month name
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `₹${v}`}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="amountInDollars"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
