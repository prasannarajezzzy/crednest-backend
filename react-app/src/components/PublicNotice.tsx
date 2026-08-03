import { useCallback, useEffect, useRef, useState } from 'react';
import { ShieldAlert, TriangleAlert } from 'lucide-react';
import { publicNotice, siteConfig } from '../content/site';

const STORAGE_KEY = 'crednest-notice-ack';

/**
 * Anti-fraud notice shown once per session, before anything else on the page.
 *
 * Session-scoped rather than permanent: a returning visitor should see it again,
 * but not on every route change. Rendered client-side only, so it never appears
 * in the prerendered HTML that search engines index.
 */
export default function PublicNotice() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (window.sessionStorage.getItem(STORAGE_KEY)) return;
    setOpen(true);
  }, []);

  const acknowledge = useCallback(() => {
    window.sessionStorage.setItem(STORAGE_KEY, 'true');
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = window.requestAnimationFrame(() => confirmRef.current?.focus());

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        acknowledge();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const items = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('button, a[href]'),
      ).filter((item) => !item.hasAttribute('disabled'));
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
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [open, acknowledge]);

  if (!open) return null;

  return (
    <div className="notice-layer" data-blocking-dialog="true" role="presentation">
      <div
        ref={dialogRef}
        className="notice"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="public-notice-title"
        aria-describedby="public-notice-intro"
      >
        <header className="notice__head">
          <ShieldAlert size={19} aria-hidden="true" />
          <h2 id="public-notice-title">{publicNotice.heading}</h2>
        </header>

        <div className="notice__body">
          <div className="notice__identity">
            <span className="notice__mark">
              <img src="/crednest-mark.svg" width="26" height="26" alt="" />
              {siteConfig.name}
            </span>
          </div>

          <p id="public-notice-intro" className="notice__intro">{publicNotice.intro}</p>

          <ul className="notice__points">
            {publicNotice.points.map((point) => <li key={point}>{point}</li>)}
          </ul>

          <p className="notice__warning">
            <TriangleAlert size={17} aria-hidden="true" />
            <span>{publicNotice.warning}</span>
          </p>

          <p className="notice__footnote">{publicNotice.footnote}</p>
        </div>

        <footer className="notice__foot">
          <button ref={confirmRef} className="button button--primary" type="button" onClick={acknowledge}>
            {publicNotice.acknowledge}
          </button>
        </footer>
      </div>
    </div>
  );
}
