'use client';

import { useState } from 'react';
import { SHOP_PRODUCTS, SHOP_CATEGORIES, getProductsByCategory, type ShopProduct } from '@/lib/shopProducts';
import { trackEvent } from '@/lib/analytics';

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const products = getProductsByCategory(activeCategory);

  return (
    <div className="container-lg py-8 lg:py-12">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
          Shop Recommended Products
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Hand-picked tools for measurement, cooking, fitness and travel. All available on Amazon.ca
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          As an Amazon Associate, ConvertNow.ca earns from qualifying purchases
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide animate-fade-in stagger-1">
        {SHOP_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in stagger-2">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Affiliate Disclosure */}
      <div className="mt-12 max-w-3xl mx-auto">
        <div className="card p-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
          <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
            <span className="font-semibold">Affiliate Disclosure:</span> ConvertNow.ca is a participant in the Amazon Associates Program. When you purchase through our links, we earn a small commission at no extra cost to you. This helps keep ConvertNow.ca free for everyone.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: ShopProduct }) {
  const handleClick = () => {
    trackEvent('shop_product_click', 'affiliate', product.id, 1);
  };

  return (
    <a
      href={product.amazonUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={handleClick}
      className="card p-5 flex flex-col h-full hover:shadow-lg transition-all hover:scale-[1.01] group"
    >
      {/* Emoji */}
      <div className="text-5xl text-center mb-4 group-hover:scale-110 transition-transform">
        {product.emoji}
      </div>

      {/* Badge */}
      {product.badge && (
        <span className="inline-flex items-center self-start px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wide mb-2">
          {product.badge}
        </span>
      )}

      {/* Title */}
      <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1.5 line-clamp-2">
        {product.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
        {product.description}
      </p>

      {/* Rating */}
      <div className="flex items-center gap-1.5 mb-2">
        <StarRating rating={product.rating} />
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{product.rating}</span>
        <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
      </div>

      {/* Price */}
      <p className="text-sm font-bold text-green-600 dark:text-green-400 mb-3">
        {product.priceRange}
      </p>

      {/* Features */}
      <ul className="space-y-0.5 mb-4">
        {product.features.slice(0, 3).map((feat, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
            <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
            {feat}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <span className="mt-auto block w-full text-center bg-amber-400 hover:bg-amber-500 dark:bg-amber-600 dark:hover:bg-amber-500 text-gray-900 dark:text-white font-bold text-sm py-2.5 rounded-xl transition-colors">
        View on Amazon →
      </span>
    </a>
  );
}

// ─── Star Rating ───────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3 && rating - fullStars <= 0.8;
  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<span key={i} className="text-amber-400">★</span>);
    } else if (i === fullStars && hasHalf) {
      stars.push(<span key={i} className="text-amber-400">★</span>);
    } else {
      stars.push(<span key={i} className="text-gray-300 dark:text-gray-600">★</span>);
    }
  }

  return <div className="flex text-xs">{stars}</div>;
}
