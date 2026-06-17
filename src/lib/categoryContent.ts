import type { ConverterCategory } from '@/types';

export interface CategoryHubContent {
  heroTitle: string;
  heroDescription: string;
  intro: string;
  history: string;
  whyItMatters: string;
  whoUsesIt: string;
  commonConfusions: string;
  unitsTableHeader: string;
  unitsTable: { name: string; symbol: string; baseEquiv: string; countryUse: string }[];
  quickRefHeader: string;
  quickRef: { from: string; to: string; factor: string }[];
  faqs: { question: string; answer: string }[];
  crossLinks: { name: string; slug: string; text: string }[];
  wordCount: number;
}

function getCategoryHistory(catId: string): string {
  const map: Record<string, string> = {
    length: `Humans have measured length for over 40,000 years. The ancient Egyptians used the cubit (~52 cm), based on the forearm. The Romans standardised the foot at 296 mm and the mile as 1,000 paces. In 1793 France introduced the metre, defined originally as one ten-millionth of the distance from the equator to the North Pole. Today the metre is defined by the speed of light in a vacuum (1/299,792,458 of a second).`,
    weight: `Weight measurement traces back to grain seeds and carob seeds used as balance-scale weights over 5,000 years ago. The Roman libra gave us the pound. In 1795 the gram was defined from a cubic centimetre of water. The kilogram was the last SI base unit tied to a physical artefact — a platinum-iridium cylinder in Sèvres — until 2019, when it was redefined using Planck's constant.`,
    temperature: `Temperature scales emerged from practical necessity. Fahrenheit based his scale on brine, water, and body temperature (~1724). Celsius inverted his scale so 0 = freezing and 100 = boiling (1742). Kelvin introduced absolute zero in 1848, creating the thermodynamic scale used in all modern science.`,
    currency: `Currency began as barter, then commodity money (salt, shells, gold). The first coins appeared in Lydia (~600 BCE). Paper money emerged in China (~1000 CE). Today fiat currencies float on foreign-exchange markets. The US dollar is the world's reserve currency, while the Euro dominates European trade.`,
    volume: `Volume was initially measured with grain, jugs, and gills. The litre was defined in 1795 as one cubic decimetre. The US gallon derives from the British wine gallon (231 cubic inches), while the imperial gallon was standardised at 4.54609 litres in 1824. These differences still cause confusion between US and UK recipes.`,
    area: `Land measurement dates to ancient Egypt where surveyors (rope-stretchers) used knotted ropes for boundary marking. The acre originated as the area a yoke of oxen could plough in a day (~0.4 hectares). The hectare was introduced with the metric system and is now standard for farmland globally.`,
    speed: `Speed was first estimated by pacing and later by mechanical log-lines on ships. The knot (nautical miles per hour) comes from counting knots in a rope passing through a sailor's fingers. Land speedometers arrived with automobiles in the 20th century. The speed of light is now the physical constant defining length.`,
    time: `Timekeeping began with sundials and water clocks. The Babylonians gave us the 60-second minute and 60-minute hour. Mechanical clocks appeared in medieval Europe. The modern second is defined by the hyperfine transition frequency of caesium-133 atoms (atomic clocks), accurate to one second in 100 million years.`,
    digital: `Data storage units trace the evolution of computing. A byte settled on 8 bits by IBM in the 1960s. Kilobytes originally meant 1,024 bytes (binary). Hard-drive marketers later adopted the decimal 1,000 bytes, creating the binary prefixes kiB, MiB, GiB in 1998 to resolve confusion.`,
    pressure: `Pressure measurement started with Torricelli's mercury barometer (1643). The atmosphere (atm), torr (mmHg), and psi (pounds per square inch) emerged from practical engineering. The pascal (Pa) — one newton per square metre — became the SI standard in 1971, though psi and bar remain dominant in industry.`,
    energy: `The concept of energy unified heat and mechanical work in the 19th century. Joule established the mechanical equivalent of heat (~1843). The joule (J) is now the SI unit. The calorie lingers in nutrition, the BTU in HVAC, and the kilowatt-hour in electricity billing.`,
    cooking: `Cooking measurements evolved from household improvisations to standardised cups and spoons. A US cup is 240 mL, while a metric cup is 250 mL. The tablespoon varies: 15 mL (US/UK), 20 mL (Australia). Professional kitchens use weight (grams) for precision; home cooks rely on volume, leading to inconsistent results.`,
    fuel: `Fuel economy measurement reflects regional habits. Miles per gallon (mpg) dominates the US and UK, but the two countries use different gallon sizes (US = 3.785 L; imperial = 4.546 L). Most of the world uses litres per 100 kilometres (L/100 km), which inverts the ratio so lower is better — the opposite of mpg.`,
  };
  return map[catId] || 'This measurement category has a rich history tied to trade, science, and everyday life across civilizations.';
}

function getWhyItMatters(catId: string): string {
  const map: Record<string, string> = {
    length: 'Accurate length conversion is essential in construction blueprints, manufacturing tolerances, navigation, and sports officiating. A 5 mm error in a bridge girder can compromise structural integrity. Travelers crossing borders switch between miles and kilometres daily.',
    weight: 'Weight conversions protect health (medication dosing), commerce (shipping costs), and safety (aircraft load limits). A 1 kg mistake in luggage fees can cost travellers; a 0.1 g error in pharmaceutical compounding can be dangerous.',
    temperature: 'Temperature conversion prevents cooking failures, industrial defects, and medical misdiagnosis. A 10 °C oven error destroys a soufflé. Semiconductor fabrication requires ±0.1 °C stability. Fever thresholds differ between °C and °F clinical scales.',
    currency: 'Currency conversion directly affects purchasing power, investment returns, and travel budgets. A 2 % exchange-rate swing on a $10,000 transfer is $200 — enough for a hotel night. Hedge funds trade on fractional pip differences.',
    volume: 'Volume conversion prevents recipe disasters, chemical reactions, and fuel miscalculations. Mixing 500 mL of acid with 500 mL of water differs from mixing 500 mL with 500 fl oz. Fuel tank capacities confuse travellers renting cars abroad.',
    area: 'Area conversion determines property value, crop yield, and material ordering. A 10 m² error in flooring purchase means wasted money or incomplete installation. Agricultural subsidies are tied to exact hectare counts.',
    speed: 'Speed conversion is life-or-death on roads and runways. A pilot mixing knots with km/h loses situational awareness. Speed cameras often trigger at precise thresholds; defending a ticket requires exact unit verification.',
    time: 'Time conversion underpins global scheduling, payroll, astronomy, and project management. A one-hour time-zone error costs virtual meetings and flight connections. Software timestamps require millisecond precision across distributed systems.',
    digital: 'Data storage conversion prevents cloud-cost overruns and capacity planning failures. A 1 TB backup requires 1,000 GB of cloud storage — but billing might charge by binary TiB. Misreading transfer speeds (MB/s vs Mb/s) wastes hours troubleshooting.',
    pressure: 'Pressure conversion ensures safety in tyres, boilers, diving, and medicine. A 5 psi under-inflated tyre increases fuel consumption by 3 %. Diving tables use bar/atm for decompression stops; confusion causes decompression sickness.',
    energy: 'Energy conversion drives utility bills, fitness tracking, and climate policy. A homeowner comparing electricity tariffs must understand kWh vs joules. Food labels mix calories and kilojoules, confusing diet planning.',
    cooking: 'Cooking conversion turns recipes from different countries into edible meals. A US tablespoon (15 mL) vs an Australian tablespoon (20 mL) changes seasoning intensity. Baking requires gram-level precision; volume measures fail for flour density variations.',
    fuel: 'Fuel economy conversion affects vehicle purchase decisions and carbon footprint calculations. A car rated at 25 US mpg equates to 9.4 L/100 km — a figure Europeans instantly understand as efficient or not. Fleet managers compare across regions using consistent units.',
  };
  return map[catId] || 'Accurate conversion in this category is essential for professionals, students, and everyday decision-making.';
}

function getWhoUsesIt(catId: string): string {
  const map: Record<string, string> = {
    length: 'Engineers, architects, surveyors, carpenters, seamstresses, athletes, cartographers, and students.',
    weight: 'Pharmacists, nutritionists, fitness trainers, logistics managers, jewelers, and home cooks.',
    temperature: 'Chefs, meteorologists, HVAC technicians, doctors, lab technicians, and science students.',
    currency: 'Travellers, traders, e-commerce operators, accountants, expatriates, and online shoppers.',
    volume: 'Chemists, bartenders, bakers, fuel station attendants, pharmacists, and aquarium hobbyists.',
    area: 'Real estate agents, farmers, landscape architects, urban planners, solar panel installers, and painters.',
    speed: 'Pilots, sailors, drivers, sports coaches, physicists, traffic planners, and motorsport engineers.',
    time: 'Project managers, astronomers, payroll clerks, athletes, gamers, and international teams.',
    digital: 'IT administrators, video editors, photographers, cloud engineers, and mobile users managing storage.',
    pressure: 'Mechanics, scuba divers, meteorologists, HVAC engineers, medical professionals, and tyre technicians.',
    energy: 'Electricians, dietitians, climate scientists, utility managers, and gym users tracking workouts.',
    cooking: 'Home bakers, professional chefs, food bloggers, recipe developers, and culinary students.',
    fuel: 'Fleet managers, car buyers, logistics coordinators, and environmentally conscious drivers comparing efficiency.',
  };
  return map[catId] || 'Professionals, students, hobbyists, and anyone working across international or scientific contexts.';
}

function getCommonConfusions(catId: string): string {
  const map: Record<string, string> = {
    length: 'Miles vs kilometres (1 mi = 1.609 km) and inches vs centimetres (1 in = 2.54 cm) are the most confused. A "5 km walk" is roughly 3.1 miles — not 5 miles.',
    weight: 'Pounds vs kilograms (1 lb ≈ 0.454 kg) and ounces vs grams (1 oz ≈ 28.35 g). Many people estimate 1 kg ≈ 2 lb, which is close enough for luggage but inaccurate for medicine.',
    temperature: 'Fahrenheit and Celsius have different zero points and scale degrees. 25 °C is 77 °F — a comfortable room temperature, not hot. Body temperature is 37 °C = 98.6 °F.',
    currency: 'Exchange rates move constantly. A rate from last week may differ by 2–5 % today. Always use live rates for large transactions. Also, currency symbols overlap ($ = USD, CAD, AUD, NZD).',
    volume: 'US vs imperial gallons (3.785 L vs 4.546 L) and metric cups (250 mL) vs US cups (240 mL). A UK recipe using "1 cup" measured with a US cup loses 4 % accuracy.',
    area: 'Square metres vs square feet (1 m² ≈ 10.76 ft²) and acres vs hectares (1 ha = 2.471 ac). Property buyers often misjudge size when switching between listing countries.',
    speed: 'Miles per hour vs km/h (1 mph = 1.609 km/h). A 60 mph speed limit is ~97 km/h, not 60 km/h. Also, knots are nautical miles per hour — not statute miles.',
    time: 'AM/PM vs 24-hour format causes scheduling confusion. Midnight is 00:00, not 24:00. Time zones shift by 15° longitude per hour; daylight saving adds complexity.',
    digital: 'MB vs Mb (megabytes vs megabits). An 8 Mb/s internet connection downloads 1 MB/s. Storage vendors use decimal GB; OS uses binary GiB — a 500 GB drive shows ~465 GiB.',
    pressure: 'PSI vs bar (1 bar ≈ 14.5 psi). Car tyres display dozens of psi; bicycle tyres use 4–8 bar. Diving computers use bar/atm; weather forecasts use hectopascals (hPa).',
    energy: 'Calorie (cal) vs kilocalorie (kcal = Calorie on food labels). A "100-calorie snack" is actually 100 kcal = 100,000 cal. kWh (electricity) is 3.6 MJ.',
    cooking: 'Tablespoon vs teaspoon (3:1 ratio in US). A US tablespoon is 15 mL; Australian is 20 mL. "One cup of flour" varies by 30 g depending on scooping method.',
    fuel: 'US mpg vs UK mpg (different gallon sizes). A 25 US mpg car gets ~30 UK mpg. Also, mpg and L/100 km are inverse — higher mpg means lower L/100 km.',
  };
  return map[catId] || 'Always verify the unit system and direction before converting, especially when switching between metric and imperial measurements.';
}

function getUnitTable(catId: string): { name: string; symbol: string; baseEquiv: string; countryUse: string }[] {
  const map: Record<string, { name: string; symbol: string; baseEquiv: string; countryUse: string }[]> = {
    length: [
      { name: 'Metre', symbol: 'm', baseEquiv: '1 m', countryUse: 'Global (SI)' },
      { name: 'Kilometre', symbol: 'km', baseEquiv: '1,000 m', countryUse: 'Global' },
      { name: 'Centimetre', symbol: 'cm', baseEquiv: '0.01 m', countryUse: 'Global' },
      { name: 'Millimetre', symbol: 'mm', baseEquiv: '0.001 m', countryUse: 'Global' },
      { name: 'Inch', symbol: 'in', baseEquiv: '0.0254 m', countryUse: 'US, UK' },
      { name: 'Foot', symbol: 'ft', baseEquiv: '0.3048 m', countryUse: 'US, UK' },
      { name: 'Yard', symbol: 'yd', baseEquiv: '0.9144 m', countryUse: 'US, UK' },
      { name: 'Mile', symbol: 'mi', baseEquiv: '1,609.34 m', countryUse: 'US, UK' },
    ],
    weight: [
      { name: 'Kilogram', symbol: 'kg', baseEquiv: '1 kg', countryUse: 'Global (SI)' },
      { name: 'Gram', symbol: 'g', baseEquiv: '0.001 kg', countryUse: 'Global' },
      { name: 'Milligram', symbol: 'mg', baseEquiv: '1e-6 kg', countryUse: 'Pharmacy' },
      { name: 'Metric Tonne', symbol: 't', baseEquiv: '1,000 kg', countryUse: 'Shipping' },
      { name: 'Pound', symbol: 'lb', baseEquiv: '0.4536 kg', countryUse: 'US, UK' },
      { name: 'Ounce', symbol: 'oz', baseEquiv: '0.02835 kg', countryUse: 'US, UK' },
      { name: 'Stone', symbol: 'st', baseEquiv: '6.350 kg', countryUse: 'UK, Ireland' },
    ],
    temperature: [
      { name: 'Kelvin', symbol: 'K', baseEquiv: '0 K = −273.15 °C', countryUse: 'Science' },
      { name: 'Celsius', symbol: '°C', baseEquiv: '0 °C = 273.15 K', countryUse: 'Global' },
      { name: 'Fahrenheit', symbol: '°F', baseEquiv: '32 °F = 0 °C', countryUse: 'US, Belize' },
      { name: 'Rankine', symbol: '°R', baseEquiv: '0 °R = 0 K', countryUse: 'Engineering (US)' },
    ],
    currency: [
      { name: 'US Dollar', symbol: 'USD', baseEquiv: 'Base forex', countryUse: 'Global reserve' },
      { name: 'Euro', symbol: 'EUR', baseEquiv: 'Major pair', countryUse: 'Eurozone' },
      { name: 'British Pound', symbol: 'GBP', baseEquiv: 'Major pair', countryUse: 'UK' },
      { name: 'Japanese Yen', symbol: 'JPY', baseEquiv: 'Major pair', countryUse: 'Japan' },
      { name: 'Canadian Dollar', symbol: 'CAD', baseEquiv: 'Commodity pair', countryUse: 'Canada' },
    ],
    volume: [
      { name: 'Litre', symbol: 'L', baseEquiv: '1 L = 1 dm³', countryUse: 'Global' },
      { name: 'Millilitre', symbol: 'mL', baseEquiv: '0.001 L', countryUse: 'Global' },
      { name: 'Gallon (US)', symbol: 'gal', baseEquiv: '3.785 L', countryUse: 'US' },
      { name: 'Gallon (UK)', symbol: 'gal', baseEquiv: '4.546 L', countryUse: 'UK, Ireland' },
      { name: 'Cup (US)', symbol: 'cup', baseEquiv: '240 mL', countryUse: 'US cooking' },
      { name: 'Fluid Ounce (US)', symbol: 'fl oz', baseEquiv: '29.57 mL', countryUse: 'US' },
    ],
    area: [
      { name: 'Square metre', symbol: 'm²', baseEquiv: '1 m²', countryUse: 'Global (SI)' },
      { name: 'Hectare', symbol: 'ha', baseEquiv: '10,000 m²', countryUse: 'Agriculture' },
      { name: 'Square kilometre', symbol: 'km²', baseEquiv: '1,000,000 m²', countryUse: 'Geography' },
      { name: 'Acre', symbol: 'ac', baseEquiv: '4,046.86 m²', countryUse: 'US, UK, India' },
      { name: 'Square foot', symbol: 'ft²', baseEquiv: '0.0929 m²', countryUse: 'US, Canada' },
    ],
    speed: [
      { name: 'Metre per second', symbol: 'm/s', baseEquiv: 'SI unit', countryUse: 'Science, SI' },
      { name: 'Kilometre per hour', symbol: 'km/h', baseEquiv: '0.2778 m/s', countryUse: 'Global road' },
      { name: 'Mile per hour', symbol: 'mph', baseEquiv: '0.4470 m/s', countryUse: 'US, UK road' },
      { name: 'Knot', symbol: 'kn', baseEquiv: '0.5144 m/s', countryUse: 'Aviation, maritime' },
    ],
    time: [
      { name: 'Second', symbol: 's', baseEquiv: 'SI base unit', countryUse: 'Global' },
      { name: 'Minute', symbol: 'min', baseEquiv: '60 s', countryUse: 'Global' },
      { name: 'Hour', symbol: 'h', baseEquiv: '3,600 s', countryUse: 'Global' },
      { name: 'Day', symbol: 'd', baseEquiv: '86,400 s', countryUse: 'Global' },
      { name: 'Year', symbol: 'yr', baseEquiv: '~31,536,000 s', countryUse: 'Global' },
    ],
    digital: [
      { name: 'Bit', symbol: 'b', baseEquiv: '0 or 1', countryUse: 'Computing base' },
      { name: 'Byte', symbol: 'B', baseEquiv: '8 bits', countryUse: 'Storage' },
      { name: 'Kilobyte', symbol: 'KB', baseEquiv: '1,000 B', countryUse: 'Files' },
      { name: 'Megabyte', symbol: 'MB', baseEquiv: '1,000 KB', countryUse: 'Photos, docs' },
      { name: 'Gigabyte', symbol: 'GB', baseEquiv: '1,000 MB', countryUse: 'Video, apps' },
      { name: 'Terabyte', symbol: 'TB', baseEquiv: '1,000 GB', countryUse: 'Hard drives' },
    ],
    pressure: [
      { name: 'Pascal', symbol: 'Pa', baseEquiv: '1 N/m²', countryUse: 'SI' },
      { name: 'Bar', symbol: 'bar', baseEquiv: '100,000 Pa', countryUse: 'Europe, diving' },
      { name: 'PSI', symbol: 'psi', baseEquiv: '6,894.76 Pa', countryUse: 'US, automotive' },
      { name: 'Atmosphere', symbol: 'atm', baseEquiv: '101,325 Pa', countryUse: 'Chemistry' },
      { name: 'Torr', symbol: 'Torr', baseEquiv: '133.322 Pa', countryUse: 'Vacuum science' },
    ],
    energy: [
      { name: 'Joule', symbol: 'J', baseEquiv: 'SI unit', countryUse: 'Science, SI' },
      { name: 'Kilojoule', symbol: 'kJ', baseEquiv: '1,000 J', countryUse: 'Food labels (AU, EU)' },
      { name: 'Calorie', symbol: 'cal', baseEquiv: '4.184 J', countryUse: 'Chemistry' },
      { name: 'Kilocalorie', symbol: 'kcal', baseEquiv: '4,184 J', countryUse: 'Nutrition' },
      { name: 'Kilowatt-hour', symbol: 'kWh', baseEquiv: '3.6 MJ', countryUse: 'Electricity bills' },
      { name: 'BTU', symbol: 'BTU', baseEquiv: '1,055 J', countryUse: 'HVAC (US)' },
    ],
    cooking: [
      { name: 'Gram', symbol: 'g', baseEquiv: 'Weight base', countryUse: 'Global baking' },
      { name: 'Ounce (weight)', symbol: 'oz', baseEquiv: '28.35 g', countryUse: 'US, UK' },
      { name: 'Cup (US)', symbol: 'cup', baseEquiv: '240 mL', countryUse: 'US recipes' },
      { name: 'Tablespoon (US)', symbol: 'tbsp', baseEquiv: '15 mL', countryUse: 'US, UK' },
      { name: 'Teaspoon (US)', symbol: 'tsp', baseEquiv: '5 mL', countryUse: 'US, UK' },
      { name: 'Fluid ounce', symbol: 'fl oz', baseEquiv: '29.57 mL', countryUse: 'US liquids' },
    ],
    fuel: [
      { name: 'Miles per gallon (US)', symbol: 'mpg', baseEquiv: '235.2 / L/100km', countryUse: 'US vehicles' },
      { name: 'Miles per gallon (UK)', symbol: 'mpg', baseEquiv: '282.5 / L/100km', countryUse: 'UK vehicles' },
      { name: 'Litres per 100 km', symbol: 'L/100km', baseEquiv: 'Base metric', countryUse: 'EU, AU, CA' },
      { name: 'Kilometres per litre', symbol: 'km/L', baseEquiv: '100 / L/100km', countryUse: 'Japan, India' },
    ],
  };
  return map[catId] || [];
}

function getQuickRef(catId: string): { from: string; to: string; factor: string }[] {
  const map: Record<string, { from: string; to: string; factor: string }[]> = {
    length: [
      { from: '1 mile', to: 'kilometres', factor: '1.609 km' },
      { from: '1 foot', to: 'metres', factor: '0.305 m' },
      { from: '1 inch', to: 'centimetres', factor: '2.54 cm' },
      { from: '1 yard', to: 'metres', factor: '0.914 m' },
    ],
    weight: [
      { from: '1 lb', to: 'kg', factor: '0.454 kg' },
      { from: '1 oz', to: 'grams', factor: '28.35 g' },
      { from: '1 stone', to: 'kg', factor: '6.35 kg' },
      { from: '1 tonne', to: 'lb', factor: '2,205 lb' },
    ],
    temperature: [
      { from: '0 °C', to: 'Fahrenheit', factor: '32 °F' },
      { from: '100 °C', to: 'Fahrenheit', factor: '212 °F' },
      { from: '20 °C', to: 'Fahrenheit', factor: '68 °F' },
      { from: '37 °C', to: 'Fahrenheit', factor: '98.6 °F' },
    ],
    currency: [
      { from: '1 USD', to: 'EUR', factor: '~0.92 EUR' },
      { from: '1 USD', to: 'GBP', factor: '~0.79 GBP' },
      { from: '1 USD', to: 'CAD', factor: '~1.35 CAD' },
      { from: '1 EUR', to: 'USD', factor: '~1.09 USD' },
    ],
    volume: [
      { from: '1 gallon (US)', to: 'litres', factor: '3.785 L' },
      { from: '1 cup (US)', to: 'millilitres', factor: '240 mL' },
      { from: '1 tbsp (US)', to: 'millilitres', factor: '15 mL' },
      { from: '1 litre', to: 'gallons (US)', factor: '0.264 gal' },
    ],
    area: [
      { from: '1 acre', to: 'hectares', factor: '0.405 ha' },
      { from: '1 hectare', to: 'acres', factor: '2.471 ac' },
      { from: '1 m²', to: 'ft²', factor: '10.76 ft²' },
      { from: '1 km²', to: 'acres', factor: '247.1 ac' },
    ],
    speed: [
      { from: '60 mph', to: 'km/h', factor: '96.6 km/h' },
      { from: '100 km/h', to: 'mph', factor: '62.1 mph' },
      { from: '1 knot', to: 'km/h', factor: '1.852 km/h' },
      { from: '343 m/s', to: 'km/h', factor: '1,235 km/h' },
    ],
    time: [
      { from: '1 hour', to: 'seconds', factor: '3,600 s' },
      { from: '1 day', to: 'hours', factor: '24 h' },
      { from: '1 week', to: 'seconds', factor: '604,800 s' },
      { from: '1 year', to: 'days', factor: '365.25 d' },
    ],
    digital: [
      { from: '1 GB', to: 'MB', factor: '1,000 MB' },
      { from: '1 TB', to: 'GB', factor: '1,000 GB' },
      { from: '1 MB/s', to: 'Mb/s', factor: '8 Mb/s' },
      { from: '1 GiB', to: 'GB', factor: '1.074 GB' },
    ],
    pressure: [
      { from: '1 bar', to: 'PSI', factor: '14.5 psi' },
      { from: '1 atm', to: 'kPa', factor: '101.3 kPa' },
      { from: '1 psi', to: 'bar', factor: '0.069 bar' },
      { from: '1 Torr', to: 'Pa', factor: '133.3 Pa' },
    ],
    energy: [
      { from: '1 kcal', to: 'kJ', factor: '4.184 kJ' },
      { from: '1 kWh', to: 'MJ', factor: '3.6 MJ' },
      { from: '1 BTU', to: 'J', factor: '1,055 J' },
      { from: '1 cal', to: 'J', factor: '4.184 J' },
    ],
    cooking: [
      { from: '1 cup flour', to: 'grams', factor: '~125 g' },
      { from: '1 tbsp butter', to: 'grams', factor: '~14 g' },
      { from: '1 oz (weight)', to: 'grams', factor: '28.35 g' },
      { from: '1 cup (US)', to: 'mL', factor: '240 mL' },
    ],
    fuel: [
      { from: '25 US mpg', to: 'L/100km', factor: '9.4 L/100km' },
      { from: '7 L/100km', to: 'US mpg', factor: '33.6 mpg' },
      { from: '50 UK mpg', to: 'L/100km', factor: '5.6 L/100km' },
      { from: '10 km/L', to: 'L/100km', factor: '10 L/100km' },
    ],
  };
  return map[catId] || [];
}

function getCategoryFAQs(catId: string): { question: string; answer: string }[] {
  const map: Record<string, { question: string; answer: string }[]> = {
    length: [
      { question: 'What is the most common unit of length?', answer: 'The metre (m) is the SI base unit used by 95 % of the world. The foot (ft) and inch (in) dominate in the United States.' },
      { question: 'How do I convert miles to kilometres in my head?', answer: 'Multiply miles by 1.6 for a quick estimate. 5 miles ≈ 8 km. For more precision, use 1.60934.' },
      { question: 'Why are US and UK inches the same but gallons different?', answer: 'The inch was unified by international treaty in 1959. The gallon diverged historically: the US kept the wine gallon (231 in³), while the UK adopted the imperial gallon (277.4 in³) in 1824.' },
      { question: 'What is a nautical mile?', answer: `A nautical mile is 1,852 metres, based on one minute of latitude. It is used in aviation and maritime navigation because it aligns with Earth's geometry.` },
    ],
    weight: [
      { question: 'What is the difference between mass and weight?', answer: 'Mass is the amount of matter (kilograms). Weight is the force of gravity on that mass (newtons). On Earth they are proportional and often used interchangeably in everyday language.' },
      { question: 'How many grams in a pound?', answer: '1 pound = 453.59237 grams exactly (by international agreement since 1959).' },
      { question: 'Why do doctors use kilograms but gyms use pounds?', answer: 'Medical standards follow the SI system (kilograms). US fitness culture historically adopted pounds. Most modern gyms display both.' },
    ],
    temperature: [
      { question: 'What is absolute zero?', answer: 'Absolute zero is 0 K, −273.15 °C, or −459.67 °F. It is the theoretical lowest temperature where all molecular motion ceases.' },
      { question: 'Why does the US still use Fahrenheit?', answer: 'Historical inertia. The Fahrenheit scale was entrenched before the metric system became global. The US actually adopted the metric system legally in 1866 but never enforced it in daily life.' },
      { question: 'Is 0 °C the same as 0 °F?', answer: 'No. 0 °C = 32 °F (freezing point of water). 0 °F is much colder: approximately −18 °C.' },
    ],
    currency: [
      { question: 'How often do currency exchange rates change?', answer: 'Exchange rates move every second during market hours (Monday–Friday). Our converter updates hourly, providing rates accurate to within a few minutes.' },
      { question: 'What is the strongest currency in the world?', answer: 'The Kuwaiti dinar (KWD) has the highest value per unit, but "strength" is complex. The US dollar is the most traded reserve currency globally.' },
    ],
    volume: [
      { question: 'Why are US and UK fluid ounces different?', answer: 'The US fluid ounce is 29.57 mL; the UK fluid ounce was historically 28.41 mL. This difference comes from the separate gallon definitions.' },
      { question: 'How many cups in a litre?', answer: 'Approximately 4.23 US cups (240 mL each) per litre, or exactly 4 metric cups (250 mL each).' },
    ],
    area: [
      { question: 'How many square feet in an acre?', answer: '43,560 square feet exactly. This odd number originates from the original definition of an acre as a strip of land one furlong by one chain.' },
      { question: 'Which is bigger: a hectare or an acre?', answer: 'A hectare is roughly 2.47 acres, so it is significantly larger. One hectare equals 10,000 square metres.' },
    ],
    speed: [
      { question: 'What is the speed of sound?', answer: 'Approximately 343 m/s (1,235 km/h or 767 mph) at sea level at 20 °C. It varies with temperature and altitude.' },
      { question: 'What is a Mach number?', answer: 'Mach 1 equals the local speed of sound. Mach 2 is twice the speed of sound. Used in aviation and aerodynamics.' },
    ],
    time: [
      { question: 'Why are there 60 seconds in a minute?', answer: 'The Babylonians used a base-60 (sexagesimal) number system around 3,000 years ago. It is highly divisible, making fractions easy.' },
      { question: 'How many milliseconds in a day?', answer: '86,400,000 milliseconds (86.4 million).' },
    ],
    digital: [
      { question: 'Is a megabyte 1,000 or 1,024 kilobytes?', answer: 'Both exist. Hard-drive makers use decimal: 1 MB = 1,000 KB. Operating systems use binary: 1 MiB = 1,024 KiB. The binary prefix (MiB) was standardised in 1998 to reduce confusion.' },
      { question: 'Why does my 500 GB hard drive show 465 GB?', answer: 'The manufacturer labels 500 decimal GB (500 × 10⁹ bytes). Windows displays binary GiB (500 × 10⁹ ÷ 1,024³ ≈ 465 GiB).' },
    ],
    pressure: [
      { question: 'What is normal atmospheric pressure?', answer: 'Standard atmospheric pressure is 1 atm = 101,325 Pa = 1,013.25 hPa = 1.01325 bar = 14.696 psi.' },
      { question: 'How much PSI should tyres have?', answer: 'Passenger cars typically need 30–35 psi. Check your door-jamb placard for the exact recommendation.' },
    ],
    energy: [
      { question: 'How many kilojoules in a calorie?', answer: '1 kilocalorie (food Calorie, kcal) = 4.184 kJ. On Australian and European food labels, energy is always given in kJ, sometimes with kcal in parentheses.' },
      { question: 'What is a kilowatt-hour?', answer: 'A kilowatt-hour is the energy consumed by running a 1,000-watt appliance for one hour. It equals 3.6 MJ and is the standard unit on electricity bills.' },
    ],
    cooking: [
      { question: 'Why do bakers prefer grams over cups?', answer: 'Weight (grams) is exact. Volume (cups) depends on how the ingredient is packed, sifted, or scooped. A cup of flour can vary by 30 g — enough to ruin a recipe.' },
      { question: 'What is the difference between US and UK tablespoons?', answer: 'A US tablespoon is 15 mL. An Australian tablespoon is 20 mL. A UK tablespoon is generally 15 mL but can vary by manufacturer.' },
    ],
    fuel: [
      { question: 'What is better: higher mpg or lower L/100 km?', answer: 'Higher mpg means better efficiency. Lower L/100 km means better efficiency. They are inverses. 25 US mpg ≈ 9.4 L/100 km (good). 50 US mpg ≈ 4.7 L/100 km (excellent).' },
      { question: 'Why do US and UK mpg figures differ for the same car?', answer: 'US and UK gallons are different sizes (3.785 L vs 4.546 L). A car gets a higher mpg number in the UK because the gallon is larger, meaning fewer gallons are used per mile.' },
    ],
  };
  return map[catId] || [
    { question: `What is the base unit for ${catId}?`, answer: 'See the units table above for the SI base unit and common alternatives.' },
    { question: `Why convert ${catId} units?`, answer: 'Different countries, industries, and fields use different units. Conversion ensures accurate communication and prevents costly errors.' },
  ];
}

function getCrossLinks(catId: string) {
  const all = [
    { name: 'Length', slug: 'length', text: 'Convert metres, miles, inches, and feet', },
    { name: 'Weight', slug: 'weight', text: 'Convert kilograms, pounds, ounces, and grams', },
    { name: 'Temperature', slug: 'temperature', text: 'Convert Celsius, Fahrenheit, and Kelvin', },
    { name: 'Currency', slug: 'currency', text: 'Live exchange rates for 100+ currencies', },
    { name: 'Volume', slug: 'volume', text: 'Convert litres, gallons, cups, and fluid ounces', },
    { name: 'Area', slug: 'area', text: 'Convert square metres, acres, and hectares', },
    { name: 'Speed', slug: 'speed', text: 'Convert km/h, mph, knots, and m/s', },
    { name: 'Time', slug: 'time', text: 'Convert seconds, minutes, hours, and days', },
    { name: 'Digital Storage', slug: 'digital', text: 'Convert bytes, KB, MB, GB, and TB', },
    { name: 'Pressure', slug: 'pressure', text: 'Convert psi, bar, pascal, and atm', },
    { name: 'Energy', slug: 'energy', text: 'Convert joules, calories, kWh, and BTU', },
    { name: 'Cooking', slug: 'cooking', text: 'Convert cups, spoons, grams, and ounces in recipes', },
    { name: 'Fuel Economy', slug: 'fuel', text: 'Convert MPG and L/100km for vehicle efficiency', },
  ];
  return all.filter(c => c.slug !== catId);
}

export function generateCategoryHubContent(category: ConverterCategory): CategoryHubContent {
  const catId = category.id;
  const heroTitle = `${category.name} Converter — Free, Fast & Accurate`;
  const heroDescription = `Convert ${category.name.toLowerCase()} units instantly with ConvertNow. ${category.converters.length}+ free conversions, verified formulas, and reference tables. No signup required.`;
  const intro = `Welcome to the ConvertNow ${category.name.toLowerCase()} converter hub. Whether you are a student solving homework, a professional completing a project, or a traveller navigating unfamiliar units, our free ${category.name.toLowerCase()} conversion tools give you instant, accurate results backed by internationally verified constants.`;
  const history = getCategoryHistory(catId);
  const whyItMatters = getWhyItMatters(catId);
  const whoUsesIt = getWhoUsesIt(catId);
  const commonConfusions = getCommonConfusions(catId);
  const unitsTable = getUnitTable(catId);
  const quickRef = getQuickRef(catId);
  const faqs = getCategoryFAQs(catId);
  const crossLinks = getCrossLinks(catId);

  const wordCount = [
    heroTitle, heroDescription, intro, history, whyItMatters, whoUsesIt, commonConfusions,
    ...unitsTable.map(u => u.name + u.symbol + u.baseEquiv + u.countryUse),
    ...quickRef.map(q => q.from + q.to + q.factor),
    ...faqs.map(f => f.question + f.answer),
  ].join(' ').split(/\s+/).length;

  return {
    heroTitle,
    heroDescription,
    intro,
    history,
    whyItMatters,
    whoUsesIt,
    commonConfusions,
    unitsTableHeader: `${category.name} Units Reference Table`,
    unitsTable,
    quickRefHeader: `Quick ${category.name} Conversion Reference`,
    quickRef,
    faqs,
    crossLinks,
    wordCount,
  };
}
