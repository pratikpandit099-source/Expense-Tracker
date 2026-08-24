import React from 'react';
import { cn } from '../../lib/utils.js';
import { Skeleton } from '../common/Skeleton.js';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'emerald' | 'indigo' | 'amber' | 'teal';
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'emerald',
  isLoading = false,
}) => {
  const iconVariants = {
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    teal: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
  };

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-3 w-28" />
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <div
          className={cn(
            'w-11 h-11 rounded-2xl flex items-center justify-center border transition-transform hover:scale-105',
            iconVariants[variant]
          )}
        >
          {icon}
        </div>
      </div>

      <div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
          {value}
        </h3>
        {subtitle && (
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
