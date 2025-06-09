export type TimetableEntry = {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  subject: string;
  location?: string;
  instructor?: string;
  color?: string; // Optional color for UI distinction
};

export type MessMenuItem = {
  id: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  items: string[];
};

export type DailyMessMenu = {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  menu: MessMenuItem[];
}

export type Assignment = {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // ISO date string
  description?: string;
  isCompleted: boolean;
};

export type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO date string
  category: string;
};

export type LaundryMachine = {
  id: string;
  name: string;
  location: string;
};

export type LaundrySlot = {
  id: string;
  machineId: string;
  startTime: string; // ISO datetime string (includes date)
  endTime: string; // ISO datetime string (includes date)
  isBooked: boolean;
  bookedBy?: string; // user identifier or name
  userId?: string; // actual user ID if available
};
