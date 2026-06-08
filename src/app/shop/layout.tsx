import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Measurement & Converter Tools | ConvertNow.ca',
  description: 'Shop 200+ hand-picked products matched to your conversions. Measurement tools, kitchen scales, thermometers, laser measures and more — all on Amazon Canada with fast shipping.',
  keywords: [
    'measurement tools canada',
    'kitchen scale metric imperial',
    'meat thermometer celsius fahrenheit',
    'tape measure metric imperial canada',
    'laser distance measure meters feet',
    'digital caliper metric imperial',
    'amazon canada measurement tools',
    'converter tools shop',
    'unit conversion tools'
  ],
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
