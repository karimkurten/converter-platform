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

export default function ContextualProductWidget({ categorySlug }: ContextualProductWidgetProps) {
  const { store } = useAmazonStore();
  const subCategoryId = categoryToSubCategory[categorySlug];
  
  if (!subCategoryId) return null;
  
  // Get up to 3 products for this subcategory
  const products = SHOP_PRODUCTS
    .filter(p => p.category === 'converter-tools' && p.subCategory === subCategoryId)
    .slice(0, 3);
  
  if (products.length === 0) return null;
  
  const displayName = categoryDisplayNames[categorySlug] || categorySlug;
  
  return (
    <div className="my-8 animate-fade-in">
      <div className="card p-5 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-gray-900 border-amber-200 dark:border-amber-900">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🔧</span>
          <h3 className="font-bold text-gray-900 dark:text-white">
            Tools for this conversion
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {products.map(product => (
            <WidgetProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-amber-200 dark:border-amber-900/50">
          <Link
            href={`/shop?category=converter-tools&sub=${subCategoryId}`}
            className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
          >
            View all {displayName.toLowerCase()} tools →
          </Link>
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            As an Amazon Associate we earn from sales on {store.domain}
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
        {product.priceRange} on {store.domain}
      </p>
      
      <AmazonButton
        baseUrl={product.amazonUrl}
        productId={product.id}
        label={`View on ${store.domain}`}
        variant="card"
        className="text-xs py-1.5"
      />
    </div>
  );
}
