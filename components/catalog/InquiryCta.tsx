import { site } from '@/lib/site';

interface InquiryCtaProps {
  topic: string;
  description: string;
}

export function InquiryCta({ topic, description }: InquiryCtaProps) {
  const emailSubject = `CalinMeters inquiry: ${topic}`;
  const whatsappText = `Hello, I would like to discuss ${topic}.`;

  return (
    <section className="rounded-2xl bg-gradient-to-br from-primary-800 to-slate-950 px-6 py-10 text-white shadow-xl sm:px-10">
      <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-200">Project inquiry</p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Discuss {topic}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-200">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent(emailSubject)}`}
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 py-3 font-semibold text-primary-800 transition hover:bg-primary-50"
          >
            Email product requirements
          </a>
          <a
            href={`${site.whatsappUrl}?text=${encodeURIComponent(whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/40 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Contact on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
