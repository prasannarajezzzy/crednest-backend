import { useMemo, useState } from 'react';
import { ArrowRight, Calculator, LockKeyhole } from 'lucide-react';
import { ContactForm } from './LeadForms';

function formatCrore(value: number) {
  if (value <= 0) return '₹0';
  if (value < 1) return `₹${Math.max(5, Math.round(value * 100))} lakh`;
  return `₹${value >= 10 ? Math.round(value) : value.toFixed(1)} Cr`;
}

export default function FundingEstimator({ standalone = false }: { standalone?: boolean }) {
  const [revenue, setRevenue] = useState(40);
  const [showCapture, setShowCapture] = useState(false);

  const estimate = useMemo(() => {
    if (revenue === 0) return { lower: 0, upper: 0 };
    const upper = Math.min(250, Math.max(0.25, revenue * (revenue < 10 ? 0.22 : revenue < 100 ? 0.18 : 0.14)));
    const lower = Math.max(0.1, upper * 0.58);
    return { lower, upper };
  }, [revenue]);

  return (
    <section className={`estimator ${standalone ? 'estimator--standalone' : ''}`} aria-labelledby="estimator-title">
      <div className="estimator__copy">
        <span className="section-kicker"><Calculator size={16} aria-hidden="true" /> Funding estimator</span>
        <h2 id="estimator-title">What could your revenue support?</h2>
        <p>Move the slider for an instant, indicative facility range. A real assessment considers cash flow, leverage, collateral and lender policy.</p>
        <div className="estimator__trust"><LockKeyhole size={16} aria-hidden="true" /> No credit check. No data connection. Just a starting point.</div>
      </div>
      <div className="estimator__control">
        <div className="estimator__reading">
          <span>Annualised revenue</span>
          <strong>{revenue >= 1000 ? '₹1,000+ Cr' : `₹${revenue} Cr`}</strong>
        </div>
        <label className="sr-only" htmlFor="annual-revenue">Annualised revenue in crore rupees</label>
        <input
          id="annual-revenue"
          className="range"
          type="range"
          min="0"
          max="1000"
          step="5"
          value={revenue}
          onChange={(event) => setRevenue(Number(event.target.value))}
          style={{ '--range-progress': `${revenue / 10}%` } as React.CSSProperties}
        />
        <div className="range-labels"><span>₹0</span><span>₹250 Cr</span><span>₹500 Cr</span><span>₹1,000+ Cr</span></div>
        <div className="estimator__result" aria-live="polite">
          <span>Indicative facility range</span>
          <strong>{formatCrore(estimate.lower)} <i>to</i> {formatCrore(estimate.upper)}</strong>
          <p>Illustrative model only—not an approval, quote or commitment to lend.</p>
        </div>
        {!showCapture ? (
          <button className="button button--dark" type="button" onClick={() => setShowCapture(true)}>
            See matched options <ArrowRight size={18} aria-hidden="true" />
          </button>
        ) : (
          <div className="estimator__capture">
            <ContactForm
              source="funding-estimator"
              compact
              submitLabel="Get full assessment"
              metadata={{ annualRevenueCr: revenue, estimatedLowerCr: Number(estimate.lower.toFixed(2)), estimatedUpperCr: Number(estimate.upper.toFixed(2)) }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
