'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SHOP_PRODUCTS, SHOP_CATEGORIES, getProductsByCategory, getConverterTools, getProductsBySubCategory, getProductCount, type ShopProduct } from '@/lib/shopProducts';
import { trackEvent } from '@/lib/analytics';
import { useAmazonStore } from '@/hooks/useAmazonStore';
import AmazonButton from '@/components/affiliate/AmazonButton';
import CountryBanner from '@/components/affiliate/CountryBanner';
import AdUnit from '@/components/ads/AdUnit';

export default function ShopClientPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const productGridRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const { store, getSubCategoryUrl } = useAmazonStore();

  useEffect(() => {
    const category = searchParams.get('category');
    const sub = searchParams.get('sub');
    if (category) setActiveCategory(category);
    if (sub) setActiveSubCategory(sub);
  }, [searchParams]);

  const productCount = getProductCount();
  const converterTools = getConverterTools();
  const converterToolsTopPicks = converterTools.filter(p => p.badge).slice(0, 8);

  const products = useMemo(() => {
    if (activeCategory === 'converter-tools' && activeSubCategory) {
      return getProductsBySubCategory(activeSubCategory);
    }
    return getProductsByCategory(activeCategory);
  }, [activeCategory, activeSubCategory]);

  const converterToolsCategory = SHOP_CATEGORIES.find(c => c.id === 'converter-tools');

  const subCategories = useMemo(() => {
    if (!converterToolsCategory?.subCategories) return [];
    return converterToolsCategory.subCategories.map(sub => ({
      ...sub,
      count: SHOP_PRODUCTS.filter(p => p.subCategory === sub.id).length
    }));
  }, []);

  const handleSubCategoryClick = (subId: string) => {
    setActiveCategory('converter-tools');
    setActiveSubCategory(subId);
    trackEvent('shop_subcategory_click', 'navigation', subId, 1);
    setTimeout(() => {
      productGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="container-lg py-8 lg:py-12">
      {/* Hero */}
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
          🔧 Shop Tools for Every Conversion
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Products hand-picked to match exactly what you are converting on ConvertNow.ca
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          Affiliate Disclosure: As an Amazon Associate, ConvertNow.ca earns from qualifying purchases...
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
            <span className="font-bold text-gray-900 dark:text-white">{productCount}+</span> Products
          </span>
          <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
            <span className="font-bold text-gray-900 dark:text-white">15</span> Categories
          </span>
          <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
            {store.flag} Ships to {store.countryName}
          </span>
        </div>
      </div>

      {/* Subcategory Cards */}
      <div className="mb-12 animate-fade-in stagger-1">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            🎯 Matched to Your Conversion
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
          {subCategories.map(sub => (
            <SubCategoryCard
              key={sub.id}
              sub={sub}
              isActive={activeCategory === 'converter-tools' && activeSubCategory === sub.id}
              onClick={() => handleSubCategoryClick(sub.id)}
              amazonUrl={getSubCategoryUrl(sub.id)}
            />
          ))}
        </div>
      </div>

      {/* Top Picks */}
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

      <CountryBanner />

      {/* Category Tabs */}
      <div className="mb-8 animate-fade-in stagger-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Browse All Categories
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {SHOP_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setActiveSubCategory(null); }}
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
      </div>

      {/* Ad Unit */}
      <AdUnit slot="in-content" />

      {/* Product Grid */}
      <div ref={productGridRef} id="product-grid" className="mb-12 animate-fade-in stagger-4 scroll-mt-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {activeCategory === 'all' ? 'All Products' :
             activeCategory === 'converter-tools' && activeSubCategory
               ? subCategories.find(s => s.id === activeSubCategory)?.label
               : SHOP_CATEGORIES.find(c => c.id === activeCategory)?.label}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">{products.length} products</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mb-12 animate-fade-in stagger-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TrustBadge icon="✅" title="Hand Picked" description="Products selected for quality" />
          <TrustBadge icon={store.flag} title={`Ships to ${store.countryName}`} description="Fast local delivery" />
          <TrustBadge icon="⭐" title="4.5+ Star Products" description="Only highly rated items" />
          <TrustBadge icon="🔒" title="Amazon Secure" description={`Checkout on ${store.domain}`} />
        </div>
      </div>

      {/* Disclosure */}
      <div className="mt-12 max-w-3xl mx-auto animate-fade-in stagger-6">
        <div className="card p-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
          <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
            <span className="font-semibold">Affiliate Disclosure:</span> As an Amazon Associate, ConvertNow.ca earns from qualifying purchases on {store.domain}. Product prices and availability may vary.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SubCategoryCard({ sub, isActive, onClick, amazonUrl }: {
  sub: { id: string; label: string; count: number };
  isActive: boolean;
  onClick: () => void;
  amazonUrl: string;
}) {
  const descriptions: Record<string, string> = {
    length: 'For km ↔ miles users',
    weight: 'For kg ↔ lbs users',
    temperature: 'For °C ↔ °F users',
    volume: 'For cups ↔ mL users',
    speed: 'For km/h ↔ mph users',
    area: 'For sq ft ↔ sq m users',
    digital: 'For GB ↔ MB users',
    currency: 'For exchange rate users',
    time: 'For time zone users',
  };

  const hasProducts = sub.count > 0;

  return (
    <div className={`card p-5 text-center hover:shadow-lg transition-all hover:scale-[1.02] group ${
      isActive ? 'ring-2 ring-brand-500 bg-brand-50 dark:bg-brand-950/30' : 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900'
    }`}>
      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{sub.label.split(' ')[0]}</div>
      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{sub.label.replace(/^\S+\s/, '')}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{sub.count} products</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{descriptions[sub.id] || 'Conversion tools'}</p>
      {hasProducts ? (
        <button onClick={onClick} className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
          isActive ? 'bg-brand-500 text-white' : 'bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 hover:bg-brand-200'
        }`}>
          {isActive ? 'Showing →' : 'Shop Now →'}
        </button>
      ) : (
        <a href={amazonUrl} target="_blank" rel="noopener noreferrer sponsored" className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-400 hover:bg-amber-500 text-gray-900 transition-colors">Shop Amazon →</a>
      )}
    </div>
  );
}

function TrustBadge({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="card p-4 text-center bg-gray-50 dark:bg-gray-800/50">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}

function ProductCard({ product }: { product: ShopProduct }) {
  return (
    <div className="card p-5 flex flex-col h-full hover:shadow-lg transition-all hover:scale-[1.01] group relative">
      <div className="text-5xl text-center mb-4 group-hover:scale-110 transition-transform">{product.emoji}</div>
      {product.badge && (
        <span className="inline-flex items-center self-start px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wide mb-2">{product.badge}</span>
      )}
      <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1.5 line-clamp-2">{product.title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">{product.description}</p>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-amber-400 text-xs">{'★'.repeat(Math.floor(product.rating))}</span>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{product.rating}</span>
        <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
      </div>
      <p className="text-sm font-bold text-green-600 dark:text-green-400 mb-3">{product.priceRange}</p>
      <ul className="space-y-0.5 mb-3">
        {product.features.slice(0, 3).map((feat, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-500 dark:text-gray-400"><span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>{feat}</li>
        ))}
      </ul>
      <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-3">{product.globalDemand}</p>
      <AmazonButton baseUrl={product.amazonUrl} productId={product.id} variant="card" />
    </div>
  );
}
