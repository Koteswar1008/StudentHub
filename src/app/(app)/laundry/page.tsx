import { LaundryBooking } from "@/components/features/laundry-booking";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laundry Booking - Student Hub',
};

export default function LaundryPage() {
  return <LaundryBooking />;
}
