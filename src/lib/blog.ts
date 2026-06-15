import type { Metadata } from 'next';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  author: string;
  canonicalUrl: string;
  ogImage: string;
  content: string;
  relatedConverters?: string[];
  relatedShopProducts?: string[];
}

function makePost(data: Omit<BlogPost, 'content'> & { content: string[] }): BlogPost {
  return { ...data, content: data.content.join('\n\n') };
}

export const blogPosts: BlogPost[] = [
  makePost({
    slug: 'metric-vs-imperial-guide',
    title: 'The Complete Guide to Metric vs Imperial Systems',
    description: 'Understand the key differences between metric and imperial measurement systems, which countries use each, and how to convert between them reliably.',
    category: 'Education',
    tags: ['metric', 'imperial', 'conversion guide', 'measurement systems'],
    publishedAt: '2026-06-14',
    updatedAt: '2026-06-14',
    readTime: '5 min',
    author: 'ConvertNow Team',
    canonicalUrl: 'https://www.convertnow.ca/blog/metric-vs-imperial-guide',
    ogImage: 'https://www.convertnow.ca/og/metric-vs-imperial.png',
    relatedConverters: ['kilometer-to-mile', 'kilogram-to-pound', 'celsius-to-fahrenheit'],
    relatedShopProducts: ['tape-measure', 'kitchen-scale'],
    content: [
      'The metric system (SI) is used by nearly every country except the United States, Liberia, and Myanmar. Imperial units dominate in the US for everyday measurements like miles, pounds, and Fahrenheit. Understanding both is essential for travelers, engineers, and anyone working across borders.',
      'Key Differences: Metric is based on powers of 10 (1000 meters = 1 kilometer). Imperial is based on historical measurements (1 mile = 1760 yards).',
      'Common Conversions: 1 mile = 1.60934 kilometers. 1 pound = 0.453592 kilograms. 1 inch = 2.54 centimeters exactly.',
      'Use ConvertNow.ca to convert any unit instantly with the exact formula displayed.',
    ],
  }),
  makePost({
    slug: 'grams-cups-baking',
    title: 'How Many Grams in a Cup? The Ultimate Baking Conversion Guide',
    description: 'Accurate gram-to-cup conversions for flour, sugar, butter, and 50+ baking ingredients. Stop guessing and bake with precision.',
    category: 'Cooking',
    tags: ['baking', 'grams to cups', 'cooking conversions', 'flour'],
    publishedAt: '2026-06-14',
    updatedAt: '2026-06-14',
    readTime: '4 min',
    author: 'ConvertNow Team',
    canonicalUrl: 'https://www.convertnow.ca/blog/grams-cups-baking',
    ogImage: 'https://www.convertnow.ca/og/grams-cups-baking.png',
    relatedConverters: ['gram-to-ounce', 'cup-to-milliliter'],
    relatedShopProducts: ['digital-kitchen-scale', 'measuring-cup-set'],
    content: [
      'Why Do Baking Conversions Matter? Professional bakers use grams because they are precise. A cup of flour can weigh anywhere from 120g (scooped) to 150g (spooned). Grams eliminate that variance.',
      'Quick Reference: All-purpose flour: 1 cup = 128g. Granulated sugar: 1 cup = 201g. Brown sugar (packed): 1 cup = 210g. Butter: 1 cup = 227g. Honey: 1 cup = 340g.',
      'Pro Tip: Invest in a digital kitchen scale that measures both grams and ounces for perfect results every time.',
    ],
  }),
  makePost({
    slug: 'celsius-fahrenheit-travel',
    title: 'Celsius to Fahrenheit: Quick Tricks for Travelers',
    description: 'Learn simple mental math tricks to convert Celsius to Fahrenheit when traveling. Plus: how to set your thermostat abroad.',
    category: 'Travel',
    tags: ['temperature', 'travel', 'celsius', 'fahrenheit', 'tips'],
    publishedAt: '2026-06-14',
    updatedAt: '2026-06-14',
    readTime: '3 min',
    author: 'ConvertNow Team',
    canonicalUrl: 'https://www.convertnow.ca/blog/celsius-fahrenheit-travel',
    ogImage: 'https://www.convertnow.ca/og/celsius-fahrenheit-travel.png',
    relatedConverters: ['celsius-to-fahrenheit'],
    relatedShopProducts: ['thermometer'],
    content: [
      'The Quick Mental Trick: To convert °C to °F roughly, multiply by 2 and add 30. Example: 20°C x 2 + 30 = 70°F (actual: 68°F — close!). For exact: multiply by 9/5 and add 32.',
      'Common Temperatures: 0°C = 32°F (freezing). 20°C = 68°F (comfortable room). 37°C = 98.6°F (body temperature).',
      'Travel Tips: Set your hotel AC to 21°C (70°F) for ideal comfort. Oven temps: 180°C = 356°F (baking standard).',
    ],
  }),
  makePost({
    slug: 'best-tape-measure-metric-imperial',
    title: 'Best Tape Measures with Both Metric and Imperial in 2026',
    description: 'Top-rated tape measures that display metric and imperial units. Perfect for international travelers, contractors, and DIYers.',
    category: 'Tools',
    tags: ['tape measure', 'tools', 'metric', 'imperial', 'DIY'],
    publishedAt: '2026-06-14',
    updatedAt: '2026-06-14',
    readTime: '4 min',
    author: 'ConvertNow Team',
    canonicalUrl: 'https://www.convertnow.ca/blog/best-tape-measure-metric-imperial',
    ogImage: 'https://www.convertnow.ca/og/tape-measure-guide.png',
    relatedConverters: ['inch-to-centimeter', 'foot-to-meter', 'yard-to-meter'],
    relatedShopProducts: ['tape-measure'],
    content: [
      'Why Dual-Sided Tape Measures Matter: Working with both metric and imperial projects? A dual-sided tape measure saves time and eliminates conversion errors.',
      'Top Picks: Stanley FatMax 25ft/7.5m — rugged, accurate, long-lasting. Komelon Self-Lock 25ft — easy read, lock mechanism. Milwaukee Magnetic 25ft — magnetic hook, fractional markings.',
    ],
  }),
  makePost({
    slug: 'digital-kitchen-scale-guide',
    title: 'Digital Kitchen Scale Buying Guide: Grams, Ounces, and Precision',
    description: 'How to choose a digital kitchen scale that measures grams, ounces, kilograms, and pounds accurately.',
    category: 'Tools',
    tags: ['kitchen scale', 'grams', 'ounces', 'baking'],
    publishedAt: '2026-06-14',
    updatedAt: '2026-06-14',
    readTime: '4 min',
    author: 'ConvertNow Team',
    canonicalUrl: 'https://www.convertnow.ca/blog/digital-kitchen-scale-guide',
    ogImage: 'https://www.convertnow.ca/og/kitchen-scale-guide.png',
    relatedConverters: ['gram-to-ounce', 'kilogram-to-pound'],
    relatedShopProducts: ['digital-kitchen-scale'],
    content: [
      'What to Look For in a Digital Scale: Dual unit display (grams + ounces). Precision: 0.1g for baking, 1g for cooking. Tare function for zeroing containers. Platform size suitable for bowls. Easy-to-clean surface.',
    ],
  }),
  makePost({
    slug: 'travel-currency-guide',
    title: 'The Ultimate Travel Currency Conversion Guide for 2026',
    description: 'Everything travelers need to know about converting currency, understanding exchange rates, and avoiding hidden fees on international trips.',
    category: 'Travel',
    tags: ['currency', 'travel', 'exchange rates', 'vacation', 'money'],
    publishedAt: '2026-06-14',
    updatedAt: '2026-06-14',
    readTime: '5 min',
    author: 'ConvertNow Team',
    canonicalUrl: 'https://www.convertnow.ca/blog/travel-currency-guide',
    ogImage: 'https://www.convertnow.ca/og/travel-currency-guide.png',
    relatedConverters: ['usd-to-cad', 'eur-to-usd', 'gbp-to-eur'],
    relatedShopProducts: ['travel-wallet', 'luggage-scale'],
    content: [
      'Before You Travel: Currency Basics. Start by checking live exchange rates with ConvertNow\'s currency converter. Rates change every 60 minutes.',
      'Common Pitfalls to Avoid: Airport exchange booths charge fees up to 15% higher than mid-market rate. Dynamic Currency Conversion (DCC): always pay in the local currency, not your home currency. Use a card with 0% FX fees.',
      'Best Practices: Download a currency converter app for offline access. Inform your bank before traveling. Carry small bills for tips, taxis, and local markets. Use ATMs at major banks for the best rates.',
      'Quick Reference for Popular Routes: USD to EUR: ~0.92. CAD to USD: ~0.73. GBP to EUR: ~1.18. AUD to USD: ~0.67.',
    ],
  }),
  makePost({
    slug: 'fitness-weight-conversion-guide',
    title: 'How to Track Fitness Progress with Weight Conversions',
    description: 'Understanding body weight, nutrition serving sizes, and gym plate conversions for accurate fitness tracking across metric and imperial systems.',
    category: 'Fitness',
    tags: ['fitness', 'weight', 'nutrition', 'gym', 'health'],
    publishedAt: '2026-06-14',
    updatedAt: '2026-06-14',
    readTime: '4 min',
    author: 'ConvertNow Team',
    canonicalUrl: 'https://www.convertnow.ca/blog/fitness-weight-conversion-guide',
    ogImage: 'https://www.convertnow.ca/og/fitness-weight-guide.png',
    relatedConverters: ['kilogram-to-pound', 'gram-to-ounce', 'mile-to-kilometer'],
    relatedShopProducts: ['smart-scale', 'resistance-bands'],
    content: [
      'Body Weight Tracking Across Countries: Your gym might show kg on the scale, but your fitness app tracks in lbs. Convert accurately so your progress chart never lies.',
      'Nutrition Label Conversions: Protein per serving: many labels use grams, but recipes call for ounces. 1 oz of protein = ~28 grams. Carbohydrates: 1 cup of rice = ~195g cooked.',
      'Gym Plate Math: A standard Olympic barbell = 20 kg (44 lbs). 45 lb plate = 20.4 kg. 25 lb plate = 11.3 kg. Quick tip: 1 kg = 2.2 lbs.',
      'Recommended Tools: A digital scale that switches between kg and lbs. A food scale for meal prep (grams are more precise than cups).',
    ],
  }),
  makePost({
    slug: 'psi-to-bar-engineering',
    title: "PSI to Bar: The Engineer's Guide to Pressure Conversions",
    description: 'Why engineers, mechanics, and HVAC technicians need precise pressure conversions. Includes real-world applications and common mistakes.',
    category: 'Engineering',
    tags: ['pressure', 'engineering', 'psi', 'bar', 'mechanic', 'HVAC'],
    publishedAt: '2026-06-14',
    updatedAt: '2026-06-14',
    readTime: '4 min',
    author: 'ConvertNow Team',
    canonicalUrl: 'https://www.convertnow.ca/blog/psi-to-bar-engineering',
    ogImage: 'https://www.convertnow.ca/og/psi-bar-engineering.png',
    relatedConverters: ['psi-to-bar', 'bar-to-pascal', 'atm-to-psi'],
    relatedShopProducts: ['pressure-gauge', 'digital-pressure-meter'],
    content: [
      'Why Pressure Units Confuse Everyone: Different countries, industries, and even machines use different pressure units. American car tires use PSI. European HVAC systems use bar. Scientific research uses pascals.',
      'The Exact Formula: 1 bar = 14.5038 PSI. 1 PSI = 0.06895 bar. 1 bar = 100,000 pascals (Pa).',
      'Real-World Applications: Car tires: 32-35 PSI = 2.2-2.4 bar. Bicycle tires: 80-120 PSI = 5.5-8.3 bar. HVAC systems: 1-3 bar = 14.5-43.5 PSI. Hydraulic systems: up to 300 bar = 4,350 PSI.',
      'Common Mistakes: Mixing absolute pressure with gauge pressure. Forgetting that atmospheric pressure is ~1 bar / 14.7 PSI at sea level. Using rough approximations that compound errors in large systems.',
    ],
  }),
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts;
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(post => post.category === category);
}

export function getRelatedBlogPosts(slug: string): BlogPost[] {
  const current = getBlogPostBySlug(slug);
  if (!current) return [];
  return blogPosts.filter(post => {
    if (post.slug === slug) return false;
    return post.tags.some(tag => current.tags.includes(tag));
  }).slice(0, 3);
}
