import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CircleHelp,
  Database,
  FileSearch,
  Mail,
  MapPin,
  MessageCircle,
  Network,
  Phone,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import FundingEstimator from '../components/FundingEstimator';
import { ContactForm } from '../components/LeadForms';
import Reveal from '../components/Reveal';
import TermSheetSandbox from '../components/TermSheetSandbox';
import { faqs, products, siteConfig } from '../content/site';

function PageHero({ eyebrow, title, body, children }: { eyebrow: string; title: string; body: string; children?: React.ReactNode }) {
  return (
    <section className="page-hero">
      <div className="page-hero__glow" />
      <div className="page-hero__content">
        <span className="section-kicker">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{body}</p>
        {children}
      </div>
    </section>
  );
}

function ProductIndexRow({ product, index }: { product: (typeof products)[number]; index: number }) {
  return (
    <Link className="catalog-row" to={`/products/${product.slug}`}>
      <span>0{index + 1}</span>
      <div><strong>{product.name}</strong><p>{product.summary}</p></div>
      <div><strong>{product.amount}</strong><small>{product.tenure}</small></div>
      <ArrowRight size={21} aria-hidden="true" />
    </Link>
  );
}

export function ProductsPage() {
  return (
    <>
      <PageHero eyebrow="Debt solutions" title="One capital stack. Seven ways to fund the next move." body="Choose a use case, not just a loan label. Every amount and tenure below is indicative and subject to lender assessment and approval.">
        <div className="button-row"><Link className="button button--lime" to="/contact">Get matched <ArrowRight size={18} /></Link><Link className="button button--ghost" to="/funding-estimator">Estimate capacity</Link></div>
      </PageHero>
      {(['Swift', 'Scale'] as const).map((family) => (
        <section key={family} id={family.toLowerCase()} className="catalog section-shell">
          <div className="catalog__intro">
            <span className="section-kicker">{family}</span>
            <h2>{family === 'Swift' ? 'Fast facilities for operating momentum.' : 'Institutional debt for decisive scale.'}</h2>
            <p>{family === 'Swift' ? 'Designed around recurring revenue and short cash-conversion cycles.' : 'Structured for larger tickets, longer tenures and more complex capital plans.'}</p>
          </div>
          <div className="catalog__list">
            {products.filter((item) => item.family === family).map((product, index) => <ProductIndexRow key={product.slug} product={product} index={index} />)}
          </div>
        </section>
      ))}
      <section className="inline-cta section-shell">
        <div><span className="section-kicker">Not sure where to start?</span><h2>Let the use of funds lead.</h2><p>Share your revenue, timeline and objective. We’ll help narrow the structure.</p></div>
        <Link className="button button--dark" to="/contact">Request an assessment <ArrowRight size={18} /></Link>
      </section>
    </>
  );
}

export function ProductPage() {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug);
  if (!product) return <NotFoundPage />;

  return (
    <>
      <section className="product-hero">
        <div className="product-hero__top section-shell">
          <Link className="back-link" to="/products"><ArrowLeft size={16} /> All products</Link>
          <span className={`family-tag family-tag--${product.family.toLowerCase()}`}>{product.family} facility</span>
        </div>
        <div className="product-hero__main section-shell">
          <div>
            <p className="eyebrow">{product.eyebrow}</p>
            <h1>{product.hero}</h1>
            <p>{product.summary}</p>
            <div className="button-row"><Link className="button button--lime" to={`/contact?product=${product.slug}`}>Apply for {product.shortName} <ArrowRight size={18} /></Link><Link className="button button--ghost" to="/funding-estimator">Estimate capacity</Link></div>
          </div>
          <div className="product-hero__terms">
            <span><small>Indicative amount</small><strong>{product.amount}</strong></span>
            <span><small>Indicative tenure</small><strong>{product.tenure}</strong></span>
            <span><small>Repayment approach</small><strong>{product.repayment}</strong></span>
            <p>All terms are indicative and subject to lender credit assessment, documentation and approval.</p>
          </div>
        </div>
      </section>

      <section className="product-detail section-shell">
        <div className="product-detail__lead">
          <span className="section-kicker">Who it’s for</span>
          <h2>A strong fit when the capital has a clear job.</h2>
        </div>
        <div className="three-list">
          {product.fit.map((item, index) => <Reveal key={item} delay={index * 70}><span>0{index + 1}</span><p>{item}</p></Reveal>)}
        </div>
      </section>

      <section className="benefits-section">
        <div className="section-shell benefits-section__grid">
          <div><span className="section-kicker">Key benefits</span><h2>Built to protect momentum.</h2><p>The right debt should solve a timing or capacity problem without creating a larger strategic one.</p></div>
          <ul>{product.benefits.map((item) => <li key={item}><Check size={18} />{item}</li>)}</ul>
        </div>
      </section>

      <section className="workflow section-shell">
        <div className="section-heading section-heading--row"><div><span className="section-kicker">How it works</span><h2>Four stages. One accountable process.</h2></div><p>Timelines vary by data readiness, structure, security and lender diligence.</p></div>
        <div className="workflow__steps">
          {product.process.map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong>{index < product.process.length - 1 && <ChevronRight aria-hidden="true" />}</div>)}
        </div>
      </section>

      <section className="eligibility section-shell">
        <div className="eligibility__list"><span className="section-kicker">Indicative eligibility</span>{product.eligibility.map((item) => <p key={item}><BadgeCheck size={19} />{item}</p>)}</div>
        <div className="eligibility__cta"><h2>Test the fit with real numbers.</h2><p>No generic checklist can replace lender-specific underwriting. Start with a directional assessment.</p><Link className="button button--primary" to={`/contact?product=${product.slug}`}>Apply now <ArrowRight size={18} /></Link></div>
      </section>

      <section className="product-next section-shell">
        <span>Explore another solution</span>
        {products.filter((item) => item.slug !== product.slug).slice(0, 3).map((item) => <Link key={item.slug} to={`/products/${item.slug}`}>{item.shortName}<ArrowRight size={16} /></Link>)}
      </section>
    </>
  );
}

export function FundingEstimatorPage() {
  return (
    <>
      <PageHero eyebrow="Interactive estimator" title="Start with capacity, then design the facility." body="Use revenue as a first-pass signal. The estimate is deliberately broad and never substitutes for verified underwriting." />
      <div className="page-band page-band--ivory"><FundingEstimator standalone /></div>
      <section className="method-note section-shell">
        <span className="section-kicker">How to read the result</span>
        <div><h2>Directional, not deterministic.</h2><p>The model applies a broad illustrative advance rate to annualised revenue and caps the output at the highest indicative product limit. Real lender capacity also depends on profitability, cash flow, leverage, security, concentration, ageing, credit history and documentation.</p></div>
      </section>
    </>
  );
}

export function TechnologyPage() {
  return (
    <>
      <PageHero eyebrow="Technology" title="A cleaner credit decision starts with cleaner context." body="The CredNest platform is designed to unify business data, organise lender-grade analysis and keep every stakeholder aligned—while preserving human credit judgment.">
        <Link className="button button--lime" to="/contact">Request a walkthrough <ArrowRight size={18} /></Link>
      </PageHero>
      <section className="tech-flow section-shell">
        {[
          { icon: Database, title: 'Company lookup', body: 'Search and validate core company identifiers, including CIN, PAN and GST, through approved data providers.' },
          { icon: FileSearch, title: 'Unified data room', body: 'Bring banking, accounting, billing, GST, debt schedules and documents into a consistent review layer.' },
          { icon: Sparkles, title: 'AI proposal builder', body: 'Draft ratios, risks, SWOT, cash-flow notes and a Credit Appraisal Memo for human review.' },
          { icon: Network, title: 'Lender matching', body: 'Route a structured opportunity to lenders aligned on ticket, product, sector and risk parameters.' },
        ].map(({ icon: Icon, ...item }, index) => <Reveal key={item.title} delay={index * 80} className="tech-flow__item"><span>0{index + 1}</span><Icon size={27} /><h2>{item.title}</h2><p>{item.body}</p></Reveal>)}
      </section>
      <section className="decision-window">
        <div className="section-shell decision-window__grid">
          <div><span className="section-kicker">Decision intelligence</span><h2>From first triage to a full lender process.</h2><p>Fast initial signals help prioritise the right next step. Formal credit decisions remain with lending partners after diligence.</p></div>
          <div className="decision-window__metrics">
            <span><strong>Minutes</strong><small>Initial data triage</small></span><span><strong>1</strong><small>Shared deal workspace</small></span><span><strong>7</strong><small>Debt structures</small></span>
          </div>
        </div>
      </section>
      <section className="section-shell technology-sandbox"><TermSheetSandbox /></section>
      <section className="backend-note section-shell"><ShieldCheck size={27} /><div><h2>Production readiness note</h2><p>This interface currently simulates underwriting and term generation in the frontend. Before launch, connect verified data providers, role-based access, encryption controls, audit logs, consent management, lender rules and a production CRM endpoint.</p></div></section>
    </>
  );
}

export function CapitalPartnersPage() {
  return (
    <>
      <PageHero eyebrow="Capital partner marketplace" title="See the opportunity. Understand the risk. Decide faster." body="Explore a network model designed to bring lenders consistent information, clearer borrower narratives and opportunities aligned to their mandate.">
        <div className="button-row"><a className="button button--lime" href="#partner-form">Become a capital partner <ArrowRight size={18} /></a><a className="button button--ghost" href="#guidelines">View guidelines</a></div>
      </PageHero>
      <section className="partner-benefits section-shell">
        {[
          [Target, 'Structured deal flow', 'Filter submitted opportunities by sector, ticket, stage, security and use of funds.'],
          [FileSearch, 'CAM-ready workflow', 'Review a consistent draft credit pack built from borrower-provided inputs.'],
          [Scale, 'Better portfolio fit', 'Focus team time on transactions aligned to your risk and return mandate.'],
        ].map(([Icon, title, body], index) => { const BenefitIcon = Icon as typeof Target; return <Reveal key={String(title)} delay={index * 80}><BenefitIcon size={28} /><span>0{index + 1}</span><h2>{String(title)}</h2><p>{String(body)}</p></Reveal>; })}
      </section>
      <section id="guidelines" className="guidelines">
        <div className="section-shell guidelines__grid">
          <div><span className="section-kicker">Partner guidelines</span><h2>A network built on clear mandates.</h2><p>These are draft onboarding guidelines and must be validated before partner launch.</p></div>
          <ol>
            <li><span>01</span><div><strong>Define the mandate</strong><p>Products, sectors, ticket sizes, geography, security and exclusions.</p></div></li>
            <li><span>02</span><div><strong>Align the data pack</strong><p>Required statements, financial periods, bureau checks, KYC and diligence standards.</p></div></li>
            <li><span>03</span><div><strong>Agree response SLAs</strong><p>Indicative interest, credit feedback, term-sheet and documentation expectations.</p></div></li>
            <li><span>04</span><div><strong>Protect borrower data</strong><p>Purpose limitation, consent, access control, retention and audit requirements.</p></div></li>
          </ol>
        </div>
      </section>
      <section id="partner-form" className="contact-block contact-block--partner">
        <div className="contact-block__copy"><span className="section-kicker">Join the network</span><h2>Tell us what you like to fund.</h2><p>Share your mandate and team details. Live contact routing requires the CRM endpoint in environment configuration.</p></div>
        <div className="contact-block__form"><ContactForm source="capital-partner-page" heading="Capital partner enquiry" submitLabel="Submit partner profile" /></div>
      </section>
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Our narrative" title="Democratise debt capital—without trivialising the risk." body="CredNest is building a more navigable market for founders, SMEs and lenders: advisory where judgment matters, technology where friction does not." />
      <section className="mission section-shell">
        <span className="section-kicker">Mission</span>
        <h2>Help strong businesses access the right debt at the right moment—and understand every trade-off before they sign.</h2>
        <div><p>India’s growth businesses often sit between a bank branch process and an institutional credit market. The product may exist, but discovery, preparation and execution remain fragmented.</p><p>CredNest’s role is to close that coordination gap with better data, better framing and a lender network—not to replace independent credit judgment.</p></div>
      </section>
      <section className="inline-cta section-shell">
        <div><span className="section-kicker">Work with us</span><h2>Put the thesis to work on a live capital need.</h2><p>The fastest way to understand CredNest is to bring a real funding question.</p></div>
        <Link className="button button--dark" to="/contact">Start a conversation <ArrowRight size={18} /></Link>
      </section>
    </>
  );
}

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const productSlug = searchParams.get('product');
  const [requestedProduct, setRequestedProduct] = useState<(typeof products)[number] | undefined>();

  useEffect(() => {
    setRequestedProduct(products.find((item) => item.slug === productSlug));
  }, [productSlug]);

  return (
    <>
      <PageHero eyebrow="Get in touch" title="A clearer capital conversation starts here." body={requestedProduct ? `Tell us what ${requestedProduct.name} needs to unlock. We’ll carry this product context into the assessment.` : 'Tell us what you are building, how the business performs and what the funding needs to unlock.'} />
      <section className="contact-page section-shell">
        <div className="contact-page__channels">
          <h2>Capital desk</h2>
          <p>Reach the team directly, or send the form and we’ll come back to you.</p>
          <span><Phone size={20} /><div><small>Phone</small><strong><a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a></strong></div></span>
          <span><MessageCircle size={20} /><div><small>WhatsApp</small><strong><a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">{siteConfig.whatsappDisplay}</a></strong></div></span>
          <span><Mail size={20} /><div><small>Email</small><strong><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></strong></div></span>
          <span><MapPin size={20} /><div><small>Office</small><strong>{siteConfig.office}</strong></div></span>
        </div>
        <ContactForm source="contact-page" heading={requestedProduct ? `Request a ${requestedProduct.shortName} assessment` : 'Request an assessment'} metadata={requestedProduct ? { requestedProduct: requestedProduct.slug } : undefined} />
      </section>
    </>
  );
}

export function FaqPage() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="Understand the structure before you enter the process." body="Straight answers on CredNest’s role, indicative eligibility, timelines, data and dilution." />
      <section className="faq-page section-shell">
        {faqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary><span>0{index + 1}</span>{faq.question}<CircleHelp size={20} /></summary><p>{faq.answer}</p></details>)}
      </section>
      <section className="inline-cta section-shell"><div><h2>Still deciding if debt fits?</h2><p>Take the two-minute compatibility assessment on the homepage or talk through the use case.</p></div><Link className="button button--dark" to="/contact">Talk to CredNest <ArrowRight size={18} /></Link></section>
    </>
  );
}

export function BlogPage() {
  return (
    <>
      <PageHero eyebrow="CredNest field notes" title="Debt insights are being prepared with the same care as a credit memo." body="The former retail-loan articles have been retired. Founder guides, lender perspectives and product explainers will appear here only after editorial and compliance review." />
      <section className="inline-cta section-shell"><div><span className="section-kicker">Editorial placeholder</span><h2>No recycled retail advice. No invented insight.</h2><p>Until the new library is ready, explore the product structures or discuss a live capital use case with the team.</p></div><Link className="button button--dark" to="/products">Explore debt products <ArrowRight size={18} /></Link></section>
    </>
  );
}

export function LoginPage() {
  return (
    <section className="utility-page"><div><img src="/crednest-mark.svg" width="50" height="50" alt="" /><span className="section-kicker">Secure workspace</span><h1>Client login is coming soon.</h1><p>This route is a clearly marked placeholder. Production authentication, roles and secure document access are not wired in this frontend.</p><Link className="button button--dark" to="/">Return home</Link></div></section>
  );
}

export function TermsPage() {
  return (
    <section className="legal-page section-shell"><span className="section-kicker">Terms & disclosures</span><h1>Interim website disclosures</h1><p className="legal-page__notice">Placeholder legal copy—obtain counsel review before production launch.</p><h2>Role of CredNest</h2><p>{siteConfig.disclaimer}</p><h2>Indicative information</h2><p>Calculators, compatibility scores, sample term sheets, product ranges, rates, timelines and eligibility descriptions are illustrative only and do not constitute financial advice, a sanction, an offer or a commitment to lend.</p><h2>Data and privacy</h2><p>The production service should publish a complete privacy policy covering consent, data sources, processing purposes, retention, sharing, security, grievances and user rights before collecting live borrower data.</p><h2>Credentials</h2><p>Legal, trademark, security and regulatory credentials must remain unpublished until CredNest supplies verifiable values.</p></section>
  );
}

export function PrivacyPage() {
  return (
    <section className="legal-page section-shell"><span className="section-kicker">Privacy notice</span><h1>Interim data-handling notice</h1><p className="legal-page__notice">Placeholder policy—obtain privacy counsel review and publish the final data-controller details before enabling live lead collection.</p><h2>Preview behavior</h2><p>When <code>VITE_LEAD_ENDPOINT</code> is blank, form details are not sent to a server by this repository. They are printed to the local browser console solely to demonstrate the integration payload.</p><h2>When a lead endpoint is enabled</h2><p>The form sends the supplied name, company, phone, email, revenue range, funding need, message, source and product context to the configured endpoint. The production policy must identify the data controller, lawful purpose, recipients, retention period, safeguards, grievance contact and applicable user rights.</p><h2>Cookies and analytics</h2><p>This site sets no non-essential cookies unless <code>VITE_GA_ID</code> is configured. When it is, Google Analytics loads only after an explicit opt-in, with IP anonymisation on and advertising personalisation off. Declining is remembered and loads nothing.</p><h2>Financial-data connections</h2><p>Banking, GST, accounting and billing integrations described elsewhere are product concepts only. They must not be enabled without explicit consent, purpose limitation, access controls, retention rules and verified providers.</p><h2>Launch requirement</h2><p>Replace this notice with reviewed legal text and verified contact details before accepting public enquiries.</p></section>
  );
}

export function NotFoundPage() {
  return (
    <section className="utility-page"><div><span className="section-kicker">404</span><h1>This route doesn’t match a CredNest page.</h1><p>The retail site has moved to a B2B debt-capital experience.</p><div className="button-row"><Link className="button button--dark" to="/products">Explore products</Link><Link className="text-link" to="/">Back home <ArrowRight size={17} /></Link></div></div></section>
  );
}
