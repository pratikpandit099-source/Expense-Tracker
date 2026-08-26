import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { ExpenseCategory } from '../constants/categories.js';

export interface IExpense {
  userId: Types.ObjectId;
  category: ExpenseCategory;
  amount: number; // Stored in cents (e.g. $10.50 = 1050)
  currency: string;
  expenseDate: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExpenseDocument extends IExpense, Document {}

export interface IExpenseModel extends Model<IExpenseDocument> {}

const expenseSchema = new Schema<IExpenseDocument, IExpenseModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    category: {
      type: String,
      enum: {
        values: Object.values(ExpenseCategory),
        message: 'Invalid expense category: {VALUE}',
      },
      required: [true, 'Category is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be greater than 0'],
      validate: {
        validator: Number.isInteger,
        message: 'Amount must be an integer represented in minor currency units (cents)',
      },
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
      trim: true,
    },
    expenseDate: {
      type: Date,
      required: [true, 'Expense date is required'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Compound indexes for optimal querying and performance
// 1. Supports date sorting, recent list queries, and date range filters per user
expenseSchema.index({ userId: 1, expenseDate: -1 });

// 2. Supports category filtering and category-based aggregation pipelines per user
expenseSchema.index({ userId: 1, category: 1 });

export const Expense = mongoose.model<IExpenseDocument, IExpenseModel>('Expense', expenseSchema);
