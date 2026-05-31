import Link from 'next/link';
import { CATEGORIES } from '@/lib/converters';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="container-lg py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-black text-sm">
                C
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">ConvertNow</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              Free online unit converter. Fast, accurate, and works offline.
            </p>
          </div>

          {/* Popular Converters */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Popular</h3>
            <ul className="space-y-2">
              {[
                { label: 'km to miles', href: '/length/kilometer-to-mile' },
                { label: 'kg to lbs', href: '/weight/kilogram-to-pound' },
                { label: '°C to °F', href: '/temperature/celsius-to-fahrenheit' },
                { label: 'USD to EUR', href: '/currency/USD-to-EUR' },
                { label: 'feet to meters', href: '/length/foot-to-meter' },
                { label: 'gallons to liters', href: '/volume/us-gallon-to-liter' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Categories</h3>
            <ul className="space-y-2">
              {CATEGORIES.map(cat => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Company</h3>
            <ul className="space-y-2">
              {[
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Sitemap', href: '/sitemap.xml' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {year} ConvertNow.ca. All rights reserved.
          </p>
          <p className="text-sm text-gray-400">
            Fast · Accurate · Free · No Signup Required
          </p>
        </div>
      </div>
    </footer>
  );
}
