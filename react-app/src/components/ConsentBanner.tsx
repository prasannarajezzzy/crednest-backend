import { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';

const STORAGE_KEY = 'crednest-analytics-consent';
const measurementId = import.meta.env.VITE_GA_ID || '';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

function loadAnalytics() {
  if (document.getElementById('crednest-ga')) return;

  const script = document.createElement('script');
  script.id = 'crednest-ga';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  }
  gtag('js', new Date());
  // IP anonymisation on, ad personalisation off: analytics only, no advertising signals.
  gtag('config', measurementId, { anonymize_ip: true, allow_ad_personalization_signals: false });
}

/**
 * Consent gate for non-essential analytics.
 *
 * With VITE_GA_ID unset the site sets no analytics cookies at all, so this renders
 * nothing — showing a consent prompt for tracking that does not exist would be noise.
 * Once an ID is configured, analytics loads only after an explicit opt-in.
 */
export default function ConsentBanner() {
  const [decision, setDecision] = useState<'pending' | 'granted' | 'denied'>('pending');

  useEffect(() => {
    if (!measurementId) return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'granted') {
      setDecision('granted');
      loadAnalytics();
    } else if (stored === 'denied') {
      setDecision('denied');
    }
  }, []);

  if (!measurementId || decision !== 'pending') return null;

  function decide(choice: 'granted' | 'denied') {
    window.localStorage.setItem(STORAGE_KEY, choice);
    setDecision(choice);
    if (choice === 'granted') loadAnalytics();
  }

  return (
    <div className="consent-banner" role="dialog" aria-modal="false" aria-labelledby="consent-title">
      <div>
        <p id="consent-title"><Cookie size={17} aria-hidden="true" /> <strong>Help us improve this site?</strong></p>
        <p>
          We would like to set optional analytics cookies to understand which pages are useful. Essential cookies stay on either way.
          Read the <a href="/privacy">privacy notice</a>.
        </p>
      </div>
      <div className="consent-banner__actions">
        <button className="button button--ghost button--small" type="button" onClick={() => decide('denied')}>Decline</button>
        <button className="button button--primary button--small" type="button" onClick={() => decide('granted')}>Accept analytics</button>
      </div>
    </div>
  );
}
