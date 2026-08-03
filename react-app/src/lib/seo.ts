import { faqs, products, siteConfig } from '../content/site';

export type SeoData = {
  title: string;
  description: string;
  canonical: string;
  image: string;
  noindex?: boolean;
  schema: Record<string, unknown>[];
};

const descriptions: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'CredNest — Non-Dilutive Debt Capital for Indian Startups & SMEs',
    description:
      'Advisory-led debt facilities for Indian startups and SMEs—from working capital and revenue financing to venture debt and structured credit.',
  },
  '/products': {
    title: 'Debt Financing Products for Startups & SMEs | CredNest',
    description:
      'Explore recurring revenue financing, working capital, venture debt, secured term loans, invoice financing, structured debt and lease financing.',
  },
  '/funding-estimator': {
    title: 'Business Debt Funding Estimator | CredNest',
    description: 'Estimate an indicative debt facility based on annualised revenue and business profile, then request a free assessment.',
  },
  '/technology': {
    title: 'AI-Assisted Credit Underwriting Platform | CredNest',
    description: 'See how CredNest turns connected financial data into lender-ready analysis, credit appraisal and matched debt options.',
  },
  '/capital-partners': {
    title: 'Capital Partner Network | CredNest',
    description: 'Join CredNest’s lending network for pre-screened Indian startup and SME debt opportunities with structured credit information.',
  },
  '/about': {
    title: 'About CredNest | Debt Capital, Made Navigable',
    description: 'CredNest is building an advisory-led marketplace to make non-dilutive capital easier to understand, structure and access.',
  },
  '/contact': {
    title: 'Contact CredNest | Start a Debt Assessment',
    description: 'Tell us about your business, revenue and funding need to begin an indicative debt-capital assessment.',
  },
  '/faq': {
    title: 'Debt Financing FAQ for Startups & SMEs | CredNest',
    description: 'Answers about eligibility, timelines, dilution, data requirements and CredNest’s role as a debt-capital facilitator.',
  },
  '/blog': {
    title: 'Debt Capital Insights | CredNest',
    description: 'CredNest founder guides, lender perspectives and debt product explainers are being prepared for editorial and compliance review.',
  },
  '/login': {
    title: 'Platform Login | CredNest',
    description: 'CredNest platform access is being prepared for founders and capital partners.',
  },
  '/admin': {
    title: 'Secure Workspace | CredNest',
    description: 'CredNest secure workspace access is not available from the public website.',
  },
  '/terms': {
    title: 'Terms & Important Disclosures | CredNest',
    description: 'Important disclosures for the CredNest debt-capital platform. Final legal terms are pending counsel review.',
  },
  '/privacy': {
    title: 'Interim Privacy Notice | CredNest',
    description: 'Interim data-handling notice for the CredNest website. Final privacy terms are pending counsel review.',
  },
};

const noindexPaths = new Set(['/blog', '/login', '/admin', '/terms', '/privacy']);

export function getSeoData(pathname: string): SeoData {
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  const product = products.find((item) => `/products/${item.slug}` === cleanPath);
  const isKnownPage = Boolean(product || descriptions[cleanPath]);
  const page = product
    ? {
        title: `${product.name} for Indian Businesses | CredNest`,
        description: `${product.summary} Indicative ${product.amount}; ${product.tenure}. Subject to lender approval.`,
      }
    : descriptions[cleanPath] || {
        title: 'Page not found | CredNest',
        description: 'Explore CredNest debt-capital solutions for Indian startups and SMEs.',
      };

  const canonical = isKnownPage ? (cleanPath === '/' ? `${siteConfig.domain}/` : `${siteConfig.domain}${cleanPath}`) : '';
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.domain,
    logo: `${siteConfig.domain}/crednest-mark.svg`,
    description: 'Debt-capital advisory and lender-matching platform for Indian startups and SMEs.',
    areaServed: { '@type': 'Country', name: 'India' },
    email: siteConfig.email,
    telephone: siteConfig.phoneDisplay,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: siteConfig.email,
      telephone: siteConfig.phoneDisplay,
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
  };

  const schema: Record<string, unknown>[] = isKnownPage ? [organizationSchema] : [];
  if (product) {
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.summary,
      brand: { '@type': 'Brand', name: siteConfig.name },
      category: 'Business debt financing',
    });
  }
  if (cleanPath === '/faq') {
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  }

  return {
    ...page,
    canonical,
    image: `${siteConfig.domain}/crednest-founders-hero.jpg`,
    noindex: noindexPaths.has(cleanPath) || !isKnownPage,
    schema,
  };
}
