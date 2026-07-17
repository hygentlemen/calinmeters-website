'use client';

import { useId, useState } from 'react';
import { faqCategories } from '@/data/faq';

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const answerId = useId();

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={answerId}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition"
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div id={answerId} className="px-5 pb-4 text-gray-600 leading-relaxed text-sm border-t border-gray-100 pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FaqSection() {
  const [activeTopic, setActiveTopic] = useState(0);

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">Expert answers to common questions about our products</p>
        </div>

        {/* Topic tabs */}
        <div className="flex gap-2 mb-8 flex-wrap justify-center">
          {faqCategories.map((cat, i) => (
            <button
              key={cat.topic}
              type="button"
              onClick={() => setActiveTopic(i)}
              aria-pressed={activeTopic === i}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTopic === i
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat.topic}
            </button>
          ))}
        </div>

        {/* FAQ items */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqCategories[activeTopic]?.items.map((item, i) => (
            <FaqItem key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
