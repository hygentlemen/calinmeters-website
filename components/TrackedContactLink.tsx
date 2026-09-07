'use client';

import type { ComponentProps } from 'react';
import { trackEvent } from '@/components/GoogleAnalytics';

type Props = ComponentProps<'a'> & {
  locale: 'en' | 'fr';
  method: 'email' | 'whatsapp';
  sourceContext: string;
};

export function TrackedContactLink({ locale, method, sourceContext, ...props }: Props) {
  return <a {...props} onClick={() => trackEvent(`${locale === 'fr' ? 'fr_' : ''}${method}_click`, {
    interface_language: locale,
    source_context: sourceContext,
    source_page: window.location.pathname,
  })} />;
}
