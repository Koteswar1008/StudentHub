
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker"; // Use this directly
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { PlusCircle, Trash2, Edit3, AlertTriangle, BookOpenCheck } from 'lucide-react'; // Changed BookOpen to BookOpenCheck
import type { Assignment } from '@/lib/types';
import useLocalStorage from '@/hooks/use-local-storage';
import { format, differenceInDays, parseISO, isPast } from 'date-fns';

export function AssignmentTracker() {
  const initialAssignments = useMemo(() => [], []);
  const [assignments, setAssignments] = useLocalStorage<Assignment[]>('assignments', initialAssignments);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Partial<Assignment>>({});
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenForm = useCallback((assignment?: Assignment) => {
    if (assignment) {
      setCurrentAssignment({ 
        ...assignment, 
        dueDate: assignment.dueDate 
          ? format(parseISO(assignment.dueDate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") 
          : new Date().toISOString() 
      });
      setIsEditing(true);
    } else {
      setCurrentAssignment({
        title: '',
        subject: '',
        dueDate: new Date().toISOString(),
        description: '',
        isCompleted: false,
      });
      setIsEditing(false);
    }
    setIsFormOpen(true);
  }, [setCurrentAssignment, setIsEditing, setIsFormOpen]);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentAssignment(prev => ({ ...prev, [name]: value }));
  }, [setCurrentAssignment]);

  const handleDateChange = useCallback((date?: Date) => {
    setCurrentAssignment(prev => ({ ...prev, dueDate: date?.toISOString() }));
  }, [setCurrentAssignment]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAssignment.title || !currentAssignment.subject || !currentAssignment.dueDate) return;

    if (isEditing && currentAssignment.id) {
      setAssignments(prev => prev.map(a => a.id === currentAssignment.id ? { ...a, ...currentAssignment } as Assignment : a));
    } else {
      setAssignments(prev => [...prev, { ...currentAssignment, id: uuidv4(), isCompleted: false } as Assignment]);
    }
    setIsFormOpen(false);
    setCurrentAssignment({}); // Reset current assignment
    setIsEditing(false);
  }, [currentAssignment, isEditing, setAssignments, setIsFormOpen, setCurrentAssignment, setIsEditing]);

  const toggleComplete = (id: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, isCompleted: !a.isCompleted } : a));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const getDeadlineBadge = (dueDate: string, isCompleted: boolean): JSX.Element => {
    if (isCompleted) return <Badge variant="secondary">Completed</Badge>;
    const daysLeft = differenceInDays(parseISO(dueDate), new Date());
    if (isPast(parseISO(dueDate))) return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Overdue</Badge>;
    if (daysLeft <= 1) return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Due Soon ({daysLeft} day{daysLeft !== 1 ? 's' : ''})</Badge>;
    if (daysLeft <= 3) return <Badge variant="outline" className="border-orange-500 text-orange-600">Due in {daysLeft} days</Badge>;
    return <Badge variant="outline">Due in {daysLeft} days</Badge>;
  };
  
  const sortedAssignments = useMemo(() => 
    [...assignments].sort((a, b) => 
      a.isCompleted === b.isCompleted ? differenceInDays(parseISO(a.dueDate), parseISO(b.dueDate)) : a.isCompleted ? 1 : -1
  ), [assignments]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline text-2xl">Assignment Tracker</CardTitle>
          <CardDescription>Manage your assignments and deadlines.</CardDescription>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline">{isEditing ? 'Edit Assignment' : 'Add New Assignment'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={currentAssignment.title || ''} onChange={handleFormChange} required />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" value={currentAssignment.subject || ''} onChange={handleFormChange} required />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <DatePicker 
                  date={currentAssignment.dueDate ? parseISO(currentAssignment.dueDate) : new Date()} 
                  onDateChange={handleDateChange}
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea id="description" name="description" value={currentAssignment.description || ''} onChange={handleFormChange} />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">{isEditing ? 'Save Changes' : 'Add Assignment'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {assignments.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <BookOpenCheck className="mx-auto h-12 w-12 mb-2" /> {/* Changed Icon */}
            <p>No assignments yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Status</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAssignments.map(assignment => (
                  <TableRow key={assignment.id} className={assignment.isCompleted ? 'opacity-60' : ''}>
                    <TableCell>
                      <Checkbox
                        checked={assignment.isCompleted}
                        onCheckedChange={() => toggleComplete(assignment.id)}
                        aria-label={assignment.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                      />
                    </TableCell>
                    <TableCell className={`font-medium ${assignment.isCompleted ? 'line-through' : ''}`}>{assignment.title}</TableCell>
                    <TableCell>{assignment.subject}</TableCell>
                    <TableCell>{format(parseISO(assignment.dueDate), 'PPp')}</TableCell>
                    <TableCell>{getDeadlineBadge(assignment.dueDate, assignment.isCompleted)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenForm(assignment)} aria-label="Edit assignment">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteAssignment(assignment.id)} className="text-destructive hover:text-destructive" aria-label="Delete assignment">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

  