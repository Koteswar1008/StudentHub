"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TimetableEntry } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

const sampleTimetableData: TimetableEntry[] = [
  { id: '1', day: 'Monday', startTime: '09:00', endTime: '10:00', subject: 'Mathematics 101', location: 'Room A101', instructor: 'Dr. Smith', color: 'bg-blue-100 dark:bg-blue-900 border-blue-500' },
  { id: '2', day: 'Monday', startTime: '11:00', endTime: '12:00', subject: 'Physics 101', location: 'Lab B203', instructor: 'Prof. Jones', color: 'bg-green-100 dark:bg-green-900 border-green-500' },
  { id: '3', day: 'Tuesday', startTime: '10:00', endTime: '11:30', subject: 'Computer Science Introduction', location: 'CS Hub', instructor: 'Dr. Lee', color: 'bg-yellow-100 dark:bg-yellow-900 border-yellow-500' },
  { id: '4', day: 'Wednesday', startTime: '14:00', endTime: '15:00', subject: 'Literature Seminar', location: 'Lib Hall', instructor: 'Ms. Davis', color: 'bg-purple-100 dark:bg-purple-900 border-purple-500' },
  { id: '5', day: 'Thursday', startTime: '09:00', endTime: '10:30', subject: 'Mathematics 101 - Tutorial', location: 'Room A102', instructor: 'Dr. Smith', color: 'bg-blue-100 dark:bg-blue-900 border-blue-500' },
  { id: '6', day: 'Friday', startTime: '13:00', endTime: '14:30', subject: 'Physics 101 - Lab', location: 'Lab B203', instructor: 'Prof. Jones', color: 'bg-green-100 dark:bg-green-900 border-green-500' },
];

const daysOrder: TimetableEntry['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = Array.from({ length: 12 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`); // 8 AM to 7 PM

export function TimetableView() {
  const getEntriesForSlot = (day: TimetableEntry['day'], startTime: string): TimetableEntry[] => {
    return sampleTimetableData.filter(entry => entry.day === day && entry.startTime.startsWith(startTime.substring(0,2)));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Weekly Timetable</CardTitle>
        <CardDescription>Your class schedule for the week.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-24 font-semibold">Time</TableHead>
                {daysOrder.slice(0, 5).map(day => ( // Show Mon-Fri by default
                  <TableHead key={day} className="font-semibold text-center">{day}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeSlots.map(slot => (
                <TableRow key={slot} className="h-24">
                  <TableCell className="font-medium align-top pt-2">{slot}</TableCell>
                  {daysOrder.slice(0, 5).map(day => (
                    <TableCell key={day} className="align-top p-1 border-l">
                      <div className="space-y-1 h-full">
                        {getEntriesForSlot(day, slot).map(entry => (
                          <div key={entry.id} className={`p-2 rounded-md text-xs ${entry.color || 'bg-gray-100 dark:bg-gray-800 border-gray-400'} border-l-4`}>
                            <p className="font-semibold truncate">{entry.subject}</p>
                            {entry.location && <p className="text-muted-foreground truncate">{entry.location}</p>}
                            {entry.instructor && <p className="text-muted-foreground text-xs truncate">({entry.instructor})</p>}
                            <p className="text-muted-foreground text-xs">{entry.startTime} - {entry.endTime}</p>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
            <h3 className="font-headline text-lg mb-2">Legend</h3>
            <div className="flex flex-wrap gap-2">
                {Array.from(new Set(sampleTimetableData.map(e => e.subject))).map((subject, idx) => {
                    const entry = sampleTimetableData.find(e => e.subject === subject);
                    return (
                        <Badge key={idx} variant="outline" className={`border-2 ${entry?.color?.replace('bg-', 'border-').replace(' dark:bg-', ' dark:border-') || 'border-gray-500'}`}>
                           {subject}
                        </Badge>
                    );
                })}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
