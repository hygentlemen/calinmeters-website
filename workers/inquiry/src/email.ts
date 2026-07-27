import type { InquiryPayload } from './types';

type EmailEnv = Pick<Env, 'RESEND_API_KEY' | 'RESEND_FROM' | 'INQUIRY_RECIPIENT'>;

const LABELS: Array<[keyof InquiryPayload, string]> = [
  ['country', 'Pays'],
  ['company', 'Entreprise'],
  ['contactName', 'Contact'],
  ['jobRole', 'Fonction'],
  ['email', 'E-mail'],
  ['whatsapp', 'WhatsApp'],
  ['buyerType', 'Type de client'],
  ['productCategory', 'Produit'],
  ['productId', 'Modèle source'],
  ['application', 'Application'],
  ['estimatedQuantity', 'Quantité estimée'],
  ['technicalRequirements', 'Exigences techniques'],
  ['vendingStatus', 'Système de vente STS'],
  ['targetPeriod', 'Période cible'],
  ['notes', 'Notes'],
  ['sourcePage', 'Page source'],
];

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function subjectText(value: string) {
  return value.replace(/\s+/g, ' ').trim().slice(0, 100);
}

export function renderInquiryEmail(payload: InquiryPayload) {
  const text = [
    'Nouvelle demande depuis le site français CalinMeters',
    '',
    ...LABELS.map(([key, label]) => `${label}: ${payload[key]}`),
  ].join('\n');

  const rows = LABELS.map(([key, label]) => `
    <tr>
      <th align="left" style="padding:8px;border:1px solid #dbe2ea;background:#f8fafc">${escapeHtml(label)}</th>
      <td style="padding:8px;border:1px solid #dbe2ea;white-space:pre-wrap">${escapeHtml(String(payload[key]))}</td>
    </tr>`).join('');

  return {
    text,
    html: `
      <h1 style="font:600 20px Arial,sans-serif">Nouvelle demande depuis le site français CalinMeters</h1>
      <table style="border-collapse:collapse;font:14px Arial,sans-serif">${rows}</table>
    `,
  };
}

export async function sendInquiryEmail(
  payload: InquiryPayload,
  env: EmailEnv,
  fetchImpl: typeof fetch = fetch,
): Promise<{ ok: true } | { ok: false; code: 'delivery_failed' }> {
  const content = renderInquiryEmail(payload);

  try {
    const response = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        'content-type': 'application/json',
        'user-agent': 'calinmeters-inquiry-worker/1.0',
      },
      signal: AbortSignal.timeout(8_000),
      body: JSON.stringify({
        from: env.RESEND_FROM,
        to: [env.INQUIRY_RECIPIENT],
        reply_to: payload.email,
        subject: `[FR] ${payload.productCategory} inquiry - ${subjectText(payload.country)} - ${subjectText(payload.company)}`,
        text: content.text,
        html: content.html,
      }),
    });
    return response.ok ? { ok: true } : { ok: false, code: 'delivery_failed' };
  } catch {
    return { ok: false, code: 'delivery_failed' };
  }
}
