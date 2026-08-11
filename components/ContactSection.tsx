'use client';

import Script from 'next/script';
import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { trackEvent } from '@/components/GoogleAnalytics';
import { site } from '@/lib/site';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

declare global {
  interface Window {
    turnstile?: {
      render: (
        target: HTMLElement,
        options: {
          sitekey: string;
          action: string;
          language: string;
          callback: (token: string) => void;
          'expired-callback': () => void;
          'error-callback': () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

function sourceContext() {
  const parameters = new URLSearchParams(window.location.search);
  const requestedSource = parameters.get('source');

  try {
    const resolved = new URL(requestedSource || window.location.pathname, site.url);
    if (
      resolved.protocol === 'https:'
      && (resolved.hostname === 'calinmeters.com' || resolved.hostname === 'www.calinmeters.com')
    ) {
      resolved.hash = '';
      resolved.search = '';
      return resolved.toString();
    }
  } catch {
    // Fall back to the current canonical site path below.
  }

  return new URL(window.location.pathname, site.url).toString();
}

function Field({
  id,
  label,
  type = 'text',
  required = false,
  maxLength,
  autoComplete,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'tel';
  required?: boolean;
  maxLength: number;
  autoComplete?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-semibold text-white" htmlFor={id}>
      {label}{required ? <span aria-hidden="true"> *</span> : null}
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        className="mt-2 min-h-12 w-full rounded-lg border border-white/30 bg-white/20 px-4 py-3 font-normal text-white placeholder-white/60 outline-none transition focus:border-white focus:ring-2 focus:ring-white/30"
      />
    </label>
  );
}

export default function ContactSection() {
  const endpoint = process.env.NEXT_PUBLIC_INQUIRY_ENDPOINT;
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const formRef = useRef<HTMLFormElement>(null);
  const submittingRef = useRef(false);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>();
  const [scriptReady, setScriptReady] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [productName, setProductName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [statusKind, setStatusKind] = useState<'success' | 'error'>();

  useEffect(() => {
    const requestedProduct = new URLSearchParams(window.location.search).get('productName');
    if (requestedProduct && requestedProduct.length <= 200) setProductName(requestedProduct);
  }, []);

  const renderTurnstile = useCallback(() => {
    if (
      !scriptReady
      || !siteKey
      || !window.turnstile
      || !turnstileContainerRef.current
      || widgetIdRef.current
    ) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: siteKey,
      action: 'en_inquiry',
      language: 'en',
      callback: setTurnstileToken,
      'expired-callback': () => setTurnstileToken(''),
      'error-callback': () => {
        setTurnstileToken('');
        setStatusKind('error');
        setStatus('Security verification failed. Please try again.');
      },
    });
  }, [scriptReady, siteKey]);

  useEffect(() => {
    renderTurnstile();
  }, [renderTurnstile]);

  function resetChallenge() {
    setTurnstileToken('');
    if (window.turnstile && widgetIdRef.current) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    setStatus('');
    setStatusKind(undefined);
    const formData = new FormData(event.currentTarget);
    const contactName = String(formData.get('contactName') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();

    if (!contactName || !email || !message) {
      setStatusKind('error');
      setStatus('Please complete your name, email, and message before sending.');
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setStatusKind('error');
      setStatus('Please enter a valid email address.');
      return;
    }
    if (!turnstileToken) {
      setStatusKind('error');
      setStatus('Please complete the security verification.');
      return;
    }

    const payload = Object.fromEntries(formData.entries());
    const productId = new URLSearchParams(window.location.search).get('product') ?? '';
    const sourcePage = sourceContext();
    const sourcePath = new URL(sourcePage).pathname;
    submittingRef.current = true;
    setSubmitting(true);

    try {
      const response = await fetch(endpoint!, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: AbortSignal.timeout(15_000),
        body: JSON.stringify({
          ...payload,
          contactName,
          email,
          message,
          productId,
          productName,
          productUrl: sourcePath.startsWith('/products/') ? sourcePage : '',
          sourcePage,
          language: 'en',
          turnstileToken,
        }),
      });
      const result = await response.json().catch(() => null) as {
        ok?: boolean;
        code?: string;
      } | null;

      if (response.ok && result?.ok) {
        formRef.current?.reset();
        setStatusKind('success');
        setStatus('Thank you for your inquiry. Our team will contact you shortly.');
        trackEvent('contact_form_submit', { result: 'success', source_page: sourcePath });
        resetChallenge();
        return;
      }

      resetChallenge();
      setStatusKind('error');
      if (response.status === 429 || result?.code === 'rate_limited') {
        setStatus(`Too many attempts. Please try again later or email us at ${site.email}.`);
        trackEvent('contact_form_submit', { result: 'rate_limited', source_page: sourcePath });
      } else if (response.status === 400 || result?.code === 'invalid_payload') {
        setStatus('Please check the required fields and email address, then try again.');
        trackEvent('contact_form_submit', { result: 'validation_error', source_page: sourcePath });
      } else {
        setStatus(`Something went wrong. Please try again or email us at ${site.email}.`);
        trackEvent('contact_form_submit', { result: 'server_error', source_page: sourcePath });
      }
    } catch {
      resetChallenge();
      setStatusKind('error');
      setStatus(`Something went wrong. Please try again or email us at ${site.email}.`);
      trackEvent('contact_form_submit', { result: 'server_error', source_page: sourcePath });
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  const formAvailable = Boolean(endpoint && siteKey);

  return (
    <section id="contact" className="bg-gradient-to-r from-primary-700 to-primary-900 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Get in Touch</h2>
          <p className="text-xl text-primary-100">Ready to discuss your metering needs?</p>
        </div>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h3 className="mb-6 text-2xl font-bold">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <svg aria-hidden="true" className="mt-1 h-6 w-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold">Address</h4>
                  <p className="text-primary-100">{site.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <svg aria-hidden="true" className="mt-1 h-6 w-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <h4 className="font-semibold">Phone</h4>
                  <a href={`tel:${site.phone}`} className="text-primary-100 underline-offset-4 hover:underline">{site.phone}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <svg aria-hidden="true" className="mt-1 h-6 w-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <div>
                  <h4 className="font-semibold">WhatsApp / WeChat</h4>
                  <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('contact_click', { method: 'whatsapp', source_page: window.location.pathname })} className="text-primary-100 underline-offset-4 hover:underline">
                    {site.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <svg aria-hidden="true" className="mt-1 h-6 w-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <a href={`mailto:${site.email}`} onClick={() => trackEvent('contact_click', { method: 'email', source_page: window.location.pathname })} className="text-primary-100 underline-offset-4 hover:underline">
                    {site.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/10 p-6 backdrop-blur sm:p-8">
            <h3 className="mb-2 text-2xl font-bold">Send us a Message</h3>
            <p className="mb-6 text-sm leading-6 text-primary-100">Send your requirements securely. Required fields are marked with an asterisk.</p>
            {formAvailable ? (
              <>
                <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onLoad={() => setScriptReady(true)} />
                <form ref={formRef} className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="contactName" label="Your Name" required maxLength={120} autoComplete="name" />
                    <Field id="email" label="Your Email" type="email" required maxLength={254} autoComplete="email" />
                    <Field id="company" label="Company" maxLength={160} autoComplete="organization" />
                    <Field id="country" label="Country" maxLength={80} autoComplete="country-name" />
                    <Field id="phone" label="Phone / WhatsApp" type="tel" maxLength={40} autoComplete="tel" />
                    <Field id="quantity" label="Estimated Quantity" maxLength={80} />
                    <div className="sm:col-span-2">
                      <Field id="productName" label="Product" maxLength={200} value={productName} onChange={setProductName} />
                    </div>
                  </div>
                  <label className="block text-sm font-semibold text-white" htmlFor="message">
                    Your Message <span aria-hidden="true">*</span>
                    <textarea id="message" name="message" required rows={5} maxLength={4000} className="mt-2 w-full rounded-lg border border-white/30 bg-white/20 px-4 py-3 font-normal text-white placeholder-white/60 outline-none transition focus:border-white focus:ring-2 focus:ring-white/30" />
                  </label>
                  <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
                    <label htmlFor="contact-website">Website</label>
                    <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" maxLength={200} />
                  </div>
                  <div className="min-h-[70px]" ref={turnstileContainerRef} />
                  {status ? (
                    <p role={statusKind === 'error' ? 'alert' : 'status'} aria-live="polite" className={`rounded-lg border px-4 py-3 text-sm ${statusKind === 'success' ? 'border-green-200/50 bg-green-950/30 text-green-50' : 'border-red-200/50 bg-red-950/30 text-red-50'}`}>
                      {status}
                    </p>
                  ) : null}
                  <button type="submit" disabled={submitting} className="w-full rounded-lg bg-white py-3 font-semibold text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60">
                    {submitting ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </form>
              </>
            ) : (
              <div className="rounded-lg border border-white/30 bg-white/10 p-5 text-sm leading-7 text-primary-50">
                The secure inquiry form is being configured. Please email us at{' '}
                <a href={`mailto:${site.email}`} className="font-semibold underline">{site.email}</a>{' '}
                or contact us on WhatsApp.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
