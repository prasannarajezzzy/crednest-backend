import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, ChevronDown, Menu, MessageCircle, Phone, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { products, siteConfig } from '../content/site';
import ConsentBanner from './ConsentBanner';
import { ContactForm, Dialog } from './LeadForms';
import PublicNotice from './PublicNotice';

export function Brand({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link className={`brand ${inverted ? 'brand--inverted' : ''}`} to="/" aria-label="CredNest home">
      <img src="/crednest-mark.svg" width="42" height="42" alt="" />
      <span>CredNest</span>
    </Link>
  );
}

const companyLinks = [
  { label: 'Our story', to: '/about' },
  { label: 'Capital partners', to: '/capital-partners' },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const phoneReady = Boolean(siteConfig.phoneHref);

  useEffect(() => {
    setMobileOpen(false);
    document.querySelectorAll<HTMLDetailsElement>('.nav-menu[open]').forEach((menu) => { menu.open = false; });
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        window.requestAnimationFrame(() => mobileToggleRef.current?.focus());
        return;
      }
      if (event.key === 'Tab') {
        const navItems = Array.from(mobileNavRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') || []);
        const focusable = [mobileToggleRef.current, ...navItems].filter((item): item is HTMLElement => Boolean(item));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    const backgroundTargets = Array.from(document.querySelectorAll<HTMLElement>('.announcement, .site-header > .brand, #main-content, .site-footer, .partner-trigger, .whatsapp-float'));
    const previousInert = backgroundTargets.map((element) => element.inert);
    document.body.style.overflow = 'hidden';
    backgroundTargets.forEach((element) => { element.inert = true; });
    document.addEventListener('keydown', onKeyDown);
    const focusFrame = window.requestAnimationFrame(() => mobileNavRef.current?.querySelector<HTMLElement>('a[href]')?.focus());
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      backgroundTargets.forEach((element, index) => { element.inert = previousInert[index]; });
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="announcement">
        <span>Built for founders and lending partners across India</span>
        <Link to="/contact">Request an assessment <ArrowRight size={14} aria-hidden="true" /></Link>
      </div>
      <header className="site-header">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary navigation">
          <details className="nav-menu">
            <summary>Products <ChevronDown size={14} aria-hidden="true" /></summary>
            <div className="nav-menu__panel nav-menu__panel--products">
              <div>
                <span className="nav-menu__family">Swift · up to ₹10 Cr</span>
                {products.filter((item) => item.family === 'Swift').map((product) => (
                  <Link key={product.slug} to={`/products/${product.slug}`}>{product.shortName}</Link>
                ))}
              </div>
              <div>
                <span className="nav-menu__family">Scale · up to ₹250 Cr</span>
                {products.filter((item) => item.family === 'Scale').map((product) => (
                  <Link key={product.slug} to={`/products/${product.slug}`}>{product.shortName}</Link>
                ))}
              </div>
              <Link className="nav-menu__all" to="/products">View all debt solutions <ArrowRight size={15} /></Link>
            </div>
          </details>
          <NavLink to="/technology">Technology</NavLink>
          <details className="nav-menu">
            <summary>About <ChevronDown size={14} aria-hidden="true" /></summary>
            <div className="nav-menu__panel">
              {companyLinks.map((item) => <Link key={item.label} to={item.to}>{item.label}</Link>)}
            </div>
          </details>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <div className="header-actions">
          {phoneReady ? (
            <a className="header-phone" href={siteConfig.phoneHref} aria-label={`Call CredNest at ${siteConfig.phoneDisplay}`}><Phone size={17} aria-hidden="true" /> <span>Capital desk</span></a>
          ) : (
            <Link className="header-phone" to="/contact" aria-label="Open the contact page; phone setup is pending"><Phone size={17} aria-hidden="true" /> <span>Capital desk</span></Link>
          )}
          {/* Login is intentionally unlinked until real authentication ships; the /login route still resolves. */}
          <Link className="button button--primary button--small" to="/contact">Get started</Link>
          <button
            ref={mobileToggleRef}
            className="mobile-toggle"
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
        {mobileOpen && (
          <nav ref={mobileNavRef} id="mobile-navigation" className="mobile-nav" role="dialog" aria-modal="true" aria-label="Mobile navigation">
            <Link to="/products">All products</Link>
            {products.map((product) => <Link key={product.slug} to={`/products/${product.slug}`}>{product.shortName}</Link>)}
            <Link to="/technology">Technology</Link>
            <Link to="/capital-partners">Capital partners</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link className="button button--primary" to="/contact">Get started</Link>
          </nav>
        )}
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Brand inverted />
          <p>Advisory-led debt capital for ambitious Indian businesses.</p>
          <div className="footer-contact">
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>
          </div>
        </div>
        <div>
          <h3>Swift</h3>
          {products.filter((item) => item.family === 'Swift').map((item) => <Link key={item.slug} to={`/products/${item.slug}`}>{item.shortName}</Link>)}
          <Link to="/funding-estimator">Funding estimator</Link>
        </div>
        <div>
          <h3>Scale</h3>
          {products.filter((item) => item.family === 'Scale').map((item) => <Link key={item.slug} to={`/products/${item.slug}`}>{item.shortName}</Link>)}
        </div>
        <div>
          <h3>Company</h3>
          <Link to="/about">About</Link>
          <Link to="/capital-partners">Capital partners</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <h3>Resources</h3>
          {/* Blog stays unlinked until the first posts are published; the /blog route still resolves. */}
          <Link to="/faq">FAQ</Link>
          <Link to="/technology">Technology</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} CredNest. All rights reserved.</span>
        <p>{siteConfig.disclaimer}</p>
      </div>
    </footer>
  );
}

export function FloatingActions() {
  const [promptMode, setPromptMode] = useState<'partner' | 'assessment' | null>(null);
  const [role, setRole] = useState('CA / consultant / DSA');
  const whatsappReady = Boolean(siteConfig.whatsappHref);

  useEffect(() => {
    if (typeof window === 'undefined' || window.sessionStorage.getItem('crednest-prompt-dismissed')) return;
    let armed = false;
    const timer = window.setTimeout(() => { armed = true; }, 12000);
    const onMouseOut = (event: MouseEvent) => {
      // Never stack on top of the public notice; it must be read and dismissed first.
      if (document.querySelector('[data-blocking-dialog]')) return;
      if (armed && event.clientY <= 4 && !event.relatedTarget) {
        setPromptMode('assessment');
        armed = false;
      }
    };
    document.addEventListener('mouseout', onMouseOut);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  const closePrompt = useCallback(() => {
    setPromptMode(null);
    window.sessionStorage.setItem('crednest-prompt-dismissed', 'true');
  }, []);

  return (
    <>
      <button className="partner-trigger" type="button" onClick={() => setPromptMode('partner')}>
        <BriefcaseBusiness size={18} aria-hidden="true" /> Partner with us
      </button>
      {whatsappReady ? (
        <a className="whatsapp-float" href={siteConfig.whatsappHref} aria-label={`WhatsApp CredNest at ${siteConfig.whatsappDisplay}`}><MessageCircle size={23} aria-hidden="true" /><span>WhatsApp<br /><small>{siteConfig.whatsappDisplay}</small></span></a>
      ) : (
        <Link className="whatsapp-float" to="/contact" aria-label="Open the contact page; WhatsApp setup is pending"><MessageCircle size={23} aria-hidden="true" /><span>Contact desk<br /><small>WhatsApp pending</small></span></Link>
      )}
      <Dialog
        open={Boolean(promptMode)}
        onClose={closePrompt}
        eyebrow={promptMode === 'assessment' ? 'Before you go' : 'Partner network'}
        title={promptMode === 'assessment' ? 'Get a free debt assessment.' : 'Bring better debt options to more businesses.'}
      >
        {promptMode === 'assessment' ? (
          <>
            <p className="dialog__intro">Share the business and funding need. We’ll help frame a practical, non-dilutive starting point.</p>
            <ContactForm source="exit-intent-assessment" compact submitLabel="Request free assessment" />
          </>
        ) : (
          <>
            <p className="dialog__intro">For CAs, consulting firms, DSAs and experienced bankers. Choose your profile and we’ll start the right conversation.</p>
            <div className="choice-row" role="group" aria-label="Partner profile">
              {['CA / consultant / DSA', 'Ex-banker', 'Capital provider'].map((item) => (
                <button key={item} className={role === item ? 'is-selected' : ''} type="button" aria-pressed={role === item} onClick={() => setRole(item)}>{item}</button>
              ))}
            </div>
            <ContactForm source="partner-popup" compact submitLabel="Join the network" metadata={{ role }} />
          </>
        )}
      </Dialog>
    </>
  );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <SiteFooter />
      <FloatingActions />
      <ConsentBanner />
      <PublicNotice />
    </div>
  );
}
