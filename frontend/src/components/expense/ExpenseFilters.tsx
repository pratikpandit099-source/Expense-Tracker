import React, { useEffect, useState } from 'react';
import { ExpenseCategory, ExpenseFilterParams } from '../../types/index.js';
import { Input } from '../common/Input.js';
import { Select } from '../common/Select.js';
import { Button } from '../common/Button.js';
import { Search, Filter, RotateCcw, Calendar, ArrowUpDown, Download } from 'lucide-react';

interface ExpenseFiltersProps {
  filters: ExpenseFilterParams;
  onFilterChange: (newFilters: Partial<ExpenseFilterParams>) => void;
  onReset: () => void;
  onExportCSV?: () => void;
  isExporting?: boolean;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  onExportCSV,
  isExporting = false,
}) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // 300ms debounce for search query input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (filters.search || '')) {
        onFilterChange({ search: searchInput, page: 1 });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, filters.search, onFilterChange]);

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...Object.values(ExpenseCategory).map((cat) => ({
      value: cat,
      label: cat,
    })),
  ];

  const sortOptions = [
    { value: 'expenseDate-desc', label: 'Date: Newest First' },
    { value: 'expenseDate-asc', label: 'Date: Oldest First' },
    { value: 'amount-desc', label: 'Amount: Highest First' },
    { value: 'amount-asc', label: 'Amount: Lowest First' },
    { value: 'category-asc', label: 'Category: A to Z' },
  ];

  const currentSortValue = `${filters.sortBy || 'expenseDate'}-${filters.sortOrder || 'desc'}`;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split('-') as [any, any];
    onFilterChange({ sortBy, sortOrder, page: 1 });
  };

  const hasActiveFilters =
    !!filters.search ||
    !!filters.category ||
    !!filters.from ||
    !!filters.to ||
    filters.sortBy !== 'expenseDate' ||
    filters.sortOrder !== 'desc';

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
      {/* Top Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <Input
          placeholder="Search descriptions..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />

        {/* Category */}
        <Select
          options={categoryOptions}
          value={filters.category || ''}
          onChange={(e) => onFilterChange({ category: e.target.value || undefined, page: 1 })}
          leftIcon={<Filter className="w-4 h-4" />}
        />

        {/* Date From */}
        <Input
          type="date"
          placeholder="From"
          value={filters.from || ''}
          onChange={(e) => onFilterChange({ from: e.target.value || undefined, page: 1 })}
          leftIcon={<Calendar className="w-4 h-4" />}
        />

        {/* Date To */}
        <Input
          type="date"
          placeholder="To"
          value={filters.to || ''}
          onChange={(e) => onFilterChange({ to: e.target.value || undefined, page: 1 })}
          leftIcon={<Calendar className="w-4 h-4" />}
        />
      </div>

      {/* Secondary Row: Sorting + Reset + Export */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-52">
            <Select
              options={sortOptions}
              value={currentSortValue}
              onChange={handleSortChange}
              leftIcon={<ArrowUpDown className="w-4 h-4" />}
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchInput('');
                onReset();
              }}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Reset
            </Button>
          )}
        </div>

        {onExportCSV && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExportCSV}
            isLoading={isExporting}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
        )}
      </div>
    </div>
  );
};
