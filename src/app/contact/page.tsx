import type { Metadata } from 'next';
import ContactClientPage from './ContactClientPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us',
  description: 'Found a bug? Missing a unit? Have feedback? Contact the ConvertNow team — we read every message.',
  path: '/contact',
});

export default function ContactPage() {
  return <ContactClientPage />;
}
