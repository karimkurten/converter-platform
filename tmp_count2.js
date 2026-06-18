const fs = require('fs');

function countUnitsInFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const unitMatch = text.match(/export\s+const\s+(\w+_UNITS)\s*:\s*Unit\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (!unitMatch) return 0;
  // Count top-level objects in the array by matching balanced braces
  const arrText = unitMatch[2];
  let count = 0;
  let depth = 0;
  let inObj = false;
  for (let i = 0; i < arrText.length; i++) {
    if (arrText[i] === '{') {
      if (!inObj) { inObj = true; depth = 1; }
      else depth++;
    } else if (arrText[i] === '}') {
      depth--;
      if (depth === 0) { count++; inObj = false; }
    }
  }
  return count;
}

// Count units per category
const cats = {
  length: './src/lib/converters/length.ts',
  weight: './src/lib/converters/weight.ts',
  temperature: './src/lib/converters/temperature.ts',
  area: './src/lib/converters/units.ts',
  volume: './src/lib/converters/units.ts',
  speed: './src/lib/converters/units.ts',
  time: './src/lib/converters/units.ts',
  digital: './src/lib/converters/units.ts',
};

let totalConverters = 0;
console.log('--- Converter counts by category ---');
for (const [name, file] of Object.entries(cats)) {
  const units = countUnitsInFile(file);
  const converters = units * (units - 1);
  totalConverters += converters;
  console.log(`${name}: ${units} units → ${converters} converters`);
}

// Cooking is a filtered subset of volume
const volumeUnits = countUnitsInFile('./src/lib/converters/units.ts');
// From index.ts: cooking uses filtered volume units
const cookingUnitIds = ['us-cup', 'tablespoon', 'teaspoon', 'us-fluid-oz', 'us-pint', 'liter', 'milliliter'];
const cookingUnits = cookingUnitIds.length;
const cookingConverters = cookingUnits * (cookingUnits - 1);
totalConverters += cookingConverters;
console.log(`cooking: ${cookingUnits} units → ${cookingConverters} converters (filtered volume)`);

// Currency from popular pairs * 2
const currencyText = fs.readFileSync('./src/lib/converters/currency.ts', 'utf8');
const pairMatch = currencyText.match(/export\s+const\s+POPULAR_CURRENCY_PAIRS\s*=\s*\[([\s\S]*?)\];/);
const pairCount = pairMatch ? (pairMatch[1].match(/\{\s*from:/g) || []).length : 0;
const currencyConverters = pairCount * 2;
totalConverters += currencyConverters;
console.log(`currency: ${pairCount} pairs → ${currencyConverters} converters (bidirectional)`);

console.log(`\nTOTAL CONVERTER PAGES: ${totalConverters}`);

// Category hubs
const categories = Object.keys(cats).length + 2; // + cooking + currency
console.log(`CATEGORY HUB PAGES: ${categories}`);

// Static pages
console.log(`STATIC/POLICY PAGES: ~8 (/, about, contact, privacy, terms, editorial-policy, affiliate-disclosure, sitemap)`);

// Blog posts
const blogText = fs.readFileSync('./src/lib/blog.ts', 'utf8');
const blogCount = (blogText.match(/makePost\(\{/g) || []).length;
console.log(`BLOG POSTS: ${blogCount}`);

const totalUrls = totalConverters + categories + 8 + blogCount;
console.log(`\nTOTAL ESTIMATED SITE URLS: ${totalUrls}`);
console.log(`\n=> Converters represent ${Math.round((totalConverters / totalUrls) * 100)}% of all URLs`);
