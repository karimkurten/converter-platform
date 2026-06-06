const AFFILIATE_TAGS = {
  CA: 'convertnow-20',
  US: 'convertnow-20',
  GB: 'convertnow-20',
  AU: 'convertnow-20',
  DEFAULT: 'convertnow-20',
};

const AMAZON_DOMAINS = {
  CA: 'https://www.amazon.ca',
  US: 'https://www.amazon.com',
  GB: 'https://www.amazon.co.uk',
  AU: 'https://www.amazon.com.au',
  DEFAULT: 'https://www.amazon.ca',
};

export async function getAmazonUrl(productKeyword: string): Promise<string> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    const country = data.country_code || 'DEFAULT';
    const domain = AMAZON_DOMAINS[country as keyof typeof AMAZON_DOMAINS] || AMAZON_DOMAINS.DEFAULT;
    const tag = AFFILIATE_TAGS[country as keyof typeof AFFILIATE_TAGS] || AFFILIATE_TAGS.DEFAULT;
    const encoded = encodeURIComponent(productKeyword);
    return `${domain}/s?k=${encoded}&tag=${tag}`;
  } catch {
    // Fallback to Amazon Canada if geolocation fails
    const encoded = encodeURIComponent(productKeyword);
    return `${AMAZON_DOMAINS.DEFAULT}/s?k=${encoded}&tag=${AFFILIATE_TAGS.DEFAULT}`;
  }
}
