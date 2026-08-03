import { useEffect, useRef } from 'react';
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Seo from './components/Seo';
import { SiteLayout } from './components/SiteChrome';
import HomePage from './pages/HomePage';
import {
  AboutPage,
  BlogPage,
  CapitalPartnersPage,
  ContactPage,
  FaqPage,
  FundingEstimatorPage,
  LoginPage,
  NotFoundPage,
  ProductPage,
  ProductsPage,
  PrivacyPage,
  TechnologyPage,
  TermsPage,
} from './pages/MarketingPages';

const legacyHashes: Record<string, string> = {
  '#home-loans': '/products/secured-term-loans',
  '#loan-against-property': '/products/secured-term-loans',
  '#personal-loans': '/products',
  '#balance-transfer': '/products/structured-debt',
  '#calculator': '/funding-estimator',
  '#faq': '/faq',
  '#contact': '/contact',
};

function RouteEffects() {
  const { pathname, hash } = useLocation();
  const initialRoute = useRef(true);

  useEffect(() => {
    if (pathname === '/' && hash && legacyHashes[hash]) {
      window.location.replace(legacyHashes[hash]);
      return;
    }

    const firstVisit = initialRoute.current;
    initialRoute.current = false;

    if (hash) {
      const frame = window.requestAnimationFrame(() => {
        const target = document.getElementById(hash.slice(1));
        if (!target) return;
        const focusTarget = target.matches('h1, h2, h3') ? target : target.querySelector<HTMLElement>('h1, h2, h3') || target;
        focusTarget.tabIndex = -1;
        focusTarget.focus({ preventScroll: true });
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      });
      return () => window.cancelAnimationFrame(frame);
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
    if (!firstVisit) document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return <Seo />;
}

function MarketingLayout() {
  return (
    <SiteLayout>
      <RouteEffects />
      <Outlet />
    </SiteLayout>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductPage />} />
        <Route path="/funding-estimator" element={<FundingEstimatorPage />} />
        <Route path="/technology" element={<TechnologyPage />} />
        <Route path="/capital-partners" element={<CapitalPartnersPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<LoginPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
