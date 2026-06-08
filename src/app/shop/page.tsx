'use client';

import { useState, useMemo } from 'react';
import { SHOP_PRODUCTS, SHOP_CATEGORIES, getProductsByCategory, getConverterTools, getProductsBySubCategory, getProductCount, type ShopProduct } from '@/lib/shopProducts';
import { trackEvent } from '@/lib/analytics';
import { getAmazonUrl } from '@/lib/amazonRedirect';

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  
  const productCount = getProductCount();
  const converterTools = getConverterTools();
  const converterToolsTopPicks = converterTools.filter(p => p.badge).slice(0, 8);
  
  // Get products based on category and subcategory
  const products = useMemo(() => {
    if (activeCategory === 'converter-tools' && activeSubCategory) {
      return getProductsBySubCategory(activeSubCategory);
    }
    return getProductsByCategory(activeCategory);
  }, [activeCategory, activeSubCategory]);
  
  // Get converter-tools category
  const converterToolsCategory = SHOP_CATEGORIES.find(c => c.id === 'converter-tools');
  
  // Get subcategories with counts
  const subCategories = useMemo(() => {
    if (!converterToolsCategory?.subCategories) return [];
    return converterToolsCategory.subCategories.map(sub => ({
      ...sub,
      count: SHOP_PRODUCTS.filter(p => p.subCategory === sub.id).length
    }));
  }, []);

  return (
    <div className="container-lg py-8 lg:py-12">
      {/* SECTION 1 — Hero Header */}
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
          🔧 Shop Tools for Every Conversion
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Products hand-picked to match exactly what you are converting on ConvertNow.ca
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          As an Amazon Associate, ConvertNow.ca earns from qualifying purchases
        </p>
        
        {/* Stats Bar */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
            <span className="font-bold text-gray-900 dark:text-white">{productCount}+</span> Products
          </span>
          <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
            <span className="font-bold text-gray-900 dark:text-white">15</span> Categories
          </span>
          <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
            🇨🇦 Ships to Canada, USA, UK & Australia
          </span>
        </div>
      </div>

      {/* SECTION 2 — CONVERTER TOOLS FEATURED (FIRST) */}
      <div className="mb-12 animate-fade-in stagger-1">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            🎯 Matched to Your Conversion
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            These tools are directly related to what ConvertNow users convert every day
          </p>
        </div>
        
        {/* Subcategory Cards Grid (3x3) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
          {subCategories.map(sub => (
            <SubCategoryCard 
              key={sub.id} 
              sub={sub} 
              onClick={() => {
                setActiveCategory('converter-tools');
                setActiveSubCategory(sub.id);
                trackEvent('shop_subcategory_click', 'navigation', sub.id, 1);
              }}
            />
          ))}
        </div>
      </div>

      {/* SECTION 3 — FEATURED CONVERTER TOOLS GRID */}
      <div className="mb-12 animate-fade-in stagger-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span>⭐</span> Top Picks for ConvertNow Users
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {converterToolsTopPicks.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* SECTION 4 — CATEGORY TABS */}
      <div className="mb-8 animate-fade-in stagger-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Browse All Categories
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {SHOP_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setActiveSubCategory(null);
                trackEvent('shop_category_click', 'navigation', cat.id, 1);
              }}
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
        
        {/* Subcategory filter chips for converter-tools */}
        {activeCategory === 'converter-tools' && (
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setActiveSubCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeSubCategory === null
                  ? 'bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
              }`}
            >
              All Tools
            </button>
            {subCategories.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSubCategory(sub.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeSubCategory === sub.id
                    ? 'bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 5 — PRODUCT GRID */}
      <div className="mb-12 animate-fade-in stagger-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {activeCategory === 'all' ? 'All Products' : 
             activeCategory === 'converter-tools' && activeSubCategory
               ? subCategories.find(s => s.id === activeSubCategory)?.label
               : SHOP_CATEGORIES.find(c => c.id === activeCategory)?.label}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {products.length} products
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* SECTION 6 — TRUST BADGES */}
      <div className="mb-12 animate-fade-in stagger-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TrustBadge 
            icon="✅" 
            title="Hand Picked" 
            description="Products selected for quality" 
          />
          <TrustBadge 
            icon="🇨🇦" 
            title="Ships to Canada" 
            description="USA, UK & Australia too" 
          />
          <TrustBadge 
            icon="⭐" 
            title="4.5+ Star Products" 
            description="Only highly rated items" 
          />
          <TrustBadge 
            icon="🔒" 
            title="Amazon Secure" 
            description="Safe checkout on Amazon" 
          />
        </div>
      </div>

      {/* SECTION 7 — AFFILIATE DISCLOSURE */}
      <div className="mt-12 max-w-3xl mx-auto animate-fade-in stagger-6">
        <div className="card p-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
          <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
            <span className="font-semibold">Affiliate Disclosure:</span> As an Amazon Associate, ConvertNow.ca earns from qualifying purchases. Product prices and availability may vary.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── SubCategory Card ──────────────────────────────────────────────────────────

function SubCategoryCard({ 
  sub, 
  onClick 
}: { 
  sub: { id: string; label: string; count: number }; 
  onClick: () => void;
}) {
  const descriptions: Record<string, string> = {
    'length': 'For km ↔ miles users',
    'weight': 'For kg ↔ lbs users',
    'temperature': 'For °C ↔ °F users',
    'volume': 'For cups ↔ mL users',
    'speed': 'For km/h ↔ mph users',
    'area': 'For sq ft ↔ sq m users',
    'digital': 'For GB ↔ MB users',
    'currency': 'For exchange rate users',
    'time': 'For time zone users',
  };

  return (
    <button
      onClick={onClick}
      className="card p-5 text-center hover:shadow-lg transition-all hover:scale-[1.02] group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
    >
      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
        {sub.label.split(' ')[0]}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
        {sub.label.replace(/^\S+\s/, '')}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        {sub.count} products
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
        {descriptions[sub.id] || 'Conversion tools'}
      </p>
      <span className="inline-flex items-center text-xs font-medium text-brand-600 dark:text-brand-400 group-hover:underline">
        Shop Now →
      </span>
    </button>
  );
}

// ─── Trust Badge ───────────────────────────────────────────────────────────────

function TrustBadge({ 
  icon, 
  title, 
  description 
}: { 
  icon: string; 
  title: string; 
  description: string;
}) {
  return (
    <div className="card p-4 text-center bg-gray-50 dark:bg-gray-800/50">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: ShopProduct }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleAmazonClick(e: React.MouseEvent) {
    e.preventDefault();
    setIsLoading(true);
    trackEvent('shop_product_click', 'affiliate', product.id, 1);
    
    const keyword = product.productKeyword || product.title;
    const url = await getAmazonUrl(keyword);
    window.open(url, '_blank', 'noopener,noreferrer');
    
    setIsLoading(false);
  }

  return (
    <div className="card p-5 flex flex-col h-full hover:shadow-lg transition-all hover:scale-[1.01] group relative">
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
      <ul className="space-y-0.5 mb-3">
        {product.features.slice(0, 3).map((feat, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
            <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
            {feat}
          </li>
        ))}
      </ul>

      {/* Global Demand */}
      <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-3">
        {product.globalDemand}
      </p>

      {/* CTA */}
      <button
        onClick={handleAmazonClick}
        disabled={isLoading}
        className="mt-auto block w-full text-center bg-amber-400 hover:bg-amber-500 dark:bg-amber-600 dark:hover:bg-amber-500 text-gray-900 dark:text-white font-bold text-sm py-2.5 rounded-xl transition-all hover:scale-105 duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? '🔄 Finding best offer...' : '🔥 Check Discounted Offers →'}
      </button>
    </div>
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
