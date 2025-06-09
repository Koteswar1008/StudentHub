"use client";

import React from "react"; // Added React import for useMemo
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, Utensils, BookOpen, Wallet, ShoppingBasket, Settings, Sun, Moon, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/timetable", label: "Timetable", icon: CalendarDays },
  { href: "/mess-menu", label: "Mess Menu", icon: Utensils },
  { href: "/assignments", label: "Assignments", icon: BookOpen },
  { href: "/expenses", label: "Expenses", icon: Wallet },
  { href: "/laundry", label: "Laundry", icon: ShoppingBasket },
];

export function AppSidebar() {
  const pathname = usePathname();
  // const { theme, setTheme } = useTheme(); // Add useTheme if implementing theme toggle

  const settingsTooltipProps = React.useMemo(
    () => ({
      children: "Settings",
      side: "right" as const,
      className: "font-body",
    }),
    [] // Empty dependency array means it's created once
  );

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
           <svg width="32" height="32" viewBox="0 0 100 100" className="text-primary" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90C72.0914 90 90 72.0914 90 50C90 38.6936 85.0936 28.6027 77.6777 21.3609L50 50V10Z"/>
            <path d="M50 10V50L77.6777 21.3609C72.0668 15.0134 61.712 10 50 10Z" fill="hsl(var(--accent))"/>
           </svg>
          <span className="font-headline text-xl font-semibold group-data-[collapsible=icon]:hidden">Student Hub</span>
        </Link>
        <div className="group-data-[collapsible=icon]:hidden">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarMenu>
          {navItems.map((item) => {
            const tooltipProps = React.useMemo(
              () => ({
                children: item.label,
                side: "right" as const,
                className: "font-body",
              }),
              [item.label]
            );

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                  tooltip={tooltipProps}
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        {/* Theme toggle example - uncomment and implement useTheme if needed
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="w-full group-data-[collapsible=icon]:w-auto"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
          <span className="group-data-[collapsible=icon]:hidden ml-2">Toggle Theme</span>
        </Button>
        */}
         <SidebarMenuButton
            asChild
            isActive={pathname === "/settings"}
            tooltip={settingsTooltipProps}
          >
            <Link href="/settings">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
