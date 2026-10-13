import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Script from 'next/script';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/CookieConsent';
import { buildMetadata } from '@/lib/seo';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = buildMetadata({
  title: 'ConvertNow — Free Online Unit Converter',
  description: 'Fast, free unit converter at ConvertNow.ca. 500+ conversions including length, weight, temperature, currency, and more.',
  path: '/',
  keywords: ['unit converter', 'online converter', 'measurement converter', 'free converter', 'length converter', 'weight converter', 'temperature converter', 'currency converter'],
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
// Kept intentionally: used by the AdSense script block below (currently disabled pending firewall review)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-7999532935872277';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* PWA manifest is auto-injected by Next.js from app/manifest.ts */}
        <meta name="theme-color" content="#0c8ee7" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#072849" media="(prefers-color-scheme: dark)" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />

        {/* Organization + WebSite Schema (plain script so it's present in the initial server-rendered HTML, not deferred like next/script) */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'ConvertNow',
            url: 'https://www.convertnow.ca',
            logo: 'https://www.convertnow.ca/icons/icon-512.png',
            description: 'Free, fast, and accurate online unit converter with 500+ conversions across 13 categories.',
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'support@convertnow.ca',
              contactType: 'Customer Support',
              availableLanguage: ['English'],
            },
          }),
        }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'ConvertNow',
            url: 'https://www.convertnow.ca',
          }),
        }} />

        {/* AdSense - disabled during corporate firewall review
        {ADSENSE_ID && (
          <Script
            id="adsense"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )} */}

        {/* Google Analytics handled below via @next/third-parties */}

        {/* Microsoft Clarity - disabled during corporate firewall review
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <Script id="clarity" strategy="lazyOnload">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_ID}");
            `}
          </Script>
        )} */}
      </head>
      <body className="font-sans antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>

        {/* Service Worker registration */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
              });
            }
          `}
        </Script>
      </body>
      {GA_ID && <CookieConsent gaId={GA_ID} />}
    </html>
  );
}
