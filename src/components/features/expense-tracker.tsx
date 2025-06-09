"use client";

import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { PlusCircle, Trash2, Edit3, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import type { Expense } from '@/lib/types';
import useLocalStorage from '@/hooks/use-local-storage';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const expenseCategories = ["Food", "Transport", "Utilities", "Entertainment", "Shopping", "Education", "Health", "Other"];

export function ExpenseTracker() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Partial<Expense>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());


  const defaultNewExpense: Partial<Expense> = {
    description: '',
    amount: 0,
    date: new Date().toISOString(),
    category: expenseCategories[0],
  };

  const handleOpenForm = (expense?: Expense) => {
    if (expense) {
      setCurrentExpense({ ...expense, date: expense.date ? format(parseISO(expense.date), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : new Date().toISOString() });
      setIsEditing(true);
    } else {
      setCurrentExpense(defaultNewExpense);
      setIsEditing(false);
    }
    setIsFormOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setCurrentExpense(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };

  const handleDateChange = (date?: Date) => {
    setCurrentExpense(prev => ({ ...prev, date: date?.toISOString() }));
  };

  const handleCategoryChange = (value: string) => {
    setCurrentExpense(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentExpense.description || !currentExpense.amount || currentExpense.amount <= 0 || !currentExpense.date || !currentExpense.category) return;

    if (isEditing && currentExpense.id) {
      setExpenses(prev => prev.map(ex => ex.id === currentExpense.id ? { ...ex, ...currentExpense } as Expense : ex));
    } else {
      setExpenses(prev => [...prev, { ...currentExpense, id: uuidv4() } as Expense]);
    }
    setIsFormOpen(false);
    setCurrentExpense({});
    setIsEditing(false);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(ex => ex.id !== id));
  };

  const monthlyExpenses = useMemo(() => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    return expenses.filter(ex => isWithinInterval(parseISO(ex.date), { start, end }))
                   .sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
  }, [expenses, selectedMonth]);

  const totalMonthlyExpense = useMemo(() => {
    return monthlyExpenses.reduce((sum, ex) => sum + ex.amount, 0);
  }, [monthlyExpenses]);

  const expensesByCategory = useMemo(() => {
    const categoryMap: { [key: string]: number } = {};
    monthlyExpenses.forEach(expense => {
      categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount;
    });
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [monthlyExpenses]);

  const handleMonthChange = (offset: number) => {
    setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Expense Tracker</CardTitle>
            <CardDescription>Track your personal expenses and view monthly reports.</CardDescription>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenForm()}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-headline">{isEditing ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" value={currentExpense.description || ''} onChange={handleFormChange} required />
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" name="amount" type="number" step="0.01" value={currentExpense.amount || ''} onChange={handleFormChange} required />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <DatePicker date={currentExpense.date ? parseISO(currentExpense.date) : new Date()} onDateChange={handleDateChange} />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" value={currentExpense.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="submit">{isEditing ? 'Save Changes' : 'Add Expense'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={() => handleMonthChange(-1)}>Previous Month</Button>
            <h3 className="font-headline text-xl">{format(selectedMonth, 'MMMM yyyy')}</h3>
            <Button variant="outline" onClick={() => handleMonthChange(1)}>Next Month</Button>
          </div>
           <Card className="mb-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses This Month</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalMonthlyExpense.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        Compared to last month (feature to be added)
                    </p>
                </CardContent>
            </Card>

            {monthlyExpenses.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Wallet className="mx-auto h-12 w-12 mb-2" />
                <p>No expenses logged for {format(selectedMonth, 'MMMM yyyy')}.</p>
              </div>
            ) : (
              <>
                <h4 className="font-headline text-lg mb-2">Expenses by Category</h4>
                 <div className="h-[300px] mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={expensesByCategory} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                            labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }}/>
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Amount" />
                        </BarChart>
                    </ResponsiveContainer>
                 </div>

                <h4 className="font-headline text-lg mb-2">All Expenses for {format(selectedMonth, 'MMMM yyyy')}</h4>
                <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {monthlyExpenses.map(expense => (
                        <TableRow key={expense.id}>
                        <TableCell>{format(parseISO(expense.date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell className="font-medium">{expense.description}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenForm(expense)} aria-label="Edit expense">
                            <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteExpense(expense.id)} className="text-destructive hover:text-destructive" aria-label="Delete expense">
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </div>
              </>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
