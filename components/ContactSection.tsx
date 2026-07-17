'use client';

import { FormEvent, useState } from 'react';
import { trackEvent } from '@/components/GoogleAnalytics';
import { site } from '@/lib/site';

const recipientEmail = site.email;

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setStatus('Please complete your name, email, and message before sending.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setStatus('Please enter a valid email address.');
      return;
    }

    const subject = `Website inquiry from ${trimmedName}`;
    const body = [
      `Name: ${trimmedName}`,
      `Email: ${trimmedEmail}`,
      '',
      'Message:',
      trimmedMessage,
      '',
      `Source page: ${window.location.href}`,
      `Submitted at: ${new Date().toLocaleString()}`,
    ].join('\n');

    window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus(`Your email app is opening. If nothing happens, please email ${recipientEmail} directly.`);
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-r from-primary-700 to-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-xl text-primary-100">Ready to discuss your metering needs?</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold">Address</h4>
                  <p className="text-primary-100">Floor 6, Bd A1, Qiaode Tech Park, Kelian Rd, Guang Ming District Shenzhen, China</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <h4 className="font-semibold">Phone</h4>
                  <a href={`tel:${site.phone}`} className="text-primary-100 underline-offset-4 hover:underline">{site.phone}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <div>
                  <h4 className="font-semibold">WhatsApp / WeChat</h4>
                  <a
                    href={site.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('contact_click', { method: 'whatsapp', source_page: window.location.pathname })}
                    className="text-primary-100 underline-offset-4 hover:underline"
                  >
                    {site.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <a
                    href={`mailto:${recipientEmail}`}
                    onClick={() => trackEvent('contact_click', { method: 'email', source_page: window.location.pathname })}
                    className="text-primary-100 underline-offset-4 hover:underline"
                  >
                    {recipientEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
            <p className="mb-5 text-sm leading-6 text-primary-100">This form opens your email application. It does not upload or store your message on this website.</p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="contact-name" className="sr-only">Your name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/20 placeholder-white/60 border border-white/30 focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="sr-only">Your email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/20 placeholder-white/60 border border-white/30 focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="sr-only">Your project requirements</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Your Message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/20 placeholder-white/60 border border-white/30 focus:outline-none focus:border-white"
                />
              </div>
              {status && (
                <p className="rounded-lg bg-white/15 px-4 py-3 text-sm text-primary-50" role="status" aria-live="polite">
                  {status}
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-white text-primary-700 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
              >
                Open Email App
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
