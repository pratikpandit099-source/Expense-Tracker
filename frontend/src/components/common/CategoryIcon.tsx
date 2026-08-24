import React from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  Home,
  Zap,
  ShoppingCart,
  Film,
  HeartPulse,
  BookOpen,
  Plane,
  Package,
  LucideProps,
} from 'lucide-react';
import { ExpenseCategory } from '../../types/index.js';

interface CategoryIconProps extends LucideProps {
  category: ExpenseCategory | string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className, ...props }) => {
  switch (category) {
    case ExpenseCategory.FOOD_DINING:
    case 'Utensils':
      return <Utensils className={className} {...props} />;
    case ExpenseCategory.TRANSPORT:
    case 'Car':
      return <Car className={className} {...props} />;
    case ExpenseCategory.SHOPPING:
    case 'ShoppingBag':
      return <ShoppingBag className={className} {...props} />;
    case ExpenseCategory.RENT:
    case 'Home':
      return <Home className={className} {...props} />;
    case ExpenseCategory.BILLS:
    case 'Zap':
      return <Zap className={className} {...props} />;
    case ExpenseCategory.GROCERIES:
    case 'ShoppingCart':
      return <ShoppingCart className={className} {...props} />;
    case ExpenseCategory.ENTERTAINMENT:
    case 'Film':
      return <Film className={className} {...props} />;
    case ExpenseCategory.HEALTH:
    case 'HeartPulse':
      return <HeartPulse className={className} {...props} />;
    case ExpenseCategory.EDUCATION:
    case 'BookOpen':
      return <BookOpen className={className} {...props} />;
    case ExpenseCategory.TRAVEL:
    case 'Plane':
      return <Plane className={className} {...props} />;
    case ExpenseCategory.OTHERS:
    case 'Package':
    default:
      return <Package className={className} {...props} />;
  }
};
