import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { InquiryCta } from '@/components/catalog/InquiryCta';
import { ServiceSupport } from '@/components/ServiceSupport';
import { getFaqItemsByQuestions } from '@/data/faq';
import { documentedCertificates, solutionPages } from '@/data/solutions';
import { absoluteUrl, site } from '@/lib/site';

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(solutionPages).map(slug => ({ slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = solutionPages[params.slug];
  if (!page) return {};
  return { title: page.title, description: page.description, alternates: { canonical: `/solutions/${page.slug}/`, languages: {} }, robots: { index: true, follow: true }, openGraph: { title: page.title, description: page.description, url: absoluteUrl(`/solutions/${page.slug}/`), images: [{ url: absoluteUrl(page.image), alt: page.imageAlt }] } };
}

export default function SolutionPage({ params }: { params: { slug: string } }) {
  const page = solutionPages[params.slug];
  if (!page) notFound();
  const manufacturing = page.slug === 'oem-skd-ckd-meter-manufacturing';
  const faqs = getFaqItemsByQuestions(page.faqQuestions);
  const url = absoluteUrl(`/solutions/${page.slug}/`);
  return <>
    <Navbar />
    <JsonLd data={{ '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: page.h1, description: page.description, inLanguage: 'en', isPartOf: { '@id': `${site.url}/#website` } },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url }, { '@type': 'ListItem', position: 2, name: page.title, item: url }] },
      { '@type': 'FAQPage', mainEntity: faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    ] }} />
    <main>
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-50 to-primary-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div>
            <Link href="/#solutions" className="text-sm font-semibold text-primary-700">Metering solutions</Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-primary-700">{page.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{page.h1}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-700">{page.answer}</p>
            <a href="#project-inquiry" className="mt-7 inline-flex min-h-12 items-center rounded-lg bg-primary-700 px-6 py-3 font-semibold text-white hover:bg-primary-800">Discuss your project</a>
          </div>
          <figure>
            <Image src={page.image} alt={page.imageAlt} width={1080} height={1080} priority className="h-[420px] w-full rounded-2xl object-cover shadow-lg" />
            <figcaption className="mt-3 text-xs leading-5 text-slate-500">{page.imageCaption}</figcaption>
          </figure>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ServiceSupport />
        {page.sections.map(section => <section key={section.title} className="border-t border-slate-200 py-14">
          <h2 className="max-w-4xl text-3xl font-bold text-slate-950">{section.title}</h2>
          {section.intro && <p className="mt-4 max-w-4xl leading-7 text-slate-600">{section.intro}</p>}
          <div className="mt-8 grid gap-6 md:grid-cols-2">{section.items.map(item => <article key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-xl font-bold text-slate-950">{item.title}</h3><p className="mt-3 leading-7 text-slate-600">{item.text}</p>
          </article>)}</div>
        </section>)}
        {!manufacturing && <section className="border-t border-slate-200 py-14">
          <h2 className="text-3xl font-bold text-slate-950">Vending and operations in one working view</h2>
          <p className="mt-4 max-w-4xl leading-7 text-slate-600">The supplied platform view shows token generation and records, remote operations, reporting and account management. Plan user roles, payment interfaces and reconciliation outputs with the project team.</p>
          <figure className="mt-8"><Image src="/images/projects/meter-platform.png" alt="Anonymized metering platform dashboard with token, remote-operation and reporting navigation" width={1920} height={869} className="h-auto w-full rounded-xl border border-slate-200" /><figcaption className="mt-3 text-sm text-slate-500">Company-supplied platform screenshot, with the account identity masked in the supplied image. Displayed dashboard figures illustrate the interface and are not a claim about your project’s expected results.</figcaption></figure>
          <div className="mt-7"><InquiryCta topic="service-provider cooperation" description="Tell us your country, installation and maintenance coverage, team experience and the metering services you can provide." /></div>
        </section>}
        {manufacturing && <section id="documentation" className="scroll-mt-24 border-t border-slate-200 py-14">
          <h2 className="text-3xl font-bold text-slate-950">Documentation for your technical review</h2>
          <p className="mt-4 max-w-4xl leading-7 text-slate-600">The following references are transcribed from supplied company documents. Request the applicable copies and current status for your bid or product configuration. Management-system scope and product/firmware compliance are distinct; a family certificate does not automatically cover every assembled variant.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{documentedCertificates.map(cert => <article key={cert.reference} className="rounded-xl border border-slate-200 p-5"><h3 className="text-lg font-bold text-slate-950">{cert.title}</h3><p className="mt-2 break-words font-mono text-sm text-primary-700">{cert.reference}</p><p className="mt-3 text-sm leading-6 text-slate-600">{cert.scope}</p><p className="mt-3 text-xs text-slate-500">{cert.validity}</p></article>)}</div>
          <p className="mt-6 text-sm leading-6 text-slate-600">Process references: <a className="underline" href="https://www.sts.org.za/implementing-sts/manufacturers-guide/">STS manufacturers’ guide</a>, <a className="underline" href="https://www.sts.org.za/submit-your-meter-for-testing-and-certification/">STS testing and certification</a>, and <a className="underline" href="https://www.dlms.com/test-tools/">DLMS UA compliance and compatibility testing</a>. These explain assessment paths; they do not replace model-specific records.</p>
        </section>}
        <section className="border-t border-slate-200 py-14"><h2 className="text-3xl font-bold text-slate-950">Buyer questions</h2><div className="mt-7 space-y-4">{faqs.map(faq => <details key={faq.question} className="rounded-xl border border-slate-200 p-5"><summary className="cursor-pointer font-semibold text-slate-950">{faq.question}</summary><p className="mt-4 leading-7 text-slate-600">{faq.answer}</p></details>)}</div></section>
        <section id="project-inquiry" className="scroll-mt-24 pb-14"><InquiryCta topic={page.quoteTopic} description="Share the target country, model or application, quantity, timeline and technical requirements. We will help define the next configuration or cooperation step." /></section>
        <nav aria-label="Related metering pages" className="flex flex-wrap gap-4 border-t border-slate-200 py-8 text-sm font-semibold text-primary-700"><Link href="/products/sts-prepaid-electricity-meter/">Electricity meters</Link><Link href="/products/sts-prepaid-water-meter/">Water meters</Link><Link href="/products/sts-prepaid-gas-meter/">Gas meters</Link>{Object.values(solutionPages).filter(p => p.slug !== page.slug).map(p => <Link key={p.slug} href={`/solutions/${p.slug}/`}>{p.title}</Link>)}</nav>
      </div>
    </main><Footer />
  </>;
}
