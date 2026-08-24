export enum ExpenseCategory {
  FOOD_DINING = 'Food & Dining',
  TRANSPORT = 'Transport',
  SHOPPING = 'Shopping',
  RENT = 'Rent',
  BILLS = 'Bills',
  GROCERIES = 'Groceries',
  ENTERTAINMENT = 'Entertainment',
  HEALTH = 'Health',
  EDUCATION = 'Education',
  TRAVEL = 'Travel',
  OTHERS = 'Others',
}

export interface CategoryMetadata {
  id: ExpenseCategory;
  name: string;
  icon: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export const CATEGORIES_METADATA: Record<ExpenseCategory, CategoryMetadata> = {
  [ExpenseCategory.FOOD_DINING]: {
    id: ExpenseCategory.FOOD_DINING,
    name: 'Food & Dining',
    icon: 'Utensils',
    color: '#f97316', // orange-500
    badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    badgeText: 'text-orange-500',
  },
  [ExpenseCategory.TRANSPORT]: {
    id: ExpenseCategory.TRANSPORT,
    name: 'Transport',
    icon: 'Car',
    color: '#0ea5e9', // sky-500
    badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    badgeText: 'text-sky-500',
  },
  [ExpenseCategory.SHOPPING]: {
    id: ExpenseCategory.SHOPPING,
    name: 'Shopping',
    icon: 'ShoppingBag',
    color: '#a855f7', // purple-500
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    badgeText: 'text-purple-500',
  },
  [ExpenseCategory.RENT]: {
    id: ExpenseCategory.RENT,
    name: 'Rent',
    icon: 'Home',
    color: '#6366f1', // indigo-500
    badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    badgeText: 'text-indigo-500',
  },
  [ExpenseCategory.BILLS]: {
    id: ExpenseCategory.BILLS,
    name: 'Bills',
    icon: 'Zap',
    color: '#eab308', // yellow-500
    badgeBg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    badgeText: 'text-yellow-500',
  },
  [ExpenseCategory.GROCERIES]: {
    id: ExpenseCategory.GROCERIES,
    name: 'Groceries',
    icon: 'ShoppingCart',
    color: '#10b981', // emerald-500
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    badgeText: 'text-emerald-500',
  },
  [ExpenseCategory.ENTERTAINMENT]: {
    id: ExpenseCategory.ENTERTAINMENT,
    name: 'Entertainment',
    icon: 'Film',
    color: '#ec4899', // pink-500
    badgeBg: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    badgeText: 'text-pink-500',
  },
  [ExpenseCategory.HEALTH]: {
    id: ExpenseCategory.HEALTH,
    name: 'Health',
    icon: 'HeartPulse',
    color: '#f43f5e', // rose-500
    badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    badgeText: 'text-rose-500',
  },
  [ExpenseCategory.EDUCATION]: {
    id: ExpenseCategory.EDUCATION,
    name: 'Education',
    icon: 'BookOpen',
    color: '#06b6d4', // cyan-500
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    badgeText: 'text-cyan-500',
  },
  [ExpenseCategory.TRAVEL]: {
    id: ExpenseCategory.TRAVEL,
    name: 'Travel',
    icon: 'Plane',
    color: '#14b8a6', // teal-500
    badgeBg: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    badgeText: 'text-teal-500',
  },
  [ExpenseCategory.OTHERS]: {
    id: ExpenseCategory.OTHERS,
    name: 'Others',
    icon: 'Package',
    color: '#64748b', // slate-500
    badgeBg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    badgeText: 'text-slate-500',
  },
};

export const CATEGORIES_LIST = Object.values(CATEGORIES_METADATA);
