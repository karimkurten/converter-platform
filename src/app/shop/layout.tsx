import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop 200+ Recommended Products | ConvertNow.ca',
  description: '200+ hand-picked best-selling products from Amazon Canada. Luxury beauty, kitchen, fitness, tech, books and more. All with fast Canadian shipping.',
  keywords: [
    'amazon canada products', 'luxury beauty canada', 'kitchen appliances canada', 
    'fitness products canada', 'tech gadgets canada', 'best amazon products',
    'amazon affiliate canada', 'top rated products canada'
  ],
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
