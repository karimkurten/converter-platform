'use client'

import { useState } from 'react'
import { useAmazonStore } from '@/hooks/useAmazonStore'
import { AMAZON_STORES } from '@/lib/amazonGeo'

export default function CountryBanner() {
  const { store, countryCode, setCountry, isDetected } = useAmazonStore()
  const [showPicker, setShowPicker] = useState(false)

  if (!isDetected) return null

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 
                     border border-amber-200 
                     dark:border-amber-900 
                     rounded-xl px-4 py-3 mb-6
                     flex items-center justify-between
                     flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">{store.flag}</span>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Showing products for {store.countryName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Links go to {store.domain} · Prices in {store.currency}
          </p>
        </div>
      </div>
      
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="text-xs text-brand-500 hover:text-brand-600 font-semibold flex items-center gap-1"
        >
          Change country ▾
        </button>
        
        {showPicker && (
          <div className="absolute right-0 top-full mt-1 
                           bg-white dark:bg-gray-900 
                           rounded-xl shadow-xl border 
                           border-gray-100 dark:border-gray-800 
                           z-50 w-56 overflow-hidden">
            <div className="p-2 max-h-64 overflow-y-auto">
              {Object.entries(AMAZON_STORES).map(([code, s]) => (
                <button
                  key={code}
                  onClick={() => {
                    setCountry(code)
                    setShowPicker(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg 
                              text-sm transition-colors
                              ${countryCode === code
                                ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 font-semibold'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                              }`}
                >
                  <span className="text-base">{s.flag}</span>
                  <div className="text-left">
                    <div className="font-medium">{s.countryName}</div>
                    <div className="text-xs text-gray-400">{s.domain}</div>
                  </div>
                  {countryCode === code && (
                    <span className="ml-auto text-brand-500">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
