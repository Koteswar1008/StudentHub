"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import type { LaundryMachine, LaundrySlot } from '@/lib/types';
import useLocalStorage from '@/hooks/use-local-storage';
import { format, addHours, setHours, setMinutes, setSeconds, setMilliseconds, isSameDay, isPast, parseISO, addDays, startOfDay } from 'date-fns';
import { CalendarDays, Clock, CheckCircle, XCircle, ShoppingBasket, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const sampleMachines: LaundryMachine[] = [
  { id: 'machine1', name: 'Washer A', location: 'Hostel Block 1' },
  { id: 'machine2', name: 'Dryer A', location: 'Hostel Block 1' },
  { id: 'machine3', name: 'Washer B', location: 'Hostel Block 2' },
];

// Generate slots for a given day and machine
const generateSlotsForDay = (machineId: string, day: Date): LaundrySlot[] => {
  const slots: LaundrySlot[] = [];
  const startHour = 8; // 8 AM
  const endHour = 20; // 8 PM
  const slotDuration = 1; // 1 hour

  for (let i = startHour; i < endHour; i += slotDuration) {
    const startTime = setMilliseconds(setSeconds(setMinutes(setHours(day, i),0),0),0);
    const endTime = addHours(startTime, slotDuration);
    slots.push({
      id: uuidv4(),
      machineId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      isBooked: false,
    });
  }
  return slots;
};


export function LaundryBooking() {
  const [machines] = useState<LaundryMachine[]>(sampleMachines);
  const [selectedMachineId, setSelectedMachineId] = useState<string>(sampleMachines[0].id);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date())); // Default to today
  const [bookings, setBookings] = useLocalStorage<LaundrySlot[]>('laundryBookings', []);
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>("Current User"); // Placeholder for actual user

  useEffect(() => {
    // Simulate fetching user name or ID
    // In a real app, this would come from an auth context
    const storedUser = window.localStorage.getItem("studentHubUserName");
    if (storedUser) {
        setUserName(storedUser);
    } else {
        // Simple prompt for demo, replace with actual auth
        const name = prompt("Enter your name for booking:");
        if (name) {
            setUserName(name);
            window.localStorage.setItem("studentHubUserName", name);
        }
    }
  }, []);

  const dailySlots = useMemo(() => {
    const generated = generateSlotsForDay(selectedMachineId, selectedDate);
    // Merge with existing bookings
    return generated.map(slot => {
      const existingBooking = bookings.find(b => 
        b.machineId === selectedMachineId &&
        parseISO(b.startTime).getTime() === parseISO(slot.startTime).getTime() &&
        isSameDay(parseISO(b.startTime), selectedDate)
      );
      return existingBooking ? { ...slot, ...existingBooking, id: existingBooking.id } : slot;
    });
  }, [selectedMachineId, selectedDate, bookings]);

  const handleBookSlot = (slotId: string) => {
    const slotToBook = dailySlots.find(s => s.id === slotId);
    if (!slotToBook || slotToBook.isBooked || isPast(parseISO(slotToBook.startTime))) {
      toast({ title: "Booking Failed", description: "Slot is unavailable or in the past.", variant: "destructive" });
      return;
    }
    
    // Check if user already has a booking for this day (optional rule)
    const userHasBookingToday = bookings.some(b => 
      b.bookedBy === userName && 
      isSameDay(parseISO(b.startTime), selectedDate)
    );
    if(userHasBookingToday) {
         toast({ title: "Booking Limit Reached", description: "You already have a booking for this day.", variant: "destructive" });
         return;
    }


    const newBooking: LaundrySlot = { ...slotToBook, isBooked: true, bookedBy: userName, userId: userName }; // Use userName as userId for demo
    
    setBookings(prev => {
      // Remove any placeholder slot if it exists, then add new booking
      const filtered = prev.filter(b => !(b.machineId === newBooking.machineId && b.startTime === newBooking.startTime));
      return [...filtered, newBooking];
    });

    toast({
      title: "Booking Successful!",
      description: `Slot from ${format(parseISO(newBooking.startTime), 'p')} to ${format(parseISO(newBooking.endTime), 'p')} booked.`,
      action: <CheckCircle className="text-green-500" />,
    });
  };

  const handleCancelBooking = (bookingId: string) => {
     const bookingToCancel = bookings.find(b => b.id === bookingId);
     if (!bookingToCancel || bookingToCancel.bookedBy !== userName) {
         toast({ title: "Cancellation Failed", description: "You can only cancel your own bookings.", variant: "destructive" });
         return;
     }
     if (isPast(addHours(parseISO(bookingToCancel.startTime), -1))) { // Example: Cannot cancel 1 hour before
        toast({ title: "Cancellation Failed", description: "Too late to cancel this booking.", variant: "destructive" });
        return;
     }

    setBookings(prev => prev.filter(b => b.id !== bookingId));
    toast({
      title: "Booking Cancelled",
      description: "Your laundry slot has been cancelled.",
      action: <XCircle className="text-red-500" />,
    });
  };
  
  const selectedMachine = machines.find(m => m.id === selectedMachineId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Laundry Booking</CardTitle>
        <CardDescription>Book laundry slots for available machines.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Select value={selectedMachineId} onValueChange={setSelectedMachineId}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Machine" />
            </SelectTrigger>
            <SelectContent>
              {machines.map(machine => (
                <SelectItem key={machine.id} value={machine.id}>{machine.name} ({machine.location})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedDate(prev => addDays(prev, -1))}>Previous Day</Button>
            <Button variant="outline" disabled>
                <CalendarDays className="mr-2 h-4 w-4" /> {format(selectedDate, 'MMM dd, yyyy')}
            </Button>
            <Button variant="outline" onClick={() => setSelectedDate(prev => addDays(prev, 1))}>Next Day</Button>
          </div>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle className="font-headline">Booking Information</AlertTitle>
          <AlertDescription>
            You are booking as: <strong>{userName}</strong>. Each slot is 1 hour. Please be on time.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {dailySlots.map(slot => (
            <Card key={slot.id} className={`p-3 text-center transition-all duration-200 ${slot.isBooked ? 'bg-muted/70' : 'hover:shadow-md'}`}>
              <div className="flex items-center justify-center mb-1">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <p className="font-semibold">{format(parseISO(slot.startTime), 'p')}</p>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                to {format(parseISO(slot.endTime), 'p')}
              </p>
              {slot.isBooked ? (
                slot.bookedBy === userName ? (
                <>
                  <Badge variant="secondary" className="mb-2 w-full justify-center">Booked by You</Badge>
                   <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => handleCancelBooking(slot.id)} disabled={isPast(addHours(parseISO(slot.startTime), -1))}>
                    Cancel
                  </Button>
                </>
                ) : (
                  <Badge variant="destructive" className="w-full justify-center">Booked</Badge>
                )
              ) : isPast(parseISO(slot.startTime)) ? (
                <Badge variant="outline" className="w-full justify-center">Unavailable</Badge>
              ) : (
                <Button 
                    size="sm" 
                    className="w-full text-xs bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={() => handleBookSlot(slot.id)}
                >
                  Book Slot
                </Button>
              )}
            </Card>
          ))}
        </div>
        {dailySlots.length === 0 && <p className="text-muted-foreground text-center py-4">No slots available for this machine/day.</p>}
      </CardContent>
    </Card>
  );
}
