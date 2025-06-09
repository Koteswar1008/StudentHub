import { TimetableView } from "@/components/features/timetable-view";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Timetable - Student Hub',
};

export default function TimetablePage() {
  return <TimetableView />;
}
