import { useMemo, useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { products } from '../content/site';

const sandboxRanges = {
  'recurring-revenue-financing': { amount: 2, minAmount: 0.25, maxAmount: 10, amountStep: 0.25, tenure: 12, minTenure: 3, maxTenure: 24, tenureStep: 3 },
  'working-capital-financing': { amount: 2, minAmount: 0.25, maxAmount: 10, amountStep: 0.25, tenure: 12, minTenure: 3, maxTenure: 24, tenureStep: 3 },
  'venture-debt': { amount: 10, minAmount: 2, maxAmount: 100, amountStep: 1, tenure: 36, minTenure: 24, maxTenure: 48, tenureStep: 6 },
  'secured-term-loans': { amount: 25, minAmount: 5, maxAmount: 250, amountStep: 5, tenure: 60, minTenure: 24, maxTenure: 120, tenureStep: 12 },
  'invoice-financing': { amount: 5, minAmount: 0.25, maxAmount: 50, amountStep: 0.25, tenure: 2, minTenure: 1, maxTenure: 3, tenureStep: 1 },
  'structured-debt': { amount: 25, minAmount: 1, maxAmount: 250, amountStep: 1, tenure: 36, minTenure: 6, maxTenure: 120, tenureStep: 6 },
  'lease-financing': { amount: 10, minAmount: 1, maxAmount: 50, amountStep: 1, tenure: 36, minTenure: 12, maxTenure: 84, tenureStep: 6 },
} as const;

export default function TermSheetSandbox() {
  const [productSlug, setProductSlug] = useState('venture-debt');
  const [amount, setAmount] = useState(10);
  const [tenure, setTenure] = useState(36);
  const [generated, setGenerated] = useState(true);
  const product = products.find((item) => item.slug === productSlug) || products[2];
  const range = sandboxRanges[product.slug as keyof typeof sandboxRanges];
  const annualRate = useMemo(() => 11.5 + Math.min(4.5, Math.max(0, 50 - amount) / 20), [amount]);
  const monthlyPayment = useMemo(() => {
    const principal = amount * 10_000_000;
    const rate = annualRate / 1200;
    const payment = (principal * rate * (1 + rate) ** tenure) / ((1 + rate) ** tenure - 1);
    return Math.round(payment / 10_000) / 10;
  }, [amount, annualRate, tenure]);
  const tenureLabel = product.slug === 'invoice-financing' ? `${tenure * 30} days` : `${tenure} months`;

  function selectProduct(nextSlug: string) {
    const nextRange = sandboxRanges[nextSlug as keyof typeof sandboxRanges];
    setProductSlug(nextSlug);
    setAmount(nextRange.amount);
    setTenure(nextRange.tenure);
    setGenerated(false);
  }

  return (
    <div className="sandbox">
      <div className="sandbox__controls">
        <span className="section-kicker"><Sparkles size={15} /> Frontend simulation</span>
        <h3>Build an illustrative term sheet.</h3>
        <p>Adjust three inputs to see how a lender-ready summary could look. Production underwriting and lender APIs are marked as backend work.</p>
        <label>
          Product
          <select value={productSlug} onChange={(event) => selectProduct(event.target.value)}>
            {products.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
        </label>
        <label>
          Facility amount <strong>₹{amount} Cr</strong>
          <input className="range" type="range" min={range.minAmount} max={range.maxAmount} step={range.amountStep} value={amount} onChange={(event) => { setAmount(Number(event.target.value)); setGenerated(false); }} />
        </label>
        <label>
          Tenure <strong>{tenureLabel}</strong>
          <input className="range" type="range" min={range.minTenure} max={range.maxTenure} step={range.tenureStep} value={tenure} onChange={(event) => { setTenure(Number(event.target.value)); setGenerated(false); }} />
        </label>
        <button className="button button--primary" type="button" onClick={() => setGenerated(true)}><Sparkles size={17} /> Generate sample</button>
      </div>
      <div className={`term-sheet ${generated ? 'is-generated' : ''}`} aria-live="polite">
        <div className="term-sheet__top">
          <span><FileText size={17} /> Indicative term sheet</span>
          <small>NOT AN OFFER</small>
        </div>
        <h4>{product.name}</h4>
        <div className="term-sheet__grid">
          <div><span>Facility</span><strong>₹{amount} Cr</strong></div>
          <div><span>Tenure</span><strong>{tenureLabel}</strong></div>
          <div><span>Illustrative rate</span><strong>{annualRate.toFixed(1)}% p.a.</strong></div>
          <div><span>Indicative EMI</span><strong>₹{monthlyPayment} lakh</strong></div>
        </div>
        <div className="term-sheet__line"><span>Structure</span><strong>{product.repayment}</strong></div>
        <div className="term-sheet__line"><span>Security</span><strong>Subject to credit appraisal</strong></div>
        <div className="term-sheet__line"><span>Conditions</span><strong>KYC, diligence, lender approval</strong></div>
        <p>Illustrative simulation only. Actual rates, amounts and terms are set by lending partners after credit assessment.</p>
      </div>
    </div>
  );
}
