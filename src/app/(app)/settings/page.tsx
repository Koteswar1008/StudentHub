import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings - Student Hub',
};

export default function SettingsPage() {
  // Basic form for user name, could be expanded
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline text-2xl">Settings</CardTitle>
        </div>
        <CardDescription>Manage your application preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="userName">Your Name (for bookings etc.)</Label>
          <Input id="userName" defaultValue="Current User" placeholder="Enter your name" />
          <p className="text-xs text-muted-foreground">This name is stored locally in your browser.</p>
        </div>
        
        <div className="space-y-2">
            <h3 className="font-semibold">Theme Preferences</h3>
            <p className="text-sm text-muted-foreground">Theme toggle functionality can be added here (e.g., Light/Dark/System).</p>
            <Button variant="outline" disabled>Toggle Theme (Coming Soon)</Button>
        </div>

        <div className="space-y-2">
            <h3 className="font-semibold">Notification Settings</h3>
            <p className="text-sm text-muted-foreground">Manage deadline reminders and other notifications (feature coming soon).</p>
        </div>
        
        <div className="space-y-2">
            <h3 className="font-semibold">Data Management</h3>
            <Button variant="destructive" onClick={() => alert("This would clear locally stored data. Implement with caution!")}>
                Clear Local Data
            </Button>
            <p className="text-xs text-muted-foreground">This will remove all your assignments, expenses, and bookings stored in this browser.</p>
        </div>

        <Button type="submit" className="w-full sm:w-auto">Save Settings</Button>
      </CardContent>
    </Card>
  );
}
