import { createServer } from 'node:http';
import { access, readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const distRoot = resolve(process.cwd(), 'dist');

function option(name, fallback) {
  const exactIndex = process.argv.indexOf(`--${name}`);
  if (exactIndex >= 0 && process.argv[exactIndex + 1]) return process.argv[exactIndex + 1];
  const inline = process.argv.find((value) => value.startsWith(`--${name}=`));
  return inline ? inline.slice(name.length + 3) : fallback;
}

const host = option('host', '127.0.0.1');
const port = Number(option('port', '4173'));
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Preview port must be an integer between 1 and 65535.');

await access(resolve(distRoot, 'index.html'));

const redirectText = await readFile(resolve(distRoot, '_redirects'), 'utf8').catch(() => '');
const redirects = new Map(
  redirectText
    .split(/\r?\n/)
    .map((line) => line.trim().split(/\s+/))
    .filter((parts) => parts.length >= 3 && parts[2].startsWith('301'))
    .map(([source, destination]) => [source, destination]),
);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};

function safePath(relativePath) {
  const candidate = resolve(distRoot, relativePath);
  return candidate === distRoot || candidate.startsWith(`${distRoot}${sep}`) ? candidate : null;
}

async function fileExists(filePath) {
  if (!filePath) return false;
  return stat(filePath).then((entry) => entry.isFile()).catch(() => false);
}

const server = createServer(async (request, response) => {
  try {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }

    const url = new URL(request.url || '/', `http://${request.headers.host || `${host}:${port}`}`);
    const pathname = decodeURIComponent(url.pathname);

    if (pathname.length > 1 && pathname.endsWith('/')) {
      response.writeHead(308, { Location: `${pathname.slice(0, -1)}${url.search}` }).end();
      return;
    }

    const redirect = redirects.get(pathname);
    if (redirect) {
      response.writeHead(301, { Location: `${redirect}${url.search}` }).end();
      return;
    }

    const relativePath = pathname.replace(/^\/+/, '');
    const candidates = pathname === '/'
      ? [safePath('index.html')]
      : [safePath(relativePath), safePath(`${relativePath}/index.html`)];
    let filePath = null;
    for (const candidate of candidates) {
      if (await fileExists(candidate)) {
        filePath = candidate;
        break;
      }
    }

    const statusCode = filePath ? 200 : 404;
    filePath ||= safePath('404.html');
    const body = await readFile(filePath);
    const contentType = contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream';
    const cacheControl = pathname.startsWith('/static/') ? 'public, max-age=31536000, immutable' : 'no-cache';
    response.writeHead(statusCode, { 'Content-Type': contentType, 'Cache-Control': cacheControl });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Preview server error.');
    console.error(error);
  }
});

server.listen(port, host, () => {
  console.log(`CredNest production preview: http://${host}:${port}`);
});
