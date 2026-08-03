import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Blocks,
  Building2,
  Check,
  CircleDollarSign,
  Clock3,
  DatabaseZap,
  FileCheck2,
  Fingerprint,
  Gauge,
  Link2,
  Network,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Unplug,
  WalletCards,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CompatibilityQuiz from '../components/CompatibilityQuiz';
import FundingEstimator from '../components/FundingEstimator';
import { ContactForm } from '../components/LeadForms';
import Reveal from '../components/Reveal';
import TermSheetSandbox from '../components/TermSheetSandbox';
import { products } from '../content/site';

const trustPoints = [
  { icon: ShieldCheck, text: 'No personal guarantee*' },
  { icon: CircleDollarSign, text: 'Zero equity dilution*' },
  { icon: Clock3, text: 'Capital in 48 hours*' },
  { icon: Scale, text: 'Flexible repayments*' },
];

const processSteps = [
  {
    number: '01',
    title: 'Sync your data',
    body: 'Connect banking, GST, accounting and billing sources through permissioned, read-only workflows.',
    detail: 'Stripe · Razorpay · GST · accounting',
    icon: Link2,
  },
  {
    number: '02',
    title: 'Build the credit story',
    body: 'AI-assisted analysis organises the connected data into a lender-ready Credit Appraisal Memo.',
    detail: 'Ratios · cash flow · ageing · SWOT',
    icon: DatabaseZap,
  },
  {
    number: '03',
    title: 'Compare and close',
    body: 'Review matched term sheets with an advisor, complete diligence and move toward disbursement.',
    detail: 'Matched terms · guided diligence · close',
    icon: FileCheck2,
  },
];

const problemSolution = [
  ['Capital-product mismatch', 'A structure matched to the actual use of funds'],
  ['Opaque costs and covenants', 'Comparable terms with an advisor beside you'],
  ['Weeks lost chasing updates', 'One shared process and visible next steps'],
  ['Documents scattered everywhere', 'A reusable lender-ready data room'],
];

function ProductFamily({ family }: { family: 'Swift' | 'Scale' }) {
  const items = products.filter((item) => item.family === family);
  const swift = family === 'Swift';
  return (
    <section className={`product-family ${swift ? 'product-family--swift' : 'product-family--scale'}`}>
      <div className="product-family__header">
        <div>
          <span className="section-kicker">{family} facilities</span>
          <h2>{swift ? 'Capital at the speed of thought.' : 'Larger debt, structured for massive scale.'}</h2>
        </div>
        <p>{swift ? 'Early-to-mid-stage facilities up to an indicative ₹10 Cr, designed for fast-moving operating needs.' : 'Institutional-grade facilities from an indicative ₹1 Cr to ₹250 Cr for mature startups and profitable SMEs.'}</p>
      </div>
      <div className="product-family__body">
        <div className="product-list">
          {items.map((product, index) => (
            <Reveal key={product.slug} delay={index * 70}>
              <Link className="product-row" to={`/products/${product.slug}`}>
                <span className="product-row__index">0{index + 1}</span>
                <span className="product-row__copy">
                  <strong>{product.name}</strong>
                  <small>{product.summary}</small>
                </span>
                <span className="product-row__terms"><strong>{product.amount}</strong><small>{product.tenure}</small></span>
                <ArrowRight size={21} aria-hidden="true" />
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="product-signal" aria-label={`${family} facility illustration`}>
          <div className="product-signal__top">
            <span>Illustrative capital view</span><span className="status-dot">Sample assessment</span>
          </div>
          <div className="product-signal__amount">{swift ? '₹4.8 Cr' : '₹72 Cr'}<span>illustrative capacity</span></div>
          <div className="signal-chart">
            {[32, 46, 39, 58, 66, 61, 78, 86, 82, 94].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
          </div>
          <div className="signal-metrics">
            <span><small>{swift ? 'Revenue quality' : 'DSCR'}</small><strong>{swift ? 'Strong' : '1.82×'}</strong></span>
            <span><small>{swift ? 'Data coverage' : 'Coverage'}</small><strong>{swift ? '92%' : '72%'}</strong></span>
          </div>
          <p>Illustrative dashboard. Live values require verified integrations and lender models.</p>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <img
          className="hero__image"
          src="/crednest-founders-hero-1536.webp"
          srcSet="/crednest-founders-hero-640.webp 640w, /crednest-founders-hero-1024.webp 1024w, /crednest-founders-hero-1536.webp 1536w"
          sizes="100vw"
          alt="Two Indian business founders reviewing operating and financial plans above a warehouse floor"
          width="1536"
          height="910"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        <div className="hero__veil" />
        <div className="hero__content">
          <p className="hero__eyebrow"><span /> Advisory-led. AI-assisted. Built for India.</p>
          <h1 id="hero-title">Frictionless capital.<br /><em>Built for scale.</em></h1>
          <p className="hero__summary">Non-dilutive debt facilities from lakhs to an indicative ₹250 Cr—structured around the business, without giving up ownership.</p>
          <div className="hero__actions">
            <Link className="button button--lime" to="/contact">Get started <ArrowRight size={18} /></Link>
            <Link className="button button--ghost" to="/products">Explore products</Link>
          </div>
          <div className="hero__trust" aria-label="Indicative product benefits">
            {trustPoints.map(({ icon: Icon, text }) => <span key={text}><Icon size={17} aria-hidden="true" />{text}</span>)}
          </div>
          <p className="hero__fineprint">*Indicative benefits only; availability varies by facility and lender approval.</p>
        </div>
        <div className="hero__stats">
          {/* Only claims that are true by construction: the product count, the stated
              indicative ceiling, and the workflow's nature. No invented metrics. */}
          <div><strong>7</strong><span>Debt solutions</span></div>
          <div><strong>₹250 Cr</strong><span>Indicative upper range</span></div>
          <div><strong>AI</strong><span>Assisted underwriting</span></div>
        </div>
      </section>

      <div className="page-band page-band--ivory">
        <Reveal><FundingEstimator /></Reveal>
      </div>

      <section className="how section-shell" id="how-it-works">
        <Reveal className="section-heading">
          <span className="section-kicker">One connected process</span>
          <h2>From raw business data to a lender-ready decision.</h2>
          <p>Less document chasing. More time spent choosing the right structure.</p>
        </Reveal>
        <div className="process-grid">
          {processSteps.map(({ icon: Icon, ...step }, index) => (
            <Reveal key={step.number} delay={index * 100} className="process-step">
              <div className="process-step__top"><span>{step.number}</span><Icon size={25} aria-hidden="true" /></div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <small>{step.detail}</small>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="gap-section">
        <div className="gap-section__intro">
          <span className="section-kicker">Why CredNest</span>
          <h2>Debt is not one product. It is a design problem.</h2>
          <p>The right facility aligns use of funds, cash-flow timing, security, risk and growth milestones.</p>
          <Link className="text-link" to="/about">Why we’re building CredNest <ArrowRight size={17} /></Link>
        </div>
        <div className="gap-list">
          <div className="gap-list__head"><span>The old friction</span><span>The CredNest approach</span></div>
          {problemSolution.map(([problem, solution], index) => (
            <Reveal key={problem} delay={index * 60} className="gap-row">
              <span><Unplug size={18} aria-hidden="true" />{problem}</span>
              <span><Check size={18} aria-hidden="true" />{solution}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="stage-section section-shell">
        <Reveal className="section-heading section-heading--row">
          <div><span className="section-kicker">Debt by stage</span><h2>Start fast. Then scale deliberately.</h2></div>
          <p>Two families, one advisory layer. Choose a starting point—we’ll help test the fit.</p>
        </Reveal>
        <div className="stage-pair">
          <Link className="stage-panel stage-panel--swift" to="/products#swift">
            <span>01 · Early to mid stage</span>
            <h3>Swift</h3>
            <p>Recurring revenue and working capital facilities for faster operating cycles.</p>
            <strong>Up to ₹10 Cr* <ArrowRight size={20} /></strong>
          </Link>
          <Link className="stage-panel stage-panel--scale" to="/products#scale">
            <span>02 · Growth to maturity</span>
            <h3>Scale</h3>
            <p>Institutional venture debt, secured, invoice, structured and lease facilities.</p>
            <strong>Up to ₹250 Cr* <ArrowRight size={20} /></strong>
          </Link>
        </div>
        <p className="section-footnote">*Indicative product limits. Actual amounts depend on eligibility and lender approval.</p>
      </section>

      <ProductFamily family="Swift" />
      <ProductFamily family="Scale" />

      <div className="page-band page-band--ink">
        <CompatibilityQuiz />
      </div>

      <section className="platform section-shell">
        <div className="platform__sticky">
          <span className="section-kicker">The platform</span>
          <h2>A credit workflow that gets smarter with every verified input.</h2>
          <p>CredNest’s “Magic Stack” is designed to move from company lookup to a decision-ready proposal with less manual coordination.</p>
          <Link className="button button--dark" to="/technology">Explore the technology <ArrowRight size={17} /></Link>
        </div>
        <div className="stack-list">
          {[
            { icon: Fingerprint, number: '01', title: 'API layer', body: 'Permissioned connections for company, banking, GST, accounting and billing data.', tag: 'CIN · PAN · GST' },
            { icon: Sparkles, number: '02', title: 'AI core', body: 'Ratio analysis, anomaly review, narrative synthesis and proposal drafting with human oversight.', tag: 'Human-reviewed output' },
            { icon: Blocks, number: '03', title: 'Data hub', body: 'A reusable business profile, document room, lender pipeline and decision trail in one place.', tag: 'One source of truth' },
          ].map(({ icon: Icon, ...item }, index) => (
            <Reveal key={item.title} delay={index * 90} className="stack-item">
              <div><span>{item.number}</span><Icon size={26} aria-hidden="true" /></div>
              <h3>{item.title}</h3><p>{item.body}</p><small>{item.tag}</small>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="underwriting">
        <div className="underwriting__intro section-shell">
          <Reveal>
            <span className="section-kicker">AI-assisted underwriting concept</span>
            <h2>See how statements become a review-ready credit narrative.</h2>
          </Reveal>
          <div className="metric-line">
            {[
              [Gauge, 'DSCR · current · quick'],
              [BarChart3, 'Cash flow · invoice ageing'],
              [TrendingUp, 'Debt-equity · interest cover'],
              [TrendingUp, 'SWOT · sensitivity'],
              [BadgeCheck, 'CAM · proposal builder'],
            ].map(([Icon, label]) => {
              const MetricIcon = Icon as typeof Gauge;
              return <span key={String(label)}><MetricIcon size={19} aria-hidden="true" />{String(label)}</span>;
            })}
          </div>
        </div>
        <div className="section-shell"><TermSheetSandbox /></div>
      </section>

      <section className="lender-section">
        <div className="lender-section__visual" aria-hidden="true">
          <div className="network-orbit network-orbit--one" /><div className="network-orbit network-orbit--two" />
          <span className="network-node network-node--center"><Network size={30} /></span>
          <span className="network-node network-node--a"><Building2 /></span>
          <span className="network-node network-node--b"><WalletCards /></span>
          <span className="network-node network-node--c"><CircleDollarSign /></span>
        </div>
        <Reveal className="lender-section__copy">
          <span className="section-kicker">For capital partners</span>
          <h2>A clearer path to structured deal flow.</h2>
          <p>The platform vision gives lenders a consistent data pack, draft CAM and an advisor-coordinated process.</p>
          <ul>
            <li><Check size={17} /> Mandate-based screening criteria captured upfront</li>
            <li><Check size={17} /> Consistent credit information and documentation</li>
            <li><Check size={17} /> Faster triage across preferred sectors and tickets</li>
          </ul>
          <div className="button-row">
            <Link className="button button--lime" to="/capital-partners">Become a capital partner</Link>
            <Link className="text-link text-link--light" to="/capital-partners#guidelines">View partner guidelines <ArrowRight size={17} /></Link>
          </div>
        </Reveal>
      </section>

      <section className="narrative section-shell">
        <Reveal className="narrative__quote">
          <span>Our narrative</span>
          <blockquote>“Great companies should not have to choose between stalled growth and unnecessary dilution.”</blockquote>
        </Reveal>
        <div className="narrative__copy">
          <h2>Debt capital, made navigable.</h2>
          <p>CredNest is building the advisory and technology layer that helps founders understand what they can responsibly borrow—and helps lenders see the business more clearly.</p>
          <Link className="text-link" to="/about">Read the CredNest story <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="contact-block" id="contact">
        <div className="contact-block__copy">
          <span className="section-kicker">Start a conversation</span>
          <h2>Tell us what the next phase needs.</h2>
          <p>Share the business, the capital need and the milestone ahead. We’ll help frame the right starting point.</p>
          <div className="contact-block__signal"><span>01</span> Assessment <i /><span>02</span> Structure <i /><span>03</span> Lender process</div>
        </div>
        <div className="contact-block__form">
          <ContactForm source="homepage-contact" heading="Request a debt assessment" />
        </div>
      </section>
    </>
  );
}
