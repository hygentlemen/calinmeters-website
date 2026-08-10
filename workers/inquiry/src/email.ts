import { Resend } from 'resend';
import type { InquiryPayload } from './types';

type EmailEnv = Pick<Env, 'RESEND_API_KEY' | 'RESEND_FROM' | 'INQUIRY_RECIPIENT'>;

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function subjectText(value: string) {
  return value.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 70);
}

function nonEmptyRows(rows: Array<[string, string]>) {
  return rows.filter(([, value]) => value.trim().length > 0);
}

export function renderInquiryEmail(payload: InquiryPayload) {
  const product = payload.productName || payload.productId || payload.productCategory;
  const quantity = payload.quantity || payload.estimatedQuantity;
  const details = nonEmptyRows([
    ['Name', payload.contactName],
    ['Company', payload.company],
    ['Country', payload.country],
    ['Email', payload.email],
    ['Phone / WhatsApp', payload.phone || payload.whatsapp],
    ['Job Role', payload.jobRole],
    ['Buyer Type', payload.buyerType],
    ['Product', product],
    ['Product ID', payload.productId],
    ['Product Category', payload.productCategory],
    ['Quantity', quantity],
    ['Subject', payload.subject],
    ['Application', payload.application],
    ['Technical Requirements', payload.technicalRequirements],
    ['STS Vending Status', payload.vendingStatus],
    ['Target Period', payload.targetPeriod],
    ['Notes', payload.notes],
  ]);
  const metadata = nonEmptyRows([
    ['Source Page', payload.sourcePage],
    ['Product URL', payload.productUrl],
    ['Submitted At', payload.submittedAt],
  ]);
  const text = [
    'New Inquiry from CalinMeters.com',
    '',
    ...details.map(([label, value]) => `${label}: ${value}`),
    '',
    'Message:',
    payload.message,
    '',
    ...metadata.map(([label, value]) => `${label}: ${value}`),
    '',
    '--------------------',
    'Reply directly to this email to contact the customer.',
    '--------------------',
  ].join('\n');

  const rows = details.map(([label, value]) => `
    <tr>
      <th align="left" style="padding:8px;border:1px solid #dbe2ea;background:#f8fafc">${escapeHtml(label)}</th>
      <td style="padding:8px;border:1px solid #dbe2ea;white-space:pre-wrap">${escapeHtml(value)}</td>
    </tr>`).join('');
  const metadataRows = metadata.map(([label, value]) => `
    <tr>
      <th align="left" style="padding:8px;border:1px solid #dbe2ea;background:#f8fafc">${escapeHtml(label)}</th>
      <td style="padding:8px;border:1px solid #dbe2ea;white-space:pre-wrap">${escapeHtml(value)}</td>
    </tr>`).join('');

  return {
    text,
    html: `
      <h1 style="font:600 20px Arial,sans-serif">New Inquiry from CalinMeters.com</h1>
      <table style="border-collapse:collapse;font:14px Arial,sans-serif">${rows}</table>
      <h2 style="font:600 16px Arial,sans-serif;margin-top:24px">Message</h2>
      <div style="white-space:pre-wrap;font:14px/1.6 Arial,sans-serif">${escapeHtml(payload.message)}</div>
      <table style="border-collapse:collapse;font:14px Arial,sans-serif;margin-top:24px">${metadataRows}</table>
      <p style="font:14px Arial,sans-serif;margin-top:24px;border-top:1px solid #dbe2ea;padding-top:16px">Reply directly to this email to contact the customer.</p>
    `,
  };
}

export async function sendInquiryEmail(
  payload: InquiryPayload,
  env: EmailEnv,
  resend: Resend = new Resend(env.RESEND_API_KEY),
): Promise<{ ok: true } | { ok: false; code: 'delivery_failed' }> {
  const content = renderInquiryEmail(payload);

  try {
    const { error } = await resend.emails.send({
      from: env.RESEND_FROM,
      to: [env.INQUIRY_RECIPIENT],
      replyTo: payload.email,
      subject: `New Website Inquiry | ${subjectText(payload.company || payload.contactName)} | ${subjectText(payload.country || 'Country not provided')}`,
      text: content.text,
      html: content.html,
    });
    return error ? { ok: false, code: 'delivery_failed' } : { ok: true };
  } catch {
    return { ok: false, code: 'delivery_failed' };
  }
}
