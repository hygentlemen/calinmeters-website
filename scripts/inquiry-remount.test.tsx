import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import ContactSection from '../components/ContactSection';
import FrenchInquiryForm from '../components/FrenchInquiryForm';

test('navigation during a pending shared script initializes only the current form when it loads', async () => {
  process.env.NEXT_PUBLIC_INQUIRY_ENDPOINT = 'https://worker.example/v1/inquiries';
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = 'test-site-key';
  const dom = new JSDOM('<div id="root"></div>', { url: 'https://calinmeters.com/' });
  const { window } = dom;
  Object.assign(globalThis, { window, document: window.document, IS_REACT_ACT_ENVIRONMENT: true });
  const root = createRoot(window.document.getElementById('root')!);
  const rendered: Array<{ target: HTMLElement; action: string }> = [];
  try {
    await act(async () => { root.render(<ContactSection key="first" />); });
    await act(async () => { root.render(<FrenchInquiryForm key="second" />); });
    await act(async () => { root.render(<ContactSection key="third" />); });
    const scripts = window.document.querySelectorAll('script[src*="turnstile"]');
    assert.equal(scripts.length, 1, 'navigation reuses the one pending request');
    window.turnstile = {
      render: (target, options) => {
        rendered.push({ target, action: options.action });
        options.callback('local-test-token');
        return String(rendered.length);
      },
      reset: () => {},
    };
    await act(async () => { scripts[0].dispatchEvent(new window.Event('load')); });
    assert.equal(rendered.length, 1);
    assert.equal(rendered[0].action, 'en_inquiry');
    assert.equal(rendered[0].target.isConnected, true, 'do not initialize an unmounted form');
    await act(async () => { root.render(<FrenchInquiryForm key="fourth" />); });
    assert.equal(rendered.length, 2, 'cached ready script initializes French on remount');
    assert.equal(rendered[1].action, 'fr_inquiry');
    assert.equal(rendered[1].target.isConnected, true);
    await act(async () => { root.render(<ContactSection key="fifth" />); });
    assert.equal(rendered.length, 3, 'cached ready script initializes English on return');
    assert.equal(rendered[2].action, 'en_inquiry');
  } finally {
    await act(async () => { root.unmount(); });
    dom.window.close();
  }
});
