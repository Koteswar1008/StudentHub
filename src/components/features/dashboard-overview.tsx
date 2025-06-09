"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, Utensils, BookOpen, Wallet, ShoppingBasket } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const quickAccessItems = [
  { title: "View Timetable", href: "/timetable", icon: CalendarDays, description: "Check your weekly class schedule.", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { title: "See Mess Menu", href: "/mess-menu", icon: Utensils, description: "Today's meals at a glance.", color: "bg-green-500/10 text-green-600 dark:text-green-400" },
  { title: "Track Assignments", href: "/assignments", icon: BookOpen, description: "Manage your upcoming deadlines.", color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" },
  { title: "Log Expenses", href: "/expenses", icon: Wallet, description: "Keep an eye on your spending.", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  { title: "Book Laundry", href: "/laundry", icon: ShoppingBasket, description: "Schedule your laundry time.", color: "bg-pink-500/10 text-pink-600 dark:text-pink-400" },
];

export function DashboardOverview() {
  // In a real app, you'd fetch upcoming events, deadlines, etc.
  const upcomingEvents = [
    { id: "1", title: "Math Midterm", date: "2024-07-28", type: "assignment" },
    { id: "2", title: "Physics Lecture", date: "2024-07-26", time: "10:00 AM", type: "class" },
  ];
  const userName = "Student"; // Placeholder

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Welcome back, {userName}!</h1>
        <p className="text-muted-foreground">Here's what's happening today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quickAccessItems.map(item => (
          <Card key={item.title} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <div className={cn("p-2 rounded-md", item.color)}>
                <item.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground h-10">{item.description}</p>
              <Button variant="ghost" size="sm" asChild className="mt-2 -ml-2">
                <Link href={item.href}>
                  Go to {item.title.split(" ")[1]} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Upcoming Deadlines & Events</CardTitle>
            <CardDescription>Don't miss these important dates.</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <ul className="space-y-3">
                {upcomingEvents.map(event => (
                  <li key={event.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {event.type === 'class' && event.time ? ` at ${event.time}` : ''}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={event.type === "assignment" ? "/assignments" : "/timetable"}>View</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No upcoming events or deadlines for now. Relax!</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Campus News & Updates</CardTitle>
             <CardDescription>Stay informed about what's happening.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-start space-x-4">
                <Image src="https://placehold.co/80x80.png" alt="Campus Event" width={80} height={80} className="rounded-md" data-ai-hint="event students" />
                <div>
                    <h3 className="font-semibold">Tech Fest 2024 Announced</h3>
                    <p className="text-sm text-muted-foreground">Get ready for exciting workshops and competitions. Dates: Aug 15-17.</p>
                    <Button variant="link" size="sm" asChild className="px-0 h-auto">
                        <Link href="#">Read More</Link>
                    </Button>
                </div>
             </div>
             <div className="flex items-start space-x-4">
                <Image src="https://placehold.co/80x80.png" alt="Library Update" width={80} height={80} className="rounded-md" data-ai-hint="library books" />
                <div>
                    <h3 className="font-semibold">Library Extended Hours</h3>
                    <p className="text-sm text-muted-foreground">The library will be open until midnight during exam season.</p>
                     <Button variant="link" size="sm" asChild className="px-0 h-auto">
                        <Link href="#">Details</Link>
                    </Button>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

