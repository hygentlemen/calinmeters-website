'use client';

import { trackEvent } from '@/components/GoogleAnalytics';
import { site } from '@/lib/site';

interface InquiryCtaProps {
  topic: string;
  description: string;
  locale?: 'en' | 'fr';
  productId?: string;
}

export function InquiryCta({
  topic,
  description,
  locale = 'en',
  productId,
}: InquiryCtaProps) {
  const isFrench = locale === 'fr';
  const emailSubject = isFrench
    ? `Demande CalinMeters : ${topic}`
    : `CalinMeters inquiry: ${topic}`;
  const whatsappText = isFrench
    ? `Bonjour, je souhaite discuter de ${topic}.`
    : `Hello, I would like to discuss ${topic}.`;
  const quoteHref = productId
    ? `/fr/?product=${encodeURIComponent(productId)}#contact`
    : '/fr/#contact';

  return (
    <section className="rounded-2xl bg-gradient-to-br from-primary-800 to-slate-950 px-6 py-10 text-white shadow-xl sm:px-10">
      <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-200">
            {isFrench ? 'Demande de projet' : 'Project inquiry'}
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            {isFrench ? `Étudier ${topic}` : `Discuss ${topic}`}
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-200">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          {isFrench ? (
            <a
              href={quoteHref}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 py-3 font-semibold text-primary-800 transition hover:bg-primary-50"
            >
              Demander un devis
            </a>
          ) : null}
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent(emailSubject)}`}
            onClick={() => isFrench && trackEvent('fr_email_click', {
              interface_language: 'fr',
              product_id: productId ?? 'not_selected',
              source_context: 'catalog_cta',
              source_page: window.location.pathname,
            })}
            className={`inline-flex min-h-12 items-center justify-center rounded-lg px-5 py-3 font-semibold transition ${
              isFrench
                ? 'border border-white/40 text-white hover:bg-white/10'
                : 'bg-white text-primary-800 hover:bg-primary-50'
            }`}
          >
            {isFrench ? 'Envoyer les exigences par e-mail' : 'Email product requirements'}
          </a>
          <a
            href={`${site.whatsappUrl}?text=${encodeURIComponent(whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => isFrench && trackEvent('fr_whatsapp_click', {
              interface_language: 'fr',
              product_id: productId ?? 'not_selected',
              source_context: 'catalog_cta',
              source_page: window.location.pathname,
            })}
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/40 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            {isFrench ? 'Contacter par WhatsApp' : 'Contact on WhatsApp'}
          </a>
        </div>
      </div>
    </section>
  );
}
