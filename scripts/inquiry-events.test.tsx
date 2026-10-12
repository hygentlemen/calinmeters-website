import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import FrenchInquiryForm from '../components/FrenchInquiryForm';
import ContactSection from '../components/ContactSection';

// The DOM never loads remote resources. fetch, Turnstile and gtag stay local.
test('real form event handlers classify results without sending customer data', async () => {
  process.env.NEXT_PUBLIC_INQUIRY_ENDPOINT = 'https://worker.example/v1/inquiries';
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = 'test-site-key';
  for (const language of ['fr', 'en'] as const) {
    for (const scenario of ['native_invalid', 'challenge_missing', 'success', 'honeypot', 'challenge_failed', 'rate_limited', 'invalid_payload', 'delivery_failed', 'network_error'] as const) {
      const dom = new JSDOM('<div id="root"></div>', {
        url: `https://calinmeters.com/${language === 'fr' ? 'fr/' : ''}?product=water-multi-jet-brass`,
      });
      const { window } = dom;
      Object.assign(globalThis, { window, document: window.document, FormData: window.FormData, IS_REACT_ACT_ENVIRONMENT: true });
      const events: Array<{ name: string; params: Record<string, unknown> }> = [];
      window.gtag = (_command: unknown, name: unknown, params: unknown) => events.push({ name: String(name), params: params as Record<string, unknown> });
      let networkCalls = 0;
      globalThis.fetch = async () => {
        networkCalls += 1;
        if (scenario === 'network_error') throw new TypeError('synthetic offline');
        const outcome = {
          challenge_failed: [400, 'turnstile_failed'], rate_limited: [429, 'rate_limited'],
          invalid_payload: [400, 'invalid_payload'], delivery_failed: [503, 'delivery_failed'],
        }[scenario as string];
        return new Response(JSON.stringify(outcome ? { ok: false, code: outcome[1] } : { ok: true }), { status: outcome ? Number(outcome[0]) : 200 });
      };
      let renderCalls = 0;
      window.turnstile = {
        render: (_target, options) => {
          renderCalls += 1;
          if (scenario !== 'challenge_missing') options.callback('synthetic-token');
          return 'synthetic-widget';
        },
        reset: () => {},
      };
      const root = createRoot(window.document.getElementById('root')!);
      try {
        await act(async () => { root.render(language === 'fr' ? <FrenchInquiryForm /> : <ContactSection />); });
        await act(async () => {
          window.document.querySelectorAll('script').forEach(script => script.dispatchEvent(new window.Event('load')));
        });
        assert.equal(renderCalls, 1, `${language}/${scenario}: challenge initializes, including cached-script remounts`);
        const form = window.document.querySelector('form')!;
        const startName = language === 'fr' ? 'fr_quote_start' : 'contact_form_start';
        const submitName = language === 'fr' ? 'fr_quote_submit' : 'contact_form_submit';
        if (scenario !== 'native_invalid') {
          await act(async () => {
            form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[required],textarea[required]').forEach(input => {
              input.value = input.type === 'email' ? 'private-test@example.com' : 'PRIVATE_TEST_VALUE';
              input.dispatchEvent(new window.Event('input', { bubbles: true }));
            });
            form.querySelectorAll<HTMLSelectElement>('select[required]').forEach(select => {
              select.value = select.id === 'productCategory' ? 'water' : select.options[1].value;
              select.dispatchEvent(new window.Event('change', { bubbles: true }));
            });
          });
        }
        if (scenario === 'honeypot') form.querySelector<HTMLInputElement>('input[name="website"]')!.value = 'synthetic-spam';
        await act(async () => { form.requestSubmit(); });
        assert.equal(events.filter(e => e.name === startName).length, 1, `${language}/${scenario}: one start`);
        const submits = events.filter(e => e.name === submitName);
        if (scenario === 'honeypot') {
          assert.equal(submits.length, 0, `${language}: honeypot false success excluded`);
          assert.ok(window.document.querySelector('[role="status"]'), 'visitor-facing success is retained');
        } else {
          const expected = { native_invalid: 'validation_error', challenge_missing: 'challenge_error', success: 'success', challenge_failed: 'challenge_error', rate_limited: 'rate_limited', invalid_payload: 'validation_error', delivery_failed: 'server_error', network_error: 'server_error' }[scenario];
          assert.deepEqual(submits.map(e => e.params.result), [expected], `${language}/${scenario}`);
          if (language === 'fr') {
            assert.equal(submits[0].params.product_id, 'water-multi-jet-brass');
            if (scenario !== 'native_invalid') assert.equal(submits[0].params.buyer_type, 'distributor');
          }
        }
        assert.equal(networkCalls, ['native_invalid', 'challenge_missing'].includes(scenario) ? 0 : 1);
        assert.doesNotMatch(JSON.stringify(events), /PRIVATE_TEST_VALUE|private-test@|synthetic-token|synthetic-spam/);
        if (scenario === 'native_invalid') {
          await new Promise(resolve => setTimeout(resolve, 1));
          await act(async () => { form.requestSubmit(); });
          assert.equal(events.filter(e => e.name === submitName).length, 2, 'a second invalid attempt is counted once');
          assert.equal(events.filter(e => e.name === startName).length, 1, 'start remains once per mount');
        }
      } finally {
        await act(async () => { root.unmount(); });
        dom.window.close();
      }
    }
  }
});
