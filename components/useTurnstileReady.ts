'use client';

import { useCallback, useEffect, useState } from 'react';

export const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export function useTurnstileReady() {
  const [scriptReady, setScriptReady] = useState(false);
  const markReady = useCallback(() => {
    if (window.turnstile) setScriptReady(true);
  }, []);

  useEffect(() => {
    markReady();
    // Next 14 can mark a shared script cached while its first request is still
    // pending. Keep a load listener for navigation before that request finishes.
    const script = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SCRIPT_URL}"]`);
    script?.addEventListener('load', markReady);
    return () => script?.removeEventListener('load', markReady);
  }, [markReady]);

  return { scriptReady, markReady };
}
