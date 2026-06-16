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
    slug: 'baking-conversion-chart-guide',
    title: 'Baking Conversion Chart: The Complete Guide to Grams, Cups, and Oven Temperatures',
    description: 'Use this baking conversion chart to convert cups, grams, ounces, and oven temperatures fast, with ingredient tables, tools, and tips for better results.',
    category: 'Cooking Conversions',
    tags: ['baking', 'grams to cups', 'cooking conversions', 'baking conversion chart', 'temperature', 'ingredients'],
    publishedAt: '2026-06-15',
    updatedAt: '2026-06-15',
    readTime: '8 min',
    author: 'ConvertNow Team',
    canonicalUrl: 'https://www.convertnow.ca/blog/baking-conversion-chart-guide',
    ogImage: 'https://www.convertnow.ca/blog-images/baking-conversion-chart-guide/hero.png',
    relatedConverters: ['gram-to-ounce', 'cup-to-milliliter', 'celsius-to-fahrenheit'],
    relatedShopProducts: ['digital-kitchen-scale', 'measuring-cup-set', 'oven-thermometer'],
    content: [
      'If you have ever followed a recipe that uses cups when your ingredients are listed in grams, you already know why a reliable baking conversion chart matters. A single cup of flour can vary by 30 grams or more depending on how it is scooped, packed, or leveled, which is more than enough to turn soft cookies into dry ones or make a cake feel dense instead of light. This guide gives you a practical way to convert cups to grams, grams to ounces, and Fahrenheit to Celsius, plus a fast-reference chart for the ingredients home bakers use most often.',
      'Why does a baking conversion chart matter? Baking is less forgiving than everyday cooking because ratios control texture, structure, and rise. When one source treats 1 cup of flour as 125 grams and another scoop comes out heavier, the difference changes hydration and can affect everything from muffins to sourdough. Professional bakers prefer weight because 120 grams is always 120 grams, while a cup depends on how the ingredient was measured. Not all cups mean the same thing: US standard is 236.59 ml, metric is 250 ml, and UK is 284.13 ml, so international recipes can drift fast unless you work in grams. Use cups for quick kitchen work, but use grams for recipes you care about repeating perfectly.',
      'How do grams convert to cups for common baking ingredients? The chart below gives quick baking conversions across 18 pantry staples: 1 cup all-purpose flour = 125 g, 1 cup bread flour = 130 g, 1 cup cake flour = 120 g, 1 cup almond flour = 96 g, 1 cup granulated sugar = 200 g, 1 cup packed brown sugar = 213 g, 1 cup powdered sugar = 113 g, 1 cup butter = 227 g, 1 cup oil = 218 g, 1 cup milk = 240 g, 1 cup honey = 340 g, 1 cup maple syrup = 322 g, 1 cup cocoa powder = 100 g, 1 cup chocolate chips = 175 g, 1 cup rolled oats = 90 g, 1 cup table salt = 273 g, 1 cup kosher salt = 168 g, 1 cup baking powder = 192 g.',
      'A few conversions are worth memorizing because they show up constantly in cookies, cakes, and quick breads: 125 g for 1 cup all-purpose flour, 200 g for 1 cup granulated sugar, 227 g for 1 cup butter, and 240 g for 1 cup milk. When a recipe looks inconsistent, these anchor numbers help you spot errors before you waste ingredients.',
      'What are the most useful baking conversions to memorize? 1 cup equals 16 tablespoons, 48 teaspoons, 8 fluid ounces, and 240 ml. 1 tablespoon equals 3 teaspoons and 15 ml. Quick conversions for home bakers: 3/4 cup = 12 tablespoons = 180 ml, 2/3 cup = 10 tablespoons + 2 teaspoons = 160 ml, 1/2 cup = 8 tablespoons = 120 ml, 1/3 cup = 5 tablespoons + 1 teaspoon = 80 ml, 1/4 cup = 4 tablespoons = 60 ml, 1 ounce = 28 g, 4 ounces = 113 g, and 8 ounces = 227 g.',
      'Which baking tools are actually worth buying? A good baking setup does not need to be expensive, but it should solve the most common accuracy problems. Recommend a digital kitchen scale, tare or zeroing before each ingredient, and nested measuring cups made for dry or liquid ingredients rather than mugs or drinking glasses.',
      "Editor's Pick: Escali Primo Digital Scale. Wirecutter says the Escali Primo is among the fastest and most accurate kitchen scales tested, which makes it a strong fit for bakers who want repeatable gram-based recipes. Best use: flour-heavy baking, bread doughs, cookie batches, and any recipe that lists grams first. Key specs: gram/ounce switching, tare function, 1 g resolution. Typical Amazon.ca range: about $35–$60. Product link: https://www.amazon.ca/s?k=Escali+Primo+Digital+Scale&tag=convertnow-20",
      'Other product picks for better baking: Amazon Basics Digital Kitchen Scale — best budget-friendly scale that appears in a recent tested roundup of kitchen scales. Key specs: grams and ounces, tare, easy-to-clean flat platform. Typical range: about $15–$25. Product link: https://www.amazon.ca/s?k=Amazon+Basics+Digital+Kitchen+Scale&tag=convertnow-20',
      'OXO Good Grips Kitchen Scale — best for larger batches, commonly compared in the premium home-baking scale group. Key specs: grams and ounces, large platform, simple controls. Typical range: about $40–$70. Product link: https://www.amazon.ca/s?k=OXO+Good+Grips+Kitchen+Scale&tag=convertnow-20',
      'Glass Liquid Measuring Cup Set — best for milk, oil, maple syrup, and honey because liquid cups are designed to be read at eye level. Key specs: cup and ml markings, 1-cup/2-cup/4-cup sizes, heat-safe glass. Typical range: about $20–$35. Product link: https://www.amazon.ca/s?k=Glass+Liquid+Measuring+Cup+Set&tag=convertnow-20',
      'Oven Thermometer — best for recipes that depend on precise heat. Key specs: dual Fahrenheit/Celsius display, hang-or-stand design, wide temperature range. Typical range: about $10–$20. Product link: https://www.amazon.ca/s?k=Oven+Thermometer&tag=convertnow-20',
      'How do oven temperature conversions affect results? Temperature mistakes are just as damaging as ingredient mistakes. Standard oven conversion charts place 350°F at 175°C, 375°F at 190°C, 400°F at 200°C, and 425°F at 220°C. Even a small mismatch can push a bake from moderate to much hotter than intended. If you bounce between North American and European recipes, do not guess. Use ConvertNow’s temperature converter and use an oven thermometer when your oven runs hot or cold.',
      'How can you avoid the most common measuring mistakes? The first mistake is using the wrong cup for the job. Dry measuring cups are meant to be filled to the top and leveled, while liquid measuring cups are meant to be read at a marked line below the rim. For flour, fluff it, spoon into the cup, and level with a knife instead of scooping directly from the bag. The second mistake is assuming every ingredient behaves like flour or sugar. Brown sugar is usually packed, powdered sugar is lighter by volume, and liquids like honey and maple syrup are much heavier than water-based ingredients per cup. The easiest habit change is to weigh each ingredient separately, tare between additions, and keep a trusted converter nearby for recipes that mix metric and imperial units.',
      'Conclusion: A dependable baking conversion chart saves time, reduces guesswork, and makes your recipes easier to repeat. When you remember a few base numbers, use grams for precision, and keep the right tools nearby, you get better texture, better rise, and far fewer failed bakes. Bookmark ConvertNow’s cooking converter, gram to ounce converter, and temperature converter before your next recipe.',
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
