"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DailyMessMenu, MessMenuItem } from '@/lib/types';
import { Utensils, Coffee, Soup,Cookie } from 'lucide-react'; // Icons for meal types

const sampleMessMenuData: DailyMessMenu[] = [
  {
    day: 'Monday',
    menu: [
      { id: 'm1', mealType: 'Breakfast', items: ['Poha', 'Tea/Coffee', 'Banana'] },
      { id: 'm2', mealType: 'Lunch', items: ['Roti', 'Dal Makhani', 'Rice', 'Salad', 'Aloo Gobi'] },
      { id: 'm3', mealType: 'Dinner', items: ['Chapati', 'Mixed Veg Curry', 'Rice', 'Curd'] },
    ],
  },
  {
    day: 'Tuesday',
    menu: [
      { id: 't1', mealType: 'Breakfast', items: ['Idli Sambar', 'Tea/Coffee'] },
      { id: 't2', mealType: 'Lunch', items: ['Roti', 'Rajma Chawal', 'Salad', 'Bhindi Fry'] },
      { id: 't3', mealType: 'Dinner', items: ['Paratha', 'Paneer Butter Masala', 'Rice', 'Gulab Jamun'] },
    ],
  },
  // ... Add data for other days ...
  {
    day: 'Wednesday',
    menu: [
      { id: 'w1', mealType: 'Breakfast', items: ['Aloo Paratha', 'Curd', 'Tea/Coffee'] },
      { id: 'w2', mealType: 'Lunch', items: ['Roti', 'Chole Bhature', 'Rice', 'Salad'] },
      { id: 'w3', mealType: 'Dinner', items: ['Chapati', 'Dal Tadka', 'Baingan Bharta', 'Rice'] },
    ],
  },
  {
    day: 'Thursday',
    menu: [
      { id: 'th1', mealType: 'Breakfast', items: ['Upma', 'Tea/Coffee', 'Apple'] },
      { id: 'th2', mealType: 'Lunch', items: ['Roti', 'Vegetable Biryani', 'Raita', 'Salad'] },
      { id: 'th3', mealType: 'Dinner', items: ['Chapati', 'Matar Paneer', 'Rice', 'Kheer'] },
    ],
  },
  {
    day: 'Friday',
    menu: [
      { id: 'f1', mealType: 'Breakfast', items: ['Bread Omelette/Toast Butter', 'Tea/Coffee'] },
      { id: 'f2', mealType: 'Lunch', items: ['Roti', 'Dal Fry', 'Aloo Jeera', 'Rice', 'Salad'] },
      { id: 'f3', mealType: 'Dinner', items: ['Poori', 'Aloo Sabzi', 'Rice', 'Jalebi'] },
    ],
  },
];

const mealIcons = {
  Breakfast: <Coffee className="h-5 w-5 text-yellow-600" />,
  Lunch: <Soup className="h-5 w-5 text-orange-600" />,
  Dinner: <Utensils className="h-5 w-5 text-red-600" />,
  Snacks: <Cookie className="h-5 w-5 text-blue-600" />,
};

export function MessMenuDisplay() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as DailyMessMenu['day'];
  const defaultTab = sampleMessMenuData.find(d => d.day === today) ? today : sampleMessMenuData[0]?.day || 'Monday';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Mess Menu</CardTitle>
        <CardDescription>Daily and weekly meal offerings. (Admin editable in future)</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 gap-1 h-auto">
            {sampleMessMenuData.map(dayMenu => (
              <TabsTrigger key={dayMenu.day} value={dayMenu.day} className="text-xs sm:text-sm">{dayMenu.day}</TabsTrigger>
            ))}
          </TabsList>
          {sampleMessMenuData.map(dayMenu => (
            <TabsContent key={dayMenu.day} value={dayMenu.day}>
              <div className="grid gap-6 mt-4 md:grid-cols-2 lg:grid-cols-3">
                {dayMenu.menu.map(meal => (
                  <Card key={meal.id} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center space-x-3 pb-3">
                       {mealIcons[meal.mealType]}
                      <CardTitle className="text-lg font-semibold">{meal.mealType}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {meal.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
