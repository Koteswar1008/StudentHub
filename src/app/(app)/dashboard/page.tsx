import { DashboardOverview } from "@/components/features/dashboard-overview";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Student Hub',
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
