import { useEffect, useId, useRef, useState, type FormEvent, type PropsWithChildren } from 'react';
import { ArrowRight, Check, LoaderCircle, X } from 'lucide-react';
import { submitLead } from '../lib/lead';

type ContactFormProps = {
  source: string;
  compact?: boolean;
  heading?: string;
  submitLabel?: string;
  metadata?: Record<string, string | number | boolean>;
};

export function ContactForm({
  source,
  compact = false,
  heading,
  submitLabel = 'Request assessment',
  metadata,
}: ContactFormProps) {
  const id = useId();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'demo' | 'error'>('idle');
  const [error, setError] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);
  const mountedAt = useRef(Date.now());

  useEffect(() => {
    if (status === 'success' || status === 'demo') resultRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    // Honeypot: a hidden field only an automated script would fill. Fail silently so
    // the bot cannot learn it was caught. Never blocks a real person, who cannot see it.
    if (String(form.get('website') || '').length > 0) {
      setStatus('submitting');
      window.setTimeout(() => setStatus('success'), 600);
      return;
    }

    // Time-to-submit is reported, not enforced: browser autofill can complete this form
    // in well under a second, so blocking on it would drop genuine leads.
    const elapsedMs = Date.now() - mountedAt.current;

    const phone = String(form.get('phone') || '').trim();
    const phoneDigits = phone.replace(/\D/g, '');

    if (!/^[+0-9 ()-]+$/.test(phone) || phoneDigits.length < 8 || phoneDigits.length > 15) {
      setError('Enter a valid phone number with 8 to 15 digits.');
      setStatus('error');
      (formElement.elements.namedItem('phone') as HTMLInputElement | null)?.focus();
      return;
    }

    setStatus('submitting');
    setError('');

    try {
      const delivery = await submitLead({
        source,
        name: String(form.get('name') || ''),
        company: String(form.get('company') || ''),
        phone,
        email: String(form.get('email') || ''),
        revenue: String(form.get('revenue') || ''),
        fundingNeed: String(form.get('fundingNeed') || ''),
        message: String(form.get('message') || ''),
        metadata: { ...metadata, elapsedMs },
      });
      setStatus(delivery === 'demo' ? 'demo' : 'success');
      formElement.reset();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'success' || status === 'demo') {
    return (
      <div ref={resultRef} className="form-success" role="status" aria-live="polite" tabIndex={-1}>
        <span className="form-success__icon"><Check size={22} aria-hidden="true" /></span>
        <div>
          <strong>{status === 'demo' ? 'Demo form validated—not sent.' : 'Assessment request received.'}</strong>
          <p>{status === 'demo' ? 'This preview has no CRM endpoint. Configure VITE_LEAD_ENDPOINT before accepting live enquiries.' : 'The request was sent to the configured lead endpoint.'}</p>
        </div>
      </div>
    );
  }

  return (
    <form className={`lead-form ${compact ? 'lead-form--compact' : ''}`} onSubmit={handleSubmit}>
      {heading && <h3>{heading}</h3>}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form-grid">
        <label htmlFor={`${id}-name`}>
          Your name
          <input id={`${id}-name`} name="name" autoComplete="name" required placeholder="Founder or finance lead" />
        </label>
        <label htmlFor={`${id}-company`}>
          Company
          <input id={`${id}-company`} name="company" autoComplete="organization" required placeholder="Company name" />
        </label>
        <label htmlFor={`${id}-phone`}>
          Phone
          <input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" required minLength={8} maxLength={18} aria-invalid={status === 'error' && error.startsWith('Enter a valid phone')} aria-describedby={`${id}-form-error`} placeholder="+91 98765 43210" />
        </label>
        <label htmlFor={`${id}-email`}>
          Work email
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" placeholder="you@company.com" required={!compact} />
        </label>
        {!compact && (
          <>
            <label htmlFor={`${id}-revenue`}>
              Annualised revenue
              <select id={`${id}-revenue`} name="revenue" defaultValue="">
                <option value="" disabled>Select a range</option>
                <option>Pre-revenue</option>
                <option>Under ₹5 Cr</option>
                <option>₹5–25 Cr</option>
                <option>₹25–100 Cr</option>
                <option>₹100–500 Cr</option>
                <option>₹500 Cr+</option>
              </select>
            </label>
            <label htmlFor={`${id}-funding`}>
              Funding need
              <select id={`${id}-funding`} name="fundingNeed" defaultValue="">
                <option value="" disabled>Select an amount</option>
                <option>Under ₹1 Cr</option>
                <option>₹1–5 Cr</option>
                <option>₹5–25 Cr</option>
                <option>₹25–100 Cr</option>
                <option>₹100 Cr+</option>
              </select>
            </label>
            <label className="form-grid__full" htmlFor={`${id}-message`}>
              What should the capital unlock?
              <textarea id={`${id}-message`} name="message" rows={4} placeholder="Inventory, runway, CAPEX, acquisition, receivables…" />
            </label>
          </>
        )}
      </div>
      <button className="button button--primary" type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? <LoaderCircle className="spin" size={18} aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}
        {status === 'submitting' ? 'Submitting…' : submitLabel}
      </button>
      <p className="form-note">By submitting, you consent to being contacted about your request and acknowledge the <a href="/privacy">interim privacy notice</a>. No lender approval is implied.</p>
      <div id={`${id}-form-error`} className="form-error" role="alert" aria-live="assertive">{status === 'error' ? error : ''}</div>
    </form>
  );
}

type DialogProps = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
}>;

export function Dialog({ open, onClose, title, eyebrow, children }: DialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelector<HTMLElement>('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusable?.focus();
    document.body.style.overflow = 'hidden';

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(
        (item) => !item.hasAttribute('disabled'),
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="dialog-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div ref={dialogRef} className="dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button className="dialog__close" type="button" onClick={onClose} aria-label="Close dialog">
          <X size={20} aria-hidden="true" />
        </button>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={titleId}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
