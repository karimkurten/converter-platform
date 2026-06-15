'use client'

import Link from 'next/link'

export const categories = [
  { slug: 'length', label: 'Length', desc: 'Convert meters, kilometers, miles, inches, feet, yards, and more.', examples: ['meter-to-foot', 'kilometer-to-mile'] },
  { slug: 'weight', label: 'Weight', desc: 'Convert kilograms, pounds, ounces, grams, stones, and more.', examples: ['kilogram-to-pound', 'gram-to-ounce'] },
  { slug: 'temperature', label: 'Temperature', desc: 'Convert Celsius, Fahrenheit, Kelvin, and Rankine instantly.', examples: ['celsius-to-fahrenheit', 'fahrenheit-to-celsius'] },
  { slug: 'currency', label: 'Currency', desc: 'Live exchange rates for USD, EUR, GBP, JPY, CAD, and 100+ currencies.', examples: [] },
  { slug: 'volume', label: 'Volume', desc: 'Convert liters, gallons, cups, tablespoons, milliliters, and more.', examples: ['liter-to-gallon', 'cup-to-milliliter'] },
  { slug: 'area', label: 'Area', desc: 'Convert square meters, square feet, acres, hectares, and more.', examples: ['square-meter-to-square-foot'] },
  { slug: 'speed', label: 'Speed', desc: 'Convert km/h, mph, knots, meters per second, and more.', examples: ['kilometer-per-hour-to-mile-per-hour'] },
  { slug: 'time', label: 'Time', desc: 'Convert seconds, minutes, hours, days, weeks, months, years.', examples: [] },
  { slug: 'digital', label: 'Digital Storage', desc: 'Convert bytes, KB, MB, GB, TB, PB for files and storage.', examples: [] },
  { slug: 'pressure', label: 'Pressure', desc: 'Convert PSI, bar, pascal, atmospheres, torr, and more.', examples: [] },
  { slug: 'energy', label: 'Energy', desc: 'Convert joules, calories, kilowatt-hours, BTU, and more.', examples: [] },
  { slug: 'fuel', label: 'Fuel Economy', desc: 'Convert MPG, L/100km, km/L for vehicle efficiency.', examples: [] },
  { slug: 'cooking', label: 'Cooking', desc: 'Convert cooking measurements: cups, spoons, grams, ounces.', examples: [] },
]

export default function SEOContent() {
  return (
    <div className="max-w-3xl space-y-12">
      {/* ─── H2 1: Voice search optimized ─────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          What Is a Unit Converter and How Do You Use One?
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-3 text-gray-600 dark:text-gray-400">
          <p>
            A unit converter is an online tool that instantly transforms values from one measurement system to another.
            ConvertNow is a <strong>free, fast, and accurate online unit converter</strong> supporting 500+ unit conversions
            across 13 categories. Whether you need to convert{' '}
            <Link href="/length/kilometer-to-mile" className="text-brand-500 hover:underline underline-offset-2">kilometers to miles</Link>,{' '}
            <Link href="/weight/kilogram-to-pound" className="text-brand-500 hover:underline underline-offset-2">kilograms to pounds</Link>, or{' '}
            <Link href="/temperature/celsius-to-fahrenheit" className="text-brand-500 hover:underline underline-offset-2">Celsius to Fahrenheit</Link>,
            you get instant results with the exact formula displayed.
          </p>
          <p>
            Our <Link href="/currency" className="text-brand-500 hover:underline underline-offset-2">currency converter</Link> uses
            live exchange rates, while all other converters use precise scientific constants for maximum accuracy.
            Every tool includes bidirectional conversion, a swap button, and a reference table.
          </p>
        </div>
      </section>

      {/* ─── H2 2: All categories with internal links ────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          13 Free Conversion Categories — All in One Place
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          ConvertNow covers every type of unit conversion you need. Click any category below to start converting.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-brand-50 dark:hover:bg-brand-950/20 transition-colors"
            >
              <span className="text-xl flex-shrink-0 mt-0.5">📐</span>
              <div>
                <span className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">
                  {cat.label}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── H2 3: Why ConvertNow? (E-E-A-T signal) ────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Why Is ConvertNow.ca the Best Free Unit Converter?
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-3 text-gray-600 dark:text-gray-400">
          <p>
            Unlike other converters that bombard you with ads, force signups, or display inaccurate results,
            ConvertNow is built on a simple promise: <strong>free, fast, and accurate conversions with zero friction</strong>.
          </p>
          <ul className="list-none space-y-2 pl-0">
            {[
              '✅ No signup or account required — ever',
              '✅ No intrusive ads blocking the interface',
              '✅ 500+ conversions across 13 categories',
              '✅ Live currency rates updated hourly',
              '✅ Works offline as a Progressive Web App (PWA)',
              '✅ Clean, mobile-first design for on-the-go use',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex-shrink-0 text-green-500">{item.split(' ')[0]}</span>
                <span>{item.replace(/^✅\s*/, '')}</span>
              </li>
            ))}
          </ul>
          <p>
            Built by a team passionate about measurement accuracy and user experience, ConvertNow serves
            students, engineers, travelers, home cooks, fitness enthusiasts, and professionals worldwide.
          </p>
        </div>
      </section>

      {/* ─── H2 4: Voice search / AI optimized ──────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How Do You Convert Units Without an App?
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-3 text-gray-600 dark:text-gray-400">
          <p>
            You do not need to download anything. Simply open <Link href="/" className="text-brand-500 hover:underline underline-offset-2">ConvertNow.ca</Link>{' '}
            in your browser, select your category, and type your value. The result appears instantly — no loading screens,
            no captchas, no popups.
          </p>
          <p>
            Our <Link href="/shop" className="text-brand-500 hover:underline underline-offset-2">shop</Link> also recommends
            physical measurement tools matched to the conversions you perform most, so you can convert digitally and verify with hardware.
          </p>
        </div>
      </section>

      {/* ─── H2 5: Niche / long-tail ───────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          What Is the Best Unit Converter for Baking, Travel, and Engineering?
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-3 text-gray-600 dark:text-gray-400">
          <p>
            ConvertNow is designed for real-world use across every niche:
          </p>
          <ul className="list-none space-y-2 pl-0">
            <li className="flex items-start gap-2">
              <span className="text-brand-500 flex-shrink-0">🧑‍🍳</span>
              <span>
                <strong>Bakers</strong> use our <Link href="/cooking" className="text-brand-500 hover:underline underline-offset-2">cooking converter</Link> for cups to grams,
                tablespoons to milliliters, and oven temperature conversions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-500 flex-shrink-0">✈️</span>
              <span>
                <strong>Travelers</strong> rely on <Link href="/currency" className="text-brand-500 hover:underline underline-offset-2">live currency rates</Link>,{' '}
                <Link href="/length" className="text-brand-500 hover:underline underline-offset-2">distance converters</Link>, and{' '}
                <Link href="/temperature" className="text-brand-500 hover:underline underline-offset-2">temperature conversions</Link>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-500 flex-shrink-0">🔧</span>
              <span>
                <strong>Engineers</strong> trust precise <Link href="/pressure" className="text-brand-500 hover:underline underline-offset-2">pressure</Link>,{' '}
                <Link href="/energy" className="text-brand-500 hover:underline underline-offset-2">energy</Link>, and{' '}
                <Link href="/speed" className="text-brand-500 hover:underline underline-offset-2">speed</Link> conversions with scientific constants.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-500 flex-shrink-0">🏋️</span>
              <span>
                <strong>Fitness enthusiasts</strong> track <Link href="/weight" className="text-brand-500 hover:underline underline-offset-2">weight</Link>{' '}
                and <Link href="/volume" className="text-brand-500 hover:underline underline-offset-2">volume</Link> conversions for nutrition and workouts.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* ─── H2 6: Technical / trust ───────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Is ConvertNow.ca Safe? Privacy and Accuracy Explained
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-3 text-gray-600 dark:text-gray-400">
          <p>
            Yes. ConvertNow is completely safe to use. We do not collect personal data, require accounts, or store
            your conversion history. All calculations happen in your browser — no data is sent to our servers.
          </p>
          <p>
            Our conversion formulas are based on internationally recognized scientific standards (SI units, NIST
            definitions, ISO standards) and are verified against multiple reference sources. The{' '}
            <Link href="/currency" className="text-brand-500 hover:underline underline-offset-2">currency converter</Link>{' '}
            updates every 60 minutes using live market data.
          </p>
        </div>
      </section>
    </div>
  )
}
