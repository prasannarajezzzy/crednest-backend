import { siteConfig } from '../content/site';

export type LeadPayload = {
  source: string;
  name: string;
  company: string;
  email?: string;
  phone: string;
  revenue?: string;
  fundingNeed?: string;
  message?: string;
  metadata?: Record<string, string | number | boolean>;
};

/** Form name Netlify registers at build time. Must match the detection form in index.html. */
export const NETLIFY_FORM_NAME = 'crednest-lead';

async function submitToNetlify(payload: LeadPayload): Promise<'submitted'> {
  const { metadata, ...fields } = payload;
  const body = new URLSearchParams({ 'form-name': NETLIFY_FORM_NAME });

  Object.entries(fields).forEach(([key, value]) => {
    if (value) body.append(key, String(value));
  });
  if (metadata && Object.keys(metadata).length) {
    body.append('metadata', JSON.stringify(metadata));
  }

  // Netlify accepts submissions posted to any path on the site as urlencoded data.
  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error('We could not submit your details. Please try again.');
  }

  return 'submitted';
}

async function postJson(url: string, payload: LeadPayload): Promise<'submitted'> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    // 501 means the destination exists but has no webhook configured yet. Say so
    // rather than blaming the visitor for a setup step they cannot see.
    if (response.status === 501) {
      throw new Error('Lead delivery is not configured yet. Please call or email us instead.');
    }
    throw new Error('We could not submit your details. Please try again.');
  }

  return 'submitted';
}

export async function submitLead(payload: LeadPayload): Promise<'demo' | 'submitted'> {
  // An explicit endpoint wins when configured, so this works on any host.
  if (siteConfig.leadEndpoint) {
    return postJson(siteConfig.leadEndpoint, payload);
  }

  // Same-origin server endpoints: no CORS preflight, and the real destination
  // stays server-side instead of sitting in the public bundle.
  if (siteConfig.leadMode === 'php') {
    return postJson('/api/lead.php', payload);
  }

  if (siteConfig.leadMode === 'vercel') {
    return postJson('/api/lead', payload);
  }

  if (siteConfig.leadMode === 'netlify') {
    return submitToNetlify(payload);
  }

  // TODO(CredNest): Build with VITE_LEAD_MODE=php for Hostinger, or point
  // VITE_LEAD_ENDPOINT at a webhook, to start delivering leads.
  console.info('[CredNest TODO: no lead destination configured] Lead captured in demo mode', payload);
  await new Promise((resolve) => window.setTimeout(resolve, 450));
  return 'demo';
}
