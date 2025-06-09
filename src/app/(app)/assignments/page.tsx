import { AssignmentTracker } from "@/components/features/assignment-tracker";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Assignments - Student Hub',
};

export default function AssignmentsPage() {
  return <AssignmentTracker />;
}
