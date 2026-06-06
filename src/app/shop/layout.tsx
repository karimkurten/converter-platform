import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Recommended Products — ConvertNow.ca',
  description: 'Shop hand-picked measurement tools, kitchen scales, thermometers, fitness trackers and travel accessories. All available on Amazon.ca with fast Canadian shipping.',
  keywords: [
    'kitchen scale canada', 'measuring cups canada', 'meat thermometer canada',
    'fitness tracker canada', 'tape measure metric imperial', 'amazon canada measurement tools'
  ],
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
