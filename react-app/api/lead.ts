/**
 * Vercel serverless function that receives lead submissions.
 *
 * The browser posts here same-origin, so there is no CORS preflight and no
 * destination URL in the public bundle. Configure LEAD_WEBHOOK_URL in the Vercel
 * dashboard — note the missing VITE_ prefix, which is what keeps it server-side.
 *
 * Without LEAD_WEBHOOK_URL set, this replies 501 and the form tells the visitor
 * plainly that nothing was sent, rather than pretending a lead was captured.
 */

// Edge runtime: this only forwards a fetch, needs no Node APIs, and declaring it
// explicitly avoids any ambiguity over which signature Vercel applies.
export const config = { runtime: 'edge' };

type LeadBody = {
  source?: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  revenue?: string;
  fundingNeed?: string;
  message?: string;
  website?: string;
  metadata?: Record<string, unknown>;
};

const MAX_FIELD = 2000;

function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim().slice(0, MAX_FIELD) : '';
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Honeypot. Answer 200 so a bot cannot tell it was rejected, but forward nothing.
  if (clean(body.website)) {
    return Response.json({ ok: true }, { status: 200 });
  }

  const name = clean(body.name);
  const company = clean(body.company);
  const phone = clean(body.phone);
  const phoneDigits = phone.replace(/\D/g, '');

  if (!name || !company || phoneDigits.length < 8 || phoneDigits.length > 15) {
    return Response.json({ error: 'Missing or invalid required fields' }, { status: 400 });
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    return Response.json(
      { error: 'No lead destination configured. Set LEAD_WEBHOOK_URL in the Vercel project.' },
      { status: 501 },
    );
  }

  const lead = {
    receivedAt: new Date().toISOString(),
    source: clean(body.source) || 'website',
    name,
    company,
    phone,
    email: clean(body.email),
    revenue: clean(body.revenue),
    fundingNeed: clean(body.fundingNeed),
    message: clean(body.message),
    metadata: body.metadata ?? {},
  };

  try {
    const forwarded = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });

    if (!forwarded.ok) {
      console.error('Lead webhook rejected the submission', forwarded.status);
      return Response.json({ error: 'Delivery failed' }, { status: 502 });
    }
  } catch (error) {
    console.error('Lead webhook unreachable', error);
    return Response.json({ error: 'Delivery failed' }, { status: 502 });
  }

  return Response.json({ ok: true }, { status: 200 });
}
