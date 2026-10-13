'use client';

import { SHOP_PRODUCTS, type ShopProduct } from '@/lib/shopProducts';
import { useAmazonStore } from '@/hooks/useAmazonStore';
import AmazonButton from './AmazonButton';
import Link from 'next/link';

interface ContextualProductWidgetProps {
  categorySlug: string;
}

// Map category slugs to subCategory IDs
const categoryToSubCategory: Record<string, string> = {
  'length': 'length',
  'weight': 'weight',
  'temperature': 'temperature',
  'volume': 'volume',
  'cooking': 'volume',
  'speed': 'speed',
  'area': 'area',
  'digital': 'digital',
  'currency': 'currency',
  'time': 'time',
};

// Map category slugs to display names
const categoryDisplayNames: Record<string, string> = {
  'length': 'Length',
  'weight': 'Weight',
  'temperature': 'Temperature',
  'volume': 'Volume',
  'cooking': 'Cooking',
  'speed': 'Speed',
  'area': 'Area',
  'digital': 'Digital Storage',
  'currency': 'Currency & Travel',
  'time': 'Time',
};

// Fallback for categories with no dedicated products (e.g. pressure, energy,
// fuel): show generic measuring tools rather than rendering nothing, so every
// converter page offers a relevant product path. IDs must exist in SHOP_PRODUCTS.
const FALLBACK_PRODUCT_IDS = ['ct-length-001', 'ct-length-002', 'ct-length-003'];

export default function ContextualProductWidget({ categorySlug }: ContextualProductWidgetProps) {
  const subCategoryId = categoryToSubCategory[categorySlug];

  // Get up to 3 products for this subcategory
  let products: ShopProduct[] = subCategoryId
    ? SHOP_PRODUCTS
        .filter(p => p.category === 'converter-tools' && p.subCategory === subCategoryId)
        .slice(0, 3)
    : [];

  let heading = 'Tools for this conversion';
  let displayName = categoryDisplayNames[categorySlug] || categorySlug;
  const browseHref = subCategoryId
    ? `/shop?category=converter-tools&sub=${subCategoryId}`
    : '/shop?category=converter-tools';

  if (products.length === 0) {
    products = FALLBACK_PRODUCT_IDS
      .map(id => SHOP_PRODUCTS.find(p => p.id === id))
      .filter((p): p is ShopProduct => Boolean(p))
      .slice(0, 3);
    heading = 'Recommended measuring tools';
    displayName = 'measuring tools';
  }

  if (products.length === 0) return null;
  
  return (
    <div className="my-8 animate-fade-in">
      <div className="card p-5 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-gray-900 border-amber-200 dark:border-amber-900">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🔧</span>
          <h3 className="font-bold text-gray-900 dark:text-white">
            {heading}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {products.map(product => (
            <WidgetProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-amber-200 dark:border-amber-900/50">
          <Link
            href={browseHref}
            className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
          >
            View all {displayName.toLowerCase()} tools →
          </Link>
          
          <p className="text-xs text-gray-600 dark:text-gray-400">
            As an Amazon Associate I earn from qualifying purchases.
          </p>
        </div>
      </div>
    </div>
  );
}

function WidgetProductCard({ product }: { product: ShopProduct }) {
  const { store } = useAmazonStore();

  return (
    <div className="flex flex-col p-3 bg-white dark:bg-gray-800 rounded-lg">
      <div className="text-3xl mb-2">{product.emoji}</div>
      
      <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 line-clamp-1">
        {product.title}
      </h4>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        Typically {product.priceRange} · {store.domain}
      </p>
      
      <AmazonButton
        baseUrl={product.amazonUrl}
        productId={product.id}
        variant="card"
        className="text-xs py-1.5"
      />
    </div>
  );
}
