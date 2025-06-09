import { MessMenuDisplay } from "@/components/features/mess-menu-display";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mess Menu - Student Hub',
};

export default function MessMenuPage() {
  return <MessMenuDisplay />;
}
