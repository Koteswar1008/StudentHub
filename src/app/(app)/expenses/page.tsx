import { ExpenseTracker } from "@/components/features/expense-tracker";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Expenses - Student Hub',
};

export default function ExpensesPage() {
  return <ExpenseTracker />;
}
