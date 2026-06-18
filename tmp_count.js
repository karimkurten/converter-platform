const fs = require('fs');
const path = require('path');

function countUnits(filePath) {
  const content = fs.readFileSync('./src/lib/converters/' + filePath, 'utf8');
  const match = content.match(/export\s+const\s+(\w+_UNITS)\s*:\s*Unit\[\]\s*=\s*\[/);
  if (!match) return 0;
  // Simple regex count of objects between [ and ] export const X_UNITS: Unit[] = [ ... ];
  const startIdx = content.indexOf('[');
  const endIdx = content.indexOf('];');
  if (startIdx === -1 || endIdx === -1) return 0;
  const arrText = content.slice(startIdx + 1, endIdx);
  // count objects by }
  let objectCount = 0;
  let braceDepth = 0;
  let insideObject = false;
  for (let i = 0; i < arrText.length; i++) {
    if (arrText[i] === '{') {
      if (!insideObject) {
        insideObject = true;
        braceDepth = 1;
      } else {
        braceDepth++;
      }
    } else if (arrText[i] === '}') {
      braceDepth--;
      if (braceDepth === 0) {
        objectCount++;
        insideObject = false;
      }
    }
  }
  return objectCount;
}

let totalConverters = 0;
let totalCategoryHubs = 0;
let totalStaticPages = 0;

// Units
const unitFiles = {
  length: 'length.ts',
  weight: 'weight.ts',
  temperature: 'temperature.ts',
  area: 'units.ts',
  volume: 'units.ts',
  speed: 'units.ts',
  time: 'units.ts',
  digital: 'units.ts',
};

const categoryUnits = {};

// Use simpler approach: grep counts from index.ts CATEGORIES
const indexText = fs.readFileSync('./src/lib/converters/index.ts', 'utf8');

// Count converters via getAllConverterPaths
const funcMatch = indexText.match(/getAllConverterPaths[\s\S]*?return\s*CATEGORIES\.flatMap\(cat\s*=>[\s\S]*?\);/);
let converterCount = 0;

// Parse categories manually from index.ts CATEGORIES array
const catSection = indexText.slice(indexText.indexOf('export const CATEGORIES'));

// Currency has special makeConverters call, others makeAllConverters
const categories = [];

// find all makeAllConverters / makeConverters calls inside CATEGORIES:
const makeAllRegex = /makeAllConverters\('(\w+)',\s*(\w+_UNITS)/g;
const makeRegex = /makeConverters\('(\w+)',/g;

let m;
while ((m = makeAllRegex.exec(catSection)) !== null) {
  categories.push(m[1]);
}
while ((m = makeRegex.exec(catSection)) !== null) {
  categories.push(m[1]);
}

console.log('CATEGORIES found:', categories.length);

// Use a node script to actually execute the module and get numbers by counting units in each file
// But we can't require ts, let's just count the units arrays directly in the source text.

const files = fs.readdirSync('./src/lib/converters');
for (const f of files) {
  if (!f.endsWith('.ts') || f === 'index.ts') continue;
  const text = fs.readFileSync('./src/lib/converters/' + f, 'utf8');
  const unitMatch = text.match(/export\s+const\s+(\w+_UNITS)\s*:\s*Unit\[\]\s*=\s*\[/);
  if (!unitMatch) continue;
  const arrStart = text.indexOf('[');
  const arrEnd = text.indexOf('];');
  if (arrStart === -1 || arrEnd === -1) continue;
  const arr = text.slice(arrStart + 1, arrEnd);
  let count = (arr.match(/\{[\s\S]*?\}/g) || []).length;
  console.log(f.replace('.ts','') + ': ' + count + ' units');
}

console.log('\n--- Currency ---');
const currencyText = fs.readFileSync('./src/lib/converters/currency.ts', 'utf8');
const currencyCount = (currencyText.match(/^\s*\{\s*code:/gm) || []).length;
console.log('Currencies: ' + currencyCount);

// Special currency pairs count
const pairMatch = currencyText.match(/export\s+const\s+POPULAR_CURRENCY_PAIRS\s*=\s*\[([\s\S]*?)\];/);
const pairCount = pairMatch ? (pairMatch[1].match(/\{\s*from:/g) || []).length : 0;
console.log('Currency popular pairs (bidirectional): ' + (pairCount * 2) );

// Let's compute total manually:
// length: 14 units => 14*13 = 182
// weight: 13 => 13*12 = 156
// temperature: 5 => 5*4 = 20
// area: 10 => 10*9 = 90
// volume: 14 => 14*13 = 182
// speed: 7 => 7*6 = 42
// time: 12 => 12*11 = 132
// digital: 12 => 12*11 = 132
// cooking (filtered volume): 7 => 7*6 = 42
// currency: popular pairs * 2 = 20
// Total = 182+156+20+90+182+42+132+132+42+20 = 998
console.log('\nTotal estimated converter pages = ~998');
console.log('Total category hub pages = 10 (9 + currency)');
console.log('Static pages: blog, about, contact, privacy, terms, editorial policy, etc.');
