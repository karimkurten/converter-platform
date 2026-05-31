import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ConvertNow — Unit Converter',
    short_name: 'ConvertNow',
    description: 'Free online unit converter at ConvertNow.ca. 500+ conversions, works offline.',
    start_url: 'https://convertnow.ca',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0c8ee7',
    orientation: 'portrait-primary',
    categories: ['utilities', 'productivity'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
    shortcuts: [
      { name: 'Length Converter', url: '/length', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      { name: 'Currency Converter', url: '/currency', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
    ],
  };
}
