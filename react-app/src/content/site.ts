export type ProductFamily = 'Swift' | 'Scale';

export type Product = {
  slug: string;
  family: ProductFamily;
  name: string;
  shortName: string;
  eyebrow: string;
  hero: string;
  summary: string;
  amount: string;
  tenure: string;
  fit: string[];
  benefits: string[];
  process: string[];
  eligibility: string[];
  repayment: string;
};

export const siteConfig = {
  name: 'CredNest',
  domain: 'https://crednest.io',
  phoneDisplay: '+91 99870 23845',
  phoneHref: 'tel:+919987023845',
  whatsappDisplay: '+91 99870 23845',
  // Prefilled opener; edit the text after ?text= to change what a visitor sends.
  whatsappHref: 'https://wa.me/919987023845?text=Hi%20CredNest%2C%20I%27d%20like%20to%20discuss%20debt%20financing%20for%20my%20business.',
  email: 'contact@crednest.io',
  // PIN corrected from the supplied "40053" — Andheri West is 400053. Verify.
  office: '711/E, Crystal Plaza, Opposite Infinity Mall, Andheri West, Mumbai 400053, Maharashtra, India',
  leadEndpoint: import.meta.env.VITE_LEAD_ENDPOINT || '',
  leadMode: import.meta.env.VITE_LEAD_MODE || '',
  disclaimer:
    'CredNest is a debt-capital facilitator and does not lend directly. CredNest is not an NBFC. Facility amounts, pricing, timelines and terms shown are indicative only, subject to lender assessment, eligibility, documentation and approval. Terms and conditions apply.',
};

export const products: Product[] = [
  {
    slug: 'recurring-revenue-financing',
    family: 'Swift',
    name: 'Recurring Revenue Financing',
    shortName: 'Recurring Revenue',
    eyebrow: 'Turn predictable revenue into today\'s growth capital',
    hero: 'Bring tomorrow\'s recurring revenue forward.',
    summary:
      'A flexible, non-dilutive facility for subscription and repeat-revenue businesses that need capital without waiting for monthly collections.',
    amount: 'Up to ₹10 Cr',
    tenure: '3–24 months',
    fit: ['SaaS and subscription businesses', 'Repeat-purchase D2C brands', 'Tech-enabled service companies'],
    benefits: ['Revenue-aligned repayments', 'Potential no-personal-guarantee structures', 'Retain business ownership', 'Read-only billing integrations'],
    process: ['Connect billing and banking data', 'Validate recurring revenue quality', 'Compare matched lender terms', 'Receive approved funds'],
    eligibility: ['Predictable monthly revenue', 'At least 12 months of operating history', 'Clean banking and statutory records'],
    repayment: 'Fixed or revenue-linked structures, based on lender terms.',
  },
  {
    slug: 'working-capital-financing',
    family: 'Swift',
    name: 'Working Capital Financing',
    shortName: 'Working Capital',
    eyebrow: 'Bridge the gap between payables and collections',
    hero: 'Keep operations moving while cash catches up.',
    summary:
      'A fast facility for inventory, payroll, supplier payments and recurring operating expenses, informed by live business data.',
    amount: 'Up to ₹10 Cr',
    tenure: '3–24 months',
    fit: ['Inventory-led SMEs', 'D2C and commerce brands', 'Service businesses with receivable cycles'],
    benefits: ['Fast revolving access', 'Accounting-data integration', 'Flexible drawdowns', 'Zero equity dilution'],
    process: ['Share bank and accounting data', 'Map the operating cash cycle', 'Review matched offers', 'Draw capital as needed'],
    eligibility: ['Established operating cash flows', 'Documented invoices or purchase orders', 'GST and banking records available'],
    repayment: 'Revolving or amortising structures, based on use case.',
  },
  {
    slug: 'venture-debt',
    family: 'Scale',
    name: 'Venture Debt',
    shortName: 'Venture Debt',
    eyebrow: 'Extend runway between equity rounds',
    hero: 'Scale the company, not the cap table.',
    summary:
      'Institutional debt for venture-backed companies seeking runway, acquisition or expansion capital without an immediate equity round.',
    amount: '₹2 Cr–₹100 Cr',
    tenure: '24–48 months',
    fit: ['Series A+ startups', 'Institutionally backed founders', 'Companies approaching major milestones'],
    benefits: ['Preserve founder ownership', 'Extend runway', 'Stage drawdowns by milestone', 'Institutional lender access'],
    process: ['Share board-ready financials', 'Build the credit narrative', 'Run a structured lender process', 'Negotiate and close'],
    eligibility: ['Institutional equity backing', 'Clear use of funds', 'Credible path to repayment or next milestone'],
    repayment: 'Custom amortisation and moratorium options, subject to lender approval.',
  },
  {
    slug: 'secured-term-loans',
    family: 'Scale',
    name: 'Secured Term Loans',
    shortName: 'Secured Term Loans',
    eyebrow: 'Long-tenure capital backed by durable value',
    hero: 'Finance the assets behind your next phase.',
    summary:
      'Long-tenure debt backed by eligible assets, cash flows or contracted revenue for expansion and capital expenditure.',
    amount: '₹5 Cr–₹250 Cr',
    tenure: '2–10 years',
    fit: ['Profitable SMEs', 'Asset-owning businesses', 'Companies funding capacity expansion'],
    benefits: ['Longer repayment runway', 'Competitive structured pricing', 'Large ticket capability', 'CAPEX-friendly design'],
    process: ['Map collateral and cash flows', 'Prepare lender-grade documentation', 'Coordinate valuation and diligence', 'Close and disburse'],
    eligibility: ['Eligible collateral or contracts', 'Audited financial history', 'Sustainable debt-service coverage'],
    repayment: 'Structured amortisation matched to asset life and cash flow.',
  },
  {
    slug: 'invoice-financing',
    family: 'Scale',
    name: 'Invoice Financing',
    shortName: 'Invoice Financing',
    eyebrow: 'Release cash trapped in enterprise receivables',
    hero: 'Turn approved invoices into working cash.',
    summary:
      'Short-duration capital against eligible B2B invoices, designed to compress long enterprise payment cycles.',
    amount: 'Up to ₹50 Cr',
    tenure: '30–90 days',
    fit: ['Enterprise vendors', 'Exporters and manufacturers', 'Businesses with strong debtor quality'],
    benefits: ['Target 48-hour post-approval funding', 'Invoice-level flexibility', 'No equity dilution', 'Improve cash conversion'],
    process: ['Upload or sync invoices', 'Verify debtor and acceptance', 'Choose eligible invoices', 'Receive the advance'],
    eligibility: ['Valid B2B invoices', 'Credible buyer counterparties', 'Documented delivery or acceptance'],
    repayment: 'Settled from invoice collections or on the agreed maturity date.',
  },
  {
    slug: 'structured-debt',
    family: 'Scale',
    name: 'Structured Debt',
    shortName: 'Structured Debt',
    eyebrow: 'Bespoke instruments for non-standard growth',
    hero: 'Capital shaped around the business—not the other way around.',
    summary:
      'Custom debt structures for complex models, acquisitions, refinancing, special situations and blended collateral pools.',
    amount: 'Custom facility',
    tenure: 'Custom tenure',
    fit: ['Complex business models', 'Acquisition or refinancing needs', 'Multi-entity or project structures'],
    benefits: ['Bespoke covenants', 'Flexible security design', 'Multi-tranche options', 'Advisory-led execution'],
    process: ['Frame the capital objective', 'Model structure and downside', 'Run targeted lender outreach', 'Negotiate documentation'],
    eligibility: ['Defensible repayment thesis', 'Management information available', 'Clear transaction rationale'],
    repayment: 'Built around the transaction, security pool and projected cash flows.',
  },
  {
    slug: 'lease-financing',
    family: 'Scale',
    name: 'Lease Financing',
    shortName: 'Lease Financing',
    eyebrow: 'Add productive assets without heavy upfront cash',
    hero: 'Put essential equipment to work sooner.',
    summary:
      'Equipment and infrastructure financing that supports asset-light scaling while preserving operating liquidity.',
    amount: '₹1 Cr–₹50 Cr',
    tenure: '1–7 years',
    fit: ['Manufacturing and logistics', 'Healthcare and diagnostics', 'Technology infrastructure operators'],
    benefits: ['Preserve cash reserves', 'Match payments to asset life', 'Fund new or eligible used assets', 'Scalable equipment line'],
    process: ['Share equipment quotations', 'Assess vendor and asset profile', 'Compare lease structures', 'Fund vendor and deploy'],
    eligibility: ['Identifiable productive assets', 'Established vendor quote', 'Cash flow sufficient for lease rentals'],
    repayment: 'Periodic rentals aligned to the asset and operating cycle.',
  },
];

export const faqs = [
  {
    question: 'Does CredNest lend directly?',
    answer:
      'No. CredNest is a debt-capital facilitator, not an NBFC. We help businesses prepare, structure and present credit opportunities to independent lending partners, who make all approval and pricing decisions.',
  },
  {
    question: 'How much capital can a business raise?',
    answer:
      'The site shows an indicative range from lakhs to ₹250 Cr across different products. Actual limits depend on revenue, cash flow, leverage, collateral, use of funds, documentation and lender policy.',
  },
  {
    question: 'Will debt dilute my equity?',
    answer:
      'Standard debt does not transfer ordinary equity ownership. Some institutional structures can include warrants or other enhancements; any such terms would be disclosed in the lender offer.',
  },
  {
    question: 'How fast can funding happen?',
    answer:
      'Simple, well-documented facilities may move from data submission to indicative terms quickly. Complex or secured transactions require diligence, valuation and documentation. All timelines shown are indicative.',
  },
  {
    question: 'What data is needed for an assessment?',
    answer:
      'Typically: company and KYC records, recent bank statements, GST data, audited or management financials, debt schedules, receivable ageing, and evidence supporting the use of funds.',
  },
  {
    question: 'Is connecting financial data safe?',
    answer:
      'The product vision uses permissioned, read-only connections. Production integrations, security controls and certifications must be validated and published before live rollout; the current website demonstrates the intended workflow.',
  },
];

/**
 * Anti-fraud public notice shown once per browsing session.
 *
 * Every line is a statement of fact CredNest is publishing about itself, so each
 * must be true before launch. The two marked "verify" are the ones most likely to
 * change as the business grows — remove them rather than publish them inaccurately.
 */
export const publicNotice = {
  heading: 'Important notice / public alert',
  intro: `${siteConfig.name} is a debt-capital facilitator operating in India.`,
  points: [
    `${siteConfig.name} works on a strict no-advance policy. We never ask for advance fees, deposits, cash, gifts or bribes at any stage of an application.`,
    `${siteConfig.name} acts only as a debt-capital facilitator and loan distributor.`,
    `${siteConfig.name} does not lend directly to customers and does not operate an NBFC.`,
    // verify: remove this line if staff or channel partners are ever issued ID cards.
    `${siteConfig.name} does not issue ID cards to any employee, agent or associate.`,
    `${siteConfig.name} has zero tolerance for bribes, cash or gifts, and assumes no responsibility for such acts.`,
  ],
  warning: `If any person claiming to represent ${siteConfig.name} demands cash, fees, gifts or bribes, you are entitled to file a complaint at your nearest police station. Please also report it to ${siteConfig.email}.`,
  footnote: `This notice is issued purely in the interest of public awareness and to prevent misuse of the ${siteConfig.name} brand name.`,
  acknowledge: 'I understand',
};

export const prerenderRoutes = [
  '/',
  '/products',
  ...products.map((product) => `/products/${product.slug}`),
  '/funding-estimator',
  '/technology',
  '/capital-partners',
  '/about',
  '/contact',
  '/faq',
  '/blog',
  '/login',
  '/admin',
  '/terms',
  '/privacy',
];
