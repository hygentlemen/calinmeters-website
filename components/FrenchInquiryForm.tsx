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

const BUYER_TYPES = [
  ['distributor', 'Distributeur'],
  ['integrator', 'Intégrateur'],
  ['engineering_company', "Entreprise d'ingénierie"],
  ['utility', 'Service public'],
  ['property_operator', 'Gestionnaire immobilier'],
  ['industrial', 'Client industriel'],
  ['other', 'Autre'],
] as const;

const PRODUCT_CATEGORIES = [
  ['electricity', 'Compteur électrique prépayé STS'],
  ['water', "Compteur d'eau prépayé STS"],
] as const;

const VENDING_STATUSES = [
  ['existing', 'Système existant'],
  ['needed', 'Système requis'],
  ['unknown', 'À confirmer'],
] as const;

const PRODUCT_FAMILIES = {
  'ca168-lorawan': 'electricity',
  'ca168-gprs': 'electricity',
  'ca168-sts': 'electricity',
  'ca368-gprs': 'electricity',
  'ca368-sts': 'electricity',
  'water-multi-jet-plastic': 'water',
  'water-multi-jet-brass': 'water',
  'water-ultrasonic': 'water',
} as const;

type ProductCategory = '' | (typeof PRODUCT_CATEGORIES)[number][0];
type BuyerType = '' | (typeof BUYER_TYPES)[number][0];
type SubmitResult =
  | 'success'
  | 'validation_error'
  | 'challenge_error'
  | 'rate_limited'
  | 'server_error';

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

function TextField({
  id,
  label,
  type = 'text',
  autoComplete,
  maxLength,
}: {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'tel';
  autoComplete?: string;
  maxLength: number;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-800" htmlFor={id}>
      {label} <span aria-hidden="true" className="text-red-600">*</span>
      <input
        id={id}
        name={id}
        type={type}
        required
        autoComplete={autoComplete}
        maxLength={maxLength}
        className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-950 shadow-sm outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-200"
      />
    </label>
  );
}

function TextAreaField({
  id,
  label,
  required = true,
  rows = 4,
  maxLength,
}: {
  id: string;
  label: string;
  required?: boolean;
  rows?: number;
  maxLength: number;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-800" htmlFor={id}>
      {label}{' '}
      {required ? <span aria-hidden="true" className="text-red-600">*</span> : null}
      <textarea
        id={id}
        name={id}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-950 shadow-sm outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-200"
      />
    </label>
  );
}

function DirectContactFallback({ compact = false }: { compact?: boolean }) {
  const whatsappText = [
    'Bonjour CalinMeters,',
    '',
    'Pays :',
    'Entreprise :',
    'Produit recherché :',
    'Quantité estimée :',
    'Application :',
    'Communication requise :',
    'Délai du projet :',
  ].join('\n');

  return (
    <div className={compact ? 'mt-4 flex flex-wrap gap-3' : 'mt-6 flex flex-wrap gap-3'}>
      <a
        href={`mailto:${site.email}?subject=${encodeURIComponent('Demande de projet de comptage prépayé STS')}`}
        onClick={() => trackEvent('fr_email_click', {
          interface_language: 'fr',
          source_context: 'form_fallback',
          source_page: window.location.pathname,
        })}
        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-primary-700 px-4 py-2.5 text-sm font-semibold text-primary-800 transition hover:bg-primary-50"
      >
        Envoyer un e-mail
      </a>
      <a
        href={`${site.whatsappUrl}?text=${encodeURIComponent(whatsappText)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('fr_whatsapp_click', {
          interface_language: 'fr',
          source_context: 'form_fallback',
          source_page: window.location.pathname,
        })}
        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-green-700 px-4 py-2.5 text-sm font-semibold text-green-800 transition hover:bg-green-50"
      >
        Contacter par WhatsApp
      </a>
    </div>
  );
}

export default function FrenchInquiryForm() {
  const endpoint = process.env.NEXT_PUBLIC_INQUIRY_ENDPOINT;
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const formRef = useRef<HTMLFormElement>(null);
  const submittingRef = useRef(false);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>();
  const startedRef = useRef(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [productId, setProductId] = useState('');
  const [productCategory, setProductCategory] = useState<ProductCategory>('');
  const [buyerType, setBuyerType] = useState<BuyerType>('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageKind, setMessageKind] = useState<'success' | 'error'>();

  useEffect(() => {
    const requestedProduct = new URLSearchParams(window.location.search).get('product');
    if (requestedProduct && requestedProduct in PRODUCT_FAMILIES) {
      const allowedProduct = requestedProduct as keyof typeof PRODUCT_FAMILIES;
      setProductId(allowedProduct);
      setProductCategory(PRODUCT_FAMILIES[allowedProduct]);
    }
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
      action: 'fr_inquiry',
      language: 'fr',
      callback: setTurnstileToken,
      'expired-callback': () => setTurnstileToken(''),
      'error-callback': () => {
        setTurnstileToken('');
        setMessageKind('error');
        setMessage('La vérification a échoué. Veuillez réessayer.');
      },
    });
  }, [scriptReady, siteKey]);

  useEffect(() => {
    renderTurnstile();
  }, [renderTurnstile]);

  function analyticsContext() {
    return {
      interface_language: 'fr',
      product_category: productCategory || 'not_selected',
      product_id: productId || 'not_selected',
      buyer_type: buyerType || 'not_selected',
    };
  }

  function trackStart() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent('fr_quote_start', {
      ...analyticsContext(),
      source_path_group: window.location.pathname.startsWith('/fr/produits/')
        ? 'product'
        : 'home',
    });
  }

  function trackSubmit(result: SubmitResult) {
    trackEvent('fr_quote_submit', {
      ...analyticsContext(),
      result,
    });
  }

  function resetChallenge() {
    setTurnstileToken('');
    if (window.turnstile && widgetIdRef.current) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    setMessage('');
    setMessageKind(undefined);

    if (!turnstileToken) {
      setMessageKind('error');
      setMessage('Veuillez terminer la vérification de sécurité.');
      trackSubmit('challenge_error');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const sourcePage = sourceContext();
    const sourcePath = new URL(sourcePage).pathname;
    const requestedProductName = new URLSearchParams(window.location.search).get('productName') ?? '';
    const productName = requestedProductName.length <= 200 ? requestedProductName : '';
    submittingRef.current = true;
    setSubmitting(true);

    try {
      const response = await fetch(endpoint!, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: AbortSignal.timeout(15_000),
        body: JSON.stringify({
          ...payload,
          message: String(payload.technicalRequirements ?? ''),
          productName,
          productUrl: sourcePath.startsWith('/fr/produits/') ? sourcePage : '',
          sourcePage,
          language: 'fr',
          productId: productId || undefined,
          turnstileToken,
        }),
      });
      const result = await response.json().catch(() => null) as {
        ok?: boolean;
        code?: string;
      } | null;

      if (response.ok && result?.ok) {
        formRef.current?.reset();
        setProductCategory(productId
          ? PRODUCT_FAMILIES[productId as keyof typeof PRODUCT_FAMILIES]
          : '');
        setBuyerType('');
        setMessageKind('success');
        setMessage('Votre demande a été envoyée. Nous vous répondrons par e-mail.');
        trackSubmit('success');
        resetChallenge();
        return;
      }

      resetChallenge();
      setMessageKind('error');
      if (
        result?.code === 'turnstile_failed'
        || result?.code === 'turnstile_unavailable'
      ) {
        setMessage('La vérification de sécurité a échoué. Veuillez la recommencer.');
        trackSubmit('challenge_error');
      } else if (response.status === 429 || result?.code === 'rate_limited') {
        setMessage('Trop de tentatives ont été reçues. Réessayez plus tard ou utilisez le contact direct.');
        trackSubmit('rate_limited');
      } else if (response.status === 400 || result?.code === 'invalid_payload') {
        setMessage('Certaines informations sont incomplètes ou non valides. Vérifiez les champs indiqués et réessayez.');
        trackSubmit('validation_error');
      } else {
        setMessage("La demande n'a pas pu être envoyée. Conservez vos informations et utilisez le contact direct ci-dessous.");
        trackSubmit('server_error');
      }
    } catch {
      resetChallenge();
      setMessageKind('error');
      setMessage("Le service est momentanément indisponible. Conservez vos informations et utilisez le contact direct ci-dessous.");
      trackSubmit('server_error');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  if (!endpoint || !siteKey) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-2xl font-bold text-slate-950">Parlez-nous de votre projet</h3>
        <p className="mt-3 leading-7 text-slate-600">
          Envoyez la catégorie de compteur, les paramètres techniques, la quantité estimée,
          le pays de destination et la période cible. Le formulaire protégé est en cours de
          configuration ; les canaux directs restent disponibles.
        </p>
        <DirectContactFallback />
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        onFocusCapture={trackStart}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="contactName" label="Nom du contact" autoComplete="name" maxLength={120} />
          <TextField id="jobRole" label="Fonction" autoComplete="organization-title" maxLength={120} />
          <TextField id="company" label="Entreprise" autoComplete="organization" maxLength={160} />
          <TextField id="email" label="E-mail professionnel" type="email" autoComplete="email" maxLength={254} />
          <TextField id="whatsapp" label="Numéro WhatsApp" type="tel" autoComplete="tel" maxLength={40} />
          <TextField id="country" label="Pays ou région" autoComplete="country-name" maxLength={80} />

          <label className="block text-sm font-semibold text-slate-800" htmlFor="buyerType">
            Type d&apos;acheteur <span aria-hidden="true" className="text-red-600">*</span>
            <select
              id="buyerType"
              name="buyerType"
              required
              value={buyerType}
              onChange={(event) => setBuyerType(event.target.value as BuyerType)}
              className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-950 shadow-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-200"
            >
              <option value="">Sélectionner</option>
              {BUYER_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>

          <label className="block text-sm font-semibold text-slate-800" htmlFor="productCategory">
            Produit recherché <span aria-hidden="true" className="text-red-600">*</span>
            <select
              id="productCategory"
              name="productCategory"
              required
              value={productCategory}
              onChange={(event) => {
                const nextCategory = event.target.value as ProductCategory;
                setProductCategory(nextCategory);
                if (
                  productId
                  && nextCategory
                  && PRODUCT_FAMILIES[productId as keyof typeof PRODUCT_FAMILIES] !== nextCategory
                ) {
                  setProductId('');
                }
              }}
              className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-950 shadow-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-200"
            >
              <option value="">Sélectionner</option>
              {PRODUCT_CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>

          <div className="sm:col-span-2">
            <TextAreaField id="application" label="Application" rows={3} maxLength={1000} />
          </div>
          <TextField id="estimatedQuantity" label="Quantité estimée" maxLength={80} />
          <TextField id="targetPeriod" label="Période cible du pilote ou de l'achat" maxLength={120} />
          <div className="sm:col-span-2">
            <TextAreaField
              id="technicalRequirements"
              label="Phase/courant ou diamètre, communication et autres exigences"
              maxLength={2000}
            />
          </div>
          <label className="block text-sm font-semibold text-slate-800 sm:col-span-2" htmlFor="vendingStatus">
            Système de vente de crédit STS <span aria-hidden="true" className="text-red-600">*</span>
            <select
              id="vendingStatus"
              name="vendingStatus"
              required
              defaultValue=""
              className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-950 shadow-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-200"
            >
              <option value="">Sélectionner</option>
              {VENDING_STATUSES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <div className="sm:col-span-2">
            <TextAreaField id="notes" label="Notes du projet (facultatif)" required={false} rows={3} maxLength={4000} />
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute -left-[10000px] h-px w-px overflow-hidden"
        >
          <label htmlFor="website">Site web</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            maxLength={200}
          />
        </div>

        <div className="mt-6 min-h-[70px]" ref={turnstileContainerRef} />

        {message ? (
          <p
            role={messageKind === 'error' ? 'alert' : 'status'}
            className={`mt-5 rounded-lg border p-4 text-sm leading-6 ${
              messageKind === 'success'
                ? 'border-green-200 bg-green-50 text-green-900'
                : 'border-red-200 bg-red-50 text-red-900'
            }`}
          >
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-primary-700 px-6 py-3 font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Envoi en cours…' : 'Envoyer la demande de devis'}
        </button>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          Les informations sont utilisées uniquement pour répondre à votre demande de projet.
        </p>
        {messageKind === 'error' ? <DirectContactFallback compact /> : null}
      </form>
    </>
  );
}
