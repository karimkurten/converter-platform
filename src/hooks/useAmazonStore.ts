'use client'

import { useState, useEffect } from 'react'
import { 
  detectUserCountry, 
  getStoreForCountry,
  localizeAmazonUrl,
  buildAmazonUrl,
  DEFAULT_STORE,
  type AmazonStore,
  SUBCATEGORY_SEARCH_TERMS,
} from '@/lib/amazonGeo'

export function useAmazonStore() {
  const [countryCode, setCountryCode] = useState<string>('CA')
  const [store, setStore] = useState<AmazonStore>(DEFAULT_STORE)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isDetected, setIsDetected] = useState<boolean>(false)

  useEffect(() => {
    // Check localStorage cache first
    const cached = localStorage.getItem('convertnow_country')
    const cacheTime = localStorage.getItem('convertnow_country_time')
    const cacheAge = cacheTime 
      ? Date.now() - parseInt(cacheTime) 
      : Infinity
    
    // Use cache if less than 24 hours old
    if (cached && cacheAge < 86400000) {
      const detectedStore = getStoreForCountry(cached)
      setCountryCode(cached)
      setStore(detectedStore)
      setIsLoading(false)
      setIsDetected(true)
      return
    }
    
    // Detect country via IP
    detectUserCountry().then(code => {
      const detectedStore = getStoreForCountry(code)
      setCountryCode(code)
      setStore(detectedStore)
      setIsLoading(false)
      setIsDetected(true)
      
      // Cache for 24 hours
      localStorage.setItem('convertnow_country', code)
      localStorage.setItem('convertnow_country_time', Date.now().toString())
    }).catch(() => {
      setIsLoading(false)
    })
  }, [])

  // Get localized URL for a product
  const getLocalUrl = (baseUrl: string): string => {
    return localizeAmazonUrl(baseUrl, countryCode)
  }

  // Get URL for a subcategory card
  const getSubCategoryUrl = (subCategoryId: string): string => {
    const searchTerm = SUBCATEGORY_SEARCH_TERMS[subCategoryId] || subCategoryId
    return buildAmazonUrl(searchTerm, countryCode)
  }

  // Allow manual country override
  const setCountry = (code: string) => {
    const newStore = getStoreForCountry(code)
    setCountryCode(code)
    setStore(newStore)
    localStorage.setItem('convertnow_country', code)
    localStorage.setItem('convertnow_country_time', Date.now().toString())
  }

  return { 
    countryCode, 
    store, 
    isLoading,
    isDetected,
    getLocalUrl,
    getSubCategoryUrl,
    setCountry,
  }
}
