import React from 'react';
import { cn } from '../../lib/utils.js';
import { ExpenseCategory } from '../../types/index.js';
import { CATEGORIES_DATA } from '../../lib/constants.js';
import { CategoryIcon } from './CategoryIcon.js';

interface BadgeProps {
  category?: ExpenseCategory | string;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  children?: React.ReactNode;
  showIcon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  category,
  className,
  variant = 'default',
  children,
  showIcon = true,
}) => {
  if (category && CATEGORIES_DATA[category as ExpenseCategory]) {
    const meta = CATEGORIES_DATA[category as ExpenseCategory];
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors select-none',
          meta.badgeBg,
          className
        )}
      >
        {showIcon && <CategoryIcon category={category} className="w-3.5 h-3.5" />}
        {children || meta.name}
      </span>
    );
  }

  const variantStyles = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
