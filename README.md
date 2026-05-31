# ConvertNow — Production-Ready Unit Converter Platform

ConvertNow.ca — a fast, SEO-optimized, monetization-ready unit converter built with Next.js 15, TypeScript, and Tailwind CSS.

---

## 🚀 Quick Start

```bash
# 1. Clone / download the project
cd convertnow

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values (see Environment Variables section)
# Set NEXT_PUBLIC_SITE_URL=https://convertnow.ca for production

# 4. Run development server
npm run dev
# → http://localhost:3000

# 5. Build for production
npm run build

# 6. Start production server
npm start
```

---

## 📁 Project Structure

```
src/
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root layout (fonts, theme, analytics, AdSense)
│   ├── page.tsx                 # Homepage (hero, popular, categories, FAQs)
│   ├── globals.css              # Global CSS + design system
│   ├── sitemap.ts               # Auto-generated XML sitemap (500+ URLs)
│   ├── robots.ts                # robots.txt
│   ├── manifest.ts              # PWA manifest
│   ├── not-found.tsx            # 404 page
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── [category]/
│   │   ├── page.tsx             # Category page (e.g. /length)
│   │   └── [converter]/
│   │       └── page.tsx         # Converter page (e.g. /length/km-to-miles)
│   └── api/
│       ├── currency/route.ts    # Live exchange rates (Edge Runtime)
│       └── search/route.ts      # Converter search (Edge Runtime)
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # Sticky header with live search + theme toggle
│   │   ├── Footer.tsx           # Footer with internal links
│   │   └── Breadcrumb.tsx       # SEO breadcrumb + schema
│   ├── converter/
│   │   ├── ConverterEngine.tsx  # Core converter UI (inputs, swap, copy, favorites)
│   │   └── ConverterWidgets.tsx # Related converters, table, formula block
│   ├── home/
│   │   └── HeroSearch.tsx       # Animated hero search with autocomplete
│   └── ads/
│       └── AdUnit.tsx           # Lazy-loaded AdSense + dev placeholders
│
├── lib/
│   ├── converters/
│   │   ├── index.ts             # Category registry + search + path generation
│   │   ├── length.ts            # Length converter (14 units)
│   │   ├── weight.ts            # Weight converter (13 units)
│   │   ├── temperature.ts       # Temperature (5 scales, special formulas)
│   │   ├── units.ts             # Area, Volume, Speed, Time, Digital (5 converters)
│   │   └── currency.ts          # Currency (40 currencies, live rates)
│   ├── seo.ts                   # Metadata, schema, FAQ generation
│   └── utils.ts                 # Formatting, clipboard, localStorage, colors
│
├── types/
│   └── index.ts                 # All TypeScript types
│
public/
├── sw.js                        # Service Worker (PWA offline support)
└── icons/                       # PWA icons (add icon-192.png + icon-512.png)
```

---

## 🔧 Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✅ | Your production domain |
| `NEXT_PUBLIC_GA_ID` | Recommended | Google Analytics 4 Measurement ID |
| `NEXT_PUBLIC_ADSENSE_ID` | For revenue | AdSense Publisher ID (`ca-pub-xxx`) |
| `NEXT_PUBLIC_AD_SLOT_*` | For revenue | Individual ad unit slot IDs |
| `NEXT_PUBLIC_GSC_VERIFICATION` | SEO | Google Search Console verification |
| `NEXT_PUBLIC_CLARITY_ID` | Analytics | Microsoft Clarity project ID |

---

## 💰 AdSense Setup

1. Apply for AdSense at [adsense.google.com](https://adsense.google.com)
2. Once approved, get your Publisher ID (`ca-pub-XXXXXXXX`)
3. Create ad units in AdSense dashboard:
   - **Header Banner** (728×90 or Responsive)
   - **Sidebar Rectangle** (300×250)
   - **In-Content Rectangle** (336×280)
   - **Mobile Sticky** (320×50)
   - **Footer Banner** (728×90)
4. Add slot IDs to `.env.local`
5. Ad placeholders automatically switch to real ads in production

### Ad Placement Strategy
- **Header** — above the fold on all pages
- **In-Content** — between converter and formula (high viewability)
- **Sidebar x2** — sticky on desktop (high RPM)
- **Mobile Sticky** — bottom of screen (dismissible, compliant)
- **Footer** — sitewide

---

## 🔍 SEO Features

### Programmatic SEO
Every converter page (`/length/kilometer-to-mile`, etc.) has:
- Unique `<title>` and `<meta description>`
- Canonical URL
- OpenGraph + Twitter Card tags
- Keyword-optimized content
- FAQ schema (JSON-LD)
- Breadcrumb schema (JSON-LD)
- Conversion table (tabular data)
- Formula explanation

### URL Structure
```
/                              → Homepage
/[category]                    → /length, /weight, /temperature...
/[category]/[from]-to-[to]     → /length/kilometer-to-mile
```

### Sitemap
Auto-generated at `/sitemap.xml` with 500+ URLs, proper priorities:
- Homepage: 1.0
- Category pages: 0.9
- Popular converters: 0.8
- All other converters: 0.6

### Performance Targets
- Lighthouse Score: 95+
- LCP: < 2s
- CLS: < 0.1
- FID: < 100ms

---

## 🌐 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

**Vercel settings:**
- Framework: Next.js (auto-detected)
- Node.js: 20.x
- Build command: `npm run build`
- Output directory: `.next`

**Environment variables:** Add all `.env.example` values in Vercel Dashboard → Settings → Environment Variables.

### Vercel Edge Config (optional)
Both API routes use `runtime = 'edge'` for global low-latency.

---

## ⚡ Adding New Converters

### 1. Add units to existing category

```typescript
// src/lib/converters/length.ts
export const LENGTH_UNITS: Unit[] = [
  // ... existing units
  { id: 'new-unit', name: 'New Unit', symbol: 'nu' },
];

const TO_METERS: Record<string, number> = {
  // ... existing
  'new-unit': 0.001, // conversion factor to meters
};
```

### 2. Add a new category

```typescript
// src/lib/converters/myunits.ts
import type { Unit, ConversionResult } from '@/types';

export const MY_UNITS: Unit[] = [
  { id: 'unit-a', name: 'Unit A', symbol: 'A' },
  { id: 'unit-b', name: 'Unit B', symbol: 'B' },
];

const TO_BASE: Record<string, number> = {
  'unit-a': 1,
  'unit-b': 2.5,
};

export function convertMyUnits(value: number, from: string, to: string): ConversionResult {
  const result = value * (TO_BASE[from] / TO_BASE[to]);
  return {
    value: result,
    formatted: result.toString(),
    formula: `${value} × ${(TO_BASE[from] / TO_BASE[to]).toPrecision(6)} = ${result}`,
  };
}
```

Then register in `src/lib/converters/index.ts`:
```typescript
import { MY_UNITS } from './myunits';

export const CATEGORIES: ConverterCategory[] = [
  // ... existing
  {
    id: 'mycategory',
    name: 'My Category',
    slug: 'mycategory',
    description: '...',
    icon: '🔧',
    color: 'blue',
    units: MY_UNITS,
    converters: makeAllConverters('mycategory', MY_UNITS, []),
  },
];
```

And add the converter function to `ConverterEngine.tsx`:
```typescript
import { convertMyUnits } from '@/lib/converters/myunits';
const CONVERTERS = {
  // ...
  mycategory: convertMyUnits,
};
```

---

## 📱 PWA Setup

1. Create `public/icons/icon-192.png` (192×192px)
2. Create `public/icons/icon-512.png` (512×512px)
3. The manifest is auto-generated at `/manifest.json`
4. Service Worker is at `public/sw.js` (registered in `layout.tsx`)

**Installing on mobile:** Users see an "Add to Home Screen" prompt after visiting the site. The converter works fully offline (except live currency rates).

---

## 🛠 Scripts

```bash
npm run dev          # Development server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
npm run type-check   # TypeScript type check
```

---

## 📊 Analytics Setup

### Google Analytics 4
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create property → Web → get Measurement ID (`G-XXXXXXXX`)
3. Add to `NEXT_PUBLIC_GA_ID` in `.env.local`

### Google Search Console
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → verify via HTML tag → get code
3. Add to `NEXT_PUBLIC_GSC_VERIFICATION`
4. Submit sitemap: `https://convertnow.ca/sitemap.xml`

### Microsoft Clarity
1. Go to [clarity.microsoft.com](https://clarity.microsoft.com)
2. Create project → get Project ID
3. Add to `NEXT_PUBLIC_CLARITY_ID`

---

## 🔒 Security

- **CSP headers** configured in `next.config.ts`
- **Input sanitization** on all user inputs (search, converter values)
- **Rate limiting** on API routes via Vercel's edge network
- **No sensitive data** stored client-side
- **HTTPS enforced** by Vercel by default

---

## 🏗 Architecture Decisions

| Decision | Rationale |
|---|---|
| App Router (Next.js 15) | Best for SEO, RSC, streaming |
| Static generation + ISR | 200 popular pages built at deploy; rest on-demand |
| Edge Runtime for API | Global low-latency for currency + search |
| Client-side conversion | Instant results, no server round-trip needed |
| CSS variables + Tailwind | Theming without JS, zero flash |
| Intersection Observer for ads | CWV-safe lazy loading |
| localStorage for favorites | Zero backend, privacy-preserving |

---

## 📈 Scaling to Millions of Pages

The architecture supports unlimited programmatic pages:

1. **Add units** to any category → pages auto-generate
2. **ISR** handles pages not pre-built at deploy time
3. **Edge Runtime** API routes scale infinitely on Vercel
4. **No database** needed — all data is statically defined
5. **Sitemap** auto-updates with every new converter

To add 1000+ converters: just add more units to each category. All routes, pages, metadata, sitemaps, and schema are generated automatically.

---

## License

MIT — free to use, modify, and deploy.
