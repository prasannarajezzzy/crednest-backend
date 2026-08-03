import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const templatePath = join(root, 'dist', 'index.html');
const serverEntry = pathToFileURL(join(root, '.prerender', 'entry-server.js')).href;
const template = await readFile(templatePath, 'utf8');
const { render, routes } = await import(serverEntry);

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function headFor(seo) {
  const schema = seo.schema
    .map((item) => `<script type="application/ld+json" data-crednest-schema="true">${JSON.stringify(item).replaceAll('<', '\\u003c')}</script>`)
    .join('\n    ');
  const canonical = seo.canonical
    ? `<link rel="canonical" href="${escapeHtml(seo.canonical)}">
    <meta property="og:url" content="${escapeHtml(seo.canonical)}">`
    : '';
  return `<title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}">
    <meta name="robots" content="${seo.noindex ? 'noindex, nofollow' : 'index, follow'}">
    ${canonical}
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="CredNest">
    <meta property="og:locale" content="en_IN">
    <meta property="og:title" content="${escapeHtml(seo.title)}">
    <meta property="og:description" content="${escapeHtml(seo.description)}">
    <meta property="og:image" content="${escapeHtml(seo.image)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(seo.title)}">
    <meta name="twitter:description" content="${escapeHtml(seo.description)}">
    <meta name="twitter:image" content="${escapeHtml(seo.image)}">
    ${schema}`;
}

function documentFor(route) {
  const { html, seo } = render(route);
  return template
    .replace('<!--seo-head-->', headFor(seo))
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
}

for (const route of routes) {
  const output = documentFor(route);
  const target = route === '/' ? templatePath : join(root, 'dist', route.slice(1), 'index.html');
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, output, 'utf8');
}

await writeFile(join(root, 'dist', '404.html'), documentFor('/404'), 'utf8');
await rm(join(root, '.prerender'), { recursive: true, force: true });
console.log(`Prerendered ${routes.length} marketing routes and a custom 404 page.`);
