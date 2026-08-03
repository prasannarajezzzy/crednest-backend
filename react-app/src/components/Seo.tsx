import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSeoData } from '../lib/seo';

function upsertMeta(selector: string, attribute: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getSeoData(pathname);
    document.title = seo.title;
    upsertMeta('meta[name="description"]', 'content', seo.description);
    upsertMeta('meta[name="robots"]', 'content', seo.noindex ? 'noindex, nofollow' : 'index, follow');
    upsertMeta('meta[property="og:title"]', 'content', seo.title);
    upsertMeta('meta[property="og:description"]', 'content', seo.description);
    if (seo.canonical) upsertMeta('meta[property="og:url"]', 'content', seo.canonical);
    else document.head.querySelector('meta[property="og:url"]')?.remove();
    upsertMeta('meta[property="og:image"]', 'content', seo.image);
    upsertMeta('meta[name="twitter:title"]', 'content', seo.title);
    upsertMeta('meta[name="twitter:description"]', 'content', seo.description);
    upsertMeta('meta[name="twitter:image"]', 'content', seo.image);

    const existingCanonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!seo.canonical) {
      existingCanonical?.remove();
    } else {
      const canonical = existingCanonical || document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = seo.canonical;
      if (!existingCanonical) document.head.appendChild(canonical);
    }

    document.querySelectorAll('script[data-crednest-schema]').forEach((node) => node.remove());
    seo.schema.forEach((item) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.crednestSchema = 'true';
      script.textContent = JSON.stringify(item);
      document.head.appendChild(script);
    });
  }, [pathname]);

  return null;
}
