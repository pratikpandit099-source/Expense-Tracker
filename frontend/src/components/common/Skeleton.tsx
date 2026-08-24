import React from 'react';
import { cn } from '../../lib/utils.js';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800/80',
        className
      )}
      {...props}
    />
  );
};
