'use client'

import { useAmazonStore } from '@/hooks/useAmazonStore'

interface AmazonButtonProps {
  baseUrl: string
  productId: string
  label?: string
  variant?: 'primary' | 'card' | 'subcategory'
  className?: string
}

export default function AmazonButton({ 
  baseUrl,
  productId,
  label = '🔥 Grab These Deals Now',
  variant = 'card',
  className = '',
}: AmazonButtonProps) {
  const { store, getLocalUrl, isLoading } = useAmazonStore()
  
  const localUrl = getLocalUrl(baseUrl)
  
  const handleClick = () => {
    // Track click with GA4
    if (typeof window !== 'undefined' && (window as typeof window & { gtag?: Function }).gtag) {
      (window as typeof window & { gtag?: Function }).gtag!('event', 'amazon_affiliate_click', {
        event_category: 'affiliate',
        event_label: productId,
        store_country: store.countryName,
        store_domain: store.domain,
      })
    }
  }

  const buttonStyles = {
    primary: `w-full py-3 px-4 rounded-xl
              bg-gradient-to-r from-amber-400 to-amber-500 
              hover:from-amber-500 hover:to-amber-600
              text-gray-900 text-sm font-extrabold
              transition-all duration-200
              text-center block active:scale-95
              hover:shadow-lg hover:shadow-amber-400/50`,
    card: `w-full py-3 px-4 rounded-xl
           bg-gradient-to-r from-amber-400 to-amber-500 
           hover:from-amber-500 hover:to-amber-600
           text-gray-900 text-sm font-extrabold
           transition-all duration-200
           text-center block active:scale-95
           hover:shadow-lg hover:shadow-amber-400/50
           hover:scale-[1.02]
           relative overflow-hidden
           group`,
    subcategory: `w-full py-2 px-4 rounded-xl
                  bg-gradient-to-r from-brand-500 to-brand-600 
                  hover:from-brand-600 hover:to-brand-700
                  text-white text-sm font-bold
                  transition-all duration-200
                  active:scale-95 inline-block
                  text-center
                  hover:shadow-lg hover:shadow-brand-500/50`,
  }

  return (
    <a
      href={localUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      className={`${buttonStyles[variant]} ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Loading...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-1.5">
          <span className="text-base">{store.flag}</span>
          <span className="tracking-wide">{label}</span>
          <span className="text-xs opacity-75">on {store.domain}</span>
        </span>
      )}
    </a>
  )
}
