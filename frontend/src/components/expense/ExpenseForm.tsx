import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Expense, ExpenseCategory } from '../../types/index.js';
import { centsToDollars, dollarsToCents, formatISODateForInput } from '../../lib/utils.js';
import { Button } from '../common/Button.js';
import { Input } from '../common/Input.js';
import { Select } from '../common/Select.js';
import { DollarSign, Calendar, FileText } from 'lucide-react';
import { CategoryIcon } from '../common/CategoryIcon.js';

const expenseFormSchema = z.object({
  category: z.nativeEnum(ExpenseCategory, {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
  amount: z
    .coerce
    .number({ invalid_type_error: 'Please enter a valid amount' })
    .positive('Amount must be greater than $0')
    .max(1000000, 'Amount cannot exceed $1,000,000'),
  expenseDate: z
    .string()
    .min(1, 'Please choose a date')
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
});

type ExpenseFormData = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  initialData?: Expense | null;
  onSubmit: (data: {
    category: ExpenseCategory;
    amount: number; // in cents
    expenseDate: string;
    description?: string;
  }) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      category: initialData?.category || ExpenseCategory.FOOD_DINING,
      amount: initialData ? centsToDollars(initialData.amount) : ('' as any),
      expenseDate: initialData?.expenseDate
        ? formatISODateForInput(initialData.expenseDate)
        : formatISODateForInput(new Date()),
      description: initialData?.description || '',
    },
  });

  const selectedCategory = watch('category');

  const onFormSubmit = async (data: ExpenseFormData) => {
    await onSubmit({
      category: data.category,
      amount: dollarsToCents(data.amount),
      expenseDate: new Date(data.expenseDate).toISOString(),
      description: data.description?.trim(),
    });
  };

  const categoryOptions = Object.values(ExpenseCategory).map((cat) => ({
    value: cat,
    label: cat,
  }));

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Category Select */}
      <div>
        <Select
          label="Category"
          options={categoryOptions}
          error={errors.category?.message}
          leftIcon={<CategoryIcon category={selectedCategory} className="w-4 h-4 text-emerald-500" />}
          {...register('category')}
        />
      </div>

      {/* Amount Input */}
      <div>
        <Input
          label="Amount (USD)"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.amount?.message}
          leftIcon={<DollarSign className="w-4 h-4" />}
          {...register('amount')}
        />
      </div>

      {/* Date Input */}
      <div>
        <Input
          label="Expense Date"
          type="date"
          error={errors.expenseDate?.message}
          leftIcon={<Calendar className="w-4 h-4" />}
          {...register('expenseDate')}
        />
      </div>

      {/* Description Input */}
      <div>
        <Input
          label="Note / Description (Optional)"
          type="text"
          placeholder="e.g. Dinner with team, monthly train pass"
          error={errors.description?.message}
          leftIcon={<FileText className="w-4 h-4" />}
          {...register('description')}
        />
      </div>

      {/* Submit / Cancel Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" isLoading={isLoading}>
          {initialData ? 'Save Changes' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
};
