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
  makePost({
    slug: 'understanding-grams-and-carats',
    title: 'Understanding Grams and Carats: A Guide for Jewelers and Scientists',
    description: 'Learn the precise relationship between grams and carats, how the metric carat is defined, and why this matters for gemstone valuation and scientific measurement.',
    category: 'Education',
    tags: ['grams', 'carats', 'gemstones', 'jewelry', 'metric', 'science'],
    publishedAt: '2026-06-15',
    updatedAt: '2026-06-15',
    readTime: '5 min',
    author: 'ConvertNow Team',
    canonicalUrl: 'https://www.convertnow.ca/blog/understanding-grams-and-carats',
    ogImage: 'https://www.convertnow.ca/og/grams-carats-guide.png',
    relatedConverters: ['gram-to-carat', 'ounce-to-gram', 'gram-to-kilogram'],
    relatedShopProducts: ['digital-kitchen-scale', 'jewelry-scale'],
    content: [
      'What Is a Carat? The carat (ct) is a unit of mass used primarily for weighing gemstones and pearls. One metric carat is defined as exactly 200 milligrams, or 0.2 grams. This standard was adopted internationally in 1907 and remains the universal benchmark for gemstone valuation.',
      'Why Carats Matter for Gemstones: Gemstone prices scale exponentially with carat weight. A 2-carat diamond is worth far more than twice the price of a 1-carat diamond because larger stones are exponentially rarer. Accurate conversion between grams and carats is essential for appraisers, jewelers, and buyers to verify the true mass and market value of a gemstone.',
      'The Difference Between Carat and Karat: Carat (ct) measures mass. Karat (kt or K) measures gold purity. 24-karat gold is 99.9% pure. This distinction is a common source of confusion, especially in jewelry retail.',
      'Grams to Carats Quick Reference: 1 gram = 5 carats. 0.5 grams = 2.5 carats. 2 grams = 10 carats. 5 grams = 25 carats. Always use a digital scale with 0.001 g precision for gemstone weighing.',
      'Practical Tip for Buyers: If a jeweler quotes a gemstone in grams, convert immediately to carats to compare market prices. Use ConvertNow\'s gram-to-carat converter for instant, accurate results without manual math.',
    ],
  }),
  makePost({
    slug: 'miles-vs-kilometers-marathon-runners',
    title: 'Miles vs Kilometers: What Marathon Runners Need to Know',
    description: 'Understand the exact difference between miles and kilometers, how race distances compare, and why knowing both units is essential for every serious runner.',
    category: 'Fitness',
    tags: ['miles', 'kilometers', 'marathon', 'running', 'fitness', 'distance'],
    publishedAt: '2026-06-15',
    updatedAt: '2026-06-15',
    readTime: '4 min',
    author: 'ConvertNow Team',
    canonicalUrl: 'https://www.convertnow.ca/blog/miles-vs-kilometers-marathon-runners',
    ogImage: 'https://www.convertnow.ca/og/miles-kilometers-runners.png',
    relatedConverters: ['mile-to-kilometer', 'kilometer-to-mile', 'meter-to-yard'],
    relatedShopProducts: ['gps-running-watch', 'resistance-bands'],
    content: [
      'Why Runners Need Both Units: Most international races use kilometers. The US and UK still use miles for many events. A marathon is 42.195 kilometers, which is exactly 26.219 miles. Half-marathons are 21.0975 km or 13.109 miles. Knowing both units lets you train with any plan, regardless of origin.',
      'Pace Conversion Quick Guide: A 5:00 min/km pace equals roughly 8:03 min/mile. A 4:00 min/km pace equals roughly 6:26 min/mile. Many GPS watches can display both, but understanding the math helps when reviewing training plans or comparing race splits from different countries.',
      'Race Distance Reference Table: 5K = 3.106 miles. 10K = 6.213 miles. 15K = 9.320 miles. Half-marathon = 13.109 miles. Marathon = 26.219 miles. Ultra distances (50K, 100K, 100 miles) all require fast mental conversion when reading international race results.',
      'Training Plan Tip: If your plan is in miles but your watch shows kilometers, convert the key distances once and tape them to your fridge. Or use ConvertNow\'s mile-to-kilometer converter to rewrite the plan in your preferred unit before starting.',
    ],
  }),
  makePost({
    slug: 'converting-cooking-temperatures',
    title: 'Converting Cooking Temperatures: Fahrenheit, Celsius, and Gas Marks',
    description: 'A practical guide for home cooks and bakers who switch between American, European, and British recipes. Includes oven temperature tables and common conversion mistakes.',
    category: 'Cooking',
    tags: ['cooking', 'baking', 'fahrenheit', 'celsius', 'oven', 'temperature', 'recipes'],
    publishedAt: '2026-06-15',
    updatedAt: '2026-06-15',
    readTime: '4 min',
    author: 'ConvertNow Team',
    canonicalUrl: 'https://www.convertnow.ca/blog/converting-cooking-temperatures',
    ogImage: 'https://www.convertnow.ca/og/cooking-temperatures-guide.png',
    relatedConverters: ['celsius-to-fahrenheit', 'fahrenheit-to-celsius'],
    relatedShopProducts: ['oven-thermometer', 'digital-kitchen-scale'],
    content: [
      'Why Recipe Temperatures Differ by Region: American recipes use Fahrenheit. European recipes use Celsius. British recipes sometimes list "gas marks." A mismatch can ruin a bake or undercook meat. Knowing the exact conversion ensures consistent results across any cookbook.',
      'Oven Temperature Chart: 275°F = 135°C = Gas Mark 1. 300°F = 150°C = Gas Mark 2. 325°F = 165°C = Gas Mark 3. 350°F = 175°C = Gas Mark 4. 375°F = 190°C = Gas Mark 5. 400°F = 200°C = Gas Mark 6. 425°F = 220°C = Gas Mark 7. 450°F = 230°C = Gas Mark 8.',
      'Common Mistakes: Using a rough "double and add 30" mental shortcut for baking temperatures — the actual formula is (°C × 9/5) + 32. Trusting your oven dial: most home ovens run 10–25 degrees off, so an oven thermometer is essential. Preheating only until the light turns off: wait an extra 10 minutes for thermal stability.',
      'Pro Tip for International Recipes: When a recipe says "moderate oven," it usually means 350°F / 175°C. "Hot oven" means 425°F / 220°C. Bookmark ConvertNow\'s temperature converter and keep a printed copy in your kitchen drawer.',
    ],
  }),
  makePost({
    slug: 'how-digital-storage-works',
    title: 'How Digital Storage Works: Bits, Bytes, and Beyond',
    description: 'Understand the real difference between bits, bytes, kilobytes, and gigabytes. Why your 1TB hard drive only shows 931GB, and how to choose the right storage unit.',
    category: 'Education',
    tags: ['digital storage', 'bits', 'bytes', 'gigabytes', 'terabytes', 'computers'],
    publishedAt: '2026-06-16',
    updatedAt: '2026-06-16',
    readTime: '6 min',
    author: 'ConvertNow Team',
    canonicalUrl: 'https://www.convertnow.ca/blog/how-digital-storage-works',
    ogImage: 'https://www.convertnow.ca/og/digital-storage-guide.png',
    relatedConverters: ['bit-to-byte', 'gigabyte-to-terabyte', 'kilobyte-to-megabyte'],
    relatedShopProducts: ['external-hard-drive', 'usb-flash-drive'],
    content: [
      'Bits vs Bytes: The Foundation. A bit is the smallest unit — a 0 or 1. A byte is 8 bits. All digital storage is measured in bytes, but internet speeds are measured in bits per second. This causes confusion: a 100 Mbps connection downloads roughly 12.5 MB per second, not 100 MB.',
      'Binary vs Decimal Prefixes: Manufacturers use decimal (base-10): 1 TB = 1,000,000,000,000 bytes. Computers use binary (base-2): 1 TiB = 1,099,511,627,776 bytes. This is why a "1 TB" drive shows ~931 GB in Windows. The gap grows with larger drives: a 2 TB drive shows ~1.81 TB usable.',
      'Practical Storage Guide: 1 GB stores ~250 songs (MP3) or ~500 photos (compressed). 1 TB stores ~250,000 songs or ~500,000 photos. 4K video consumes ~20 GB per hour. Cloud storage plans (Google Drive, iCloud) measure in GB and TB, so converting accurately prevents surprise overage charges.',
      'How to Choose the Right Storage Unit: Use bits (b) for network speeds and data transfer rates. Use bytes (B) for file sizes and storage capacity. Use gigabytes (GB) for RAM, SSDs, and cloud storage. Use terabytes (TB) for large external drives, NAS systems, and video archives.',
      'Quick Conversion Reference: 1 byte = 8 bits. 1 KB = 1,024 bytes. 1 MB = 1,024 KB. 1 GB = 1,024 MB. 1 TB = 1,024 GB. Use ConvertNow\'s digital storage converter to instantly convert between any unit without memorizing powers of 2.',
    ],
  }),
  makePost({
    slug: 'pints-liters-brewers-guide',
    title: 'Pints vs Liters: A Brewer\'s Guide to Volume Conversions',
    description: 'Homebrewers and craft beer lovers face conflicting volume units. Learn how to convert pints, liters, gallons, and fluid ounces for consistent brewing results.',
    category: 'Cooking',
    tags: ['brewing', 'pints', 'liters', 'volume', 'homebrew', 'beer', 'gallons'],
    publishedAt: '2026-06-16',
    updatedAt: '2026-06-16',
    readTime: '5 min',
    author: 'ConvertNow Team',
    canonicalUrl: 'https://www.convertnow.ca/blog/pints-liters-brewers-guide',
    ogImage: 'https://www.convertnow.ca/og/pints-liters-brewers.png',
    relatedConverters: ['liter-to-us-pint', 'us-pint-to-liter', 'gallon-to-liter'],
    relatedShopProducts: ['measuring-cup-set', 'digital-kitchen-scale'],
    content: [
      'Why Brewers Need Precise Volume Conversions: A 5-gallon batch is 18.9 liters, not 20. A British pint is 568 ml, while a US pint is 473 ml. A recipe calling for "1 pint of wort" means different volumes depending on which country it originated from.',
      'Key Conversions for Homebrewing: 1 US gallon = 3.785 liters. 1 Imperial gallon = 4.546 liters. 1 US pint = 473 ml. 1 Imperial pint = 568 ml. 1 US fluid ounce = 29.57 ml. 1 Imperial fluid ounce = 28.41 ml. These differences compound across a full batch.',
      'Batch Size Reference: 5 US gallons = 18.9 liters. 10 US gallons = 37.9 liters. 1 barrel = 31 US gallons = 117 liters. If your recipe is liters-based but your fermenter is gallons, convert the full volume before measuring ingredients.',
      'Common Brewing Mistakes: Assuming "pint" means the same in every recipe. Not accounting for trub loss when converting batch sizes. Confusing US and Imperial gallons when ordering imported ingredients. Use ConvertNow\'s volume converter before every brew day.',
    ],
  }),
  makePost({
    slug: 'introduction-to-baking-conversions',
    title: 'Introduction to Baking Conversions: Cups, Grams, and Temperatures',
    description: 'A beginner-friendly guide to understanding why baking conversions matter and how to get started with weight-based baking without feeling overwhelmed.',
    category: 'Cooking',
    tags: ['baking', 'grams', 'cups', 'temperature', 'beginner', 'cooking temperatures'],
    publishedAt: '2026-06-16',
    updatedAt: '2026-06-16',
    readTime: '4 min',
    author: 'ConvertNow Team',
    canonicalUrl: 'https://www.convertnow.ca/blog/introduction-to-baking-conversions',
    ogImage: 'https://www.convertnow.ca/og/intro-baking-conversions.png',
    relatedConverters: ['gram-to-ounce', 'cup-to-milliliter', 'celsius-to-fahrenheit'],
    relatedShopProducts: ['digital-kitchen-scale', 'measuring-cup-set'],
    content: [
      'Why Baking Is Different from Cooking: Baking is chemistry. Small changes in ratios produce dramatically different textures, rises, and flavors. A cup of flour can vary by 20-30 grams depending on how it is scooped. That difference alone can turn a fluffy cake into a dense brick.',
      'The Case for Weighing Ingredients: Professional bakers weigh everything in grams because weight is absolute. 120 grams of flour is always 120 grams, regardless of how you transfer it. Volume measurements (cups, tablespoons) are convenient but imprecise. Converting recipes to grams is the single best upgrade a home baker can make.',
      'Where to Start: Pick one recipe you make often. Weigh each ingredient in grams the next time you bake it. Record the gram weights next to the cup measurements in your recipe book. Over time, you will build a personal conversion chart tailored to your technique.',
      'Oven Temperatures Matter Too: A recipe at 350°F works because the Maillard reaction and protein denaturation happen at precise temperatures. Converting to Celsius? The exact value is 176.67°C, but most ovens use 175°C. Use ConvertNow\'s temperature converter to find the nearest precise setting for your oven.',
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
