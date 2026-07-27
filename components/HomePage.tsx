import Image from 'next/image';
import Link from 'next/link';
import AboutSection from '@/components/AboutSection';
import BannerCarousel from '@/components/BannerCarousel';
import ContactSection from '@/components/ContactSection';
import FaqSection from '@/components/FaqSection';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';
import FrenchInquiryForm from '@/components/FrenchInquiryForm';
import { JsonLd } from '@/components/JsonLd';
import Navbar from '@/components/Navbar';
import ProductsSection from '@/components/ProductsSection';
import SocialSidebar from '@/components/SocialSidebar';
import SolutionsSection from '@/components/SolutionsSection';
import StructuredData from '@/components/StructuredData';
import { frenchFaqItems } from '@/data/locales/fr/faq';
import { frenchHome } from '@/data/locales/fr/home';
import { absoluteUrl, site } from '@/lib/site';

interface HomePageProps {
  locale: 'en' | 'fr';
}

const frenchCategories = [
  {
    label: "Compteurs d'électricité",
    description: 'Compteurs électriques prépayés STS',
    href: '/fr/produits/compteur-electricite-prepaye-sts/',
  },
  {
    label: "Compteurs d'eau",
    description: "Compteurs d'eau prépayés STS",
    href: '/fr/produits/compteur-eau-prepaye-sts/',
  },
];

const technicalDecisions = [
  {
    title: 'Service et dimensionnement',
    text: "Pour l'électricité : phase, tension, fréquence et courant. Pour l'eau : diamètre, débit, pression et température.",
  },
  {
    title: 'Installation et accès client',
    text: "Précisez le câblage ou la tuyauterie, l'emplacement du compteur et la façon dont l'utilisateur saisira les jetons.",
  },
  {
    title: 'Communication',
    text: 'Indiquez si le projet fonctionne en mode autonome ou nécessite GPRS, LoRaWAN, PLC, RF ou une autre option publiée.',
  },
  {
    title: 'Vente de crédit STS',
    text: "Décrivez le système existant, la gestion des clés, les canaux de vente et le besoin éventuel d'intégration.",
  },
  {
    title: 'Pilote et validation',
    text: 'Communiquez la quantité, le calendrier, les critères du pilote et les spécifications applicables à la destination.',
  },
] as const;

const frenchFaqs = [
  frenchFaqItems[0],
  frenchFaqItems[4],
  frenchFaqItems[6],
  frenchFaqItems[9],
];

function FrenchStructuredData() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${site.url}/#organization`,
            name: site.legalName,
            alternateName: site.name,
            url: absoluteUrl('/'),
            logo: absoluteUrl('/logo.jpg'),
            email: site.email,
            telephone: site.phone,
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Floor 6, Bd A1, Qiaode Tech Park, Kelian Rd, Guang Ming District',
              addressLocality: 'Shenzhen',
              addressCountry: 'CN',
            },
            description:
              "Fournisseur de compteurs prépayés STS d'électricité et d'eau pour les projets de comptage.",
          },
          {
            '@type': 'WebSite',
            '@id': `${site.url}/fr/#website`,
            url: absoluteUrl('/fr/'),
            name: 'CalinMeters en français',
            inLanguage: 'fr-FR',
            publisher: { '@id': `${site.url}/#organization` },
          },
          {
            '@type': 'WebPage',
            '@id': `${site.url}/fr/#webpage`,
            url: absoluteUrl('/fr/'),
            name: frenchHome.h1,
            description: frenchHome.description,
            inLanguage: 'fr-FR',
            isPartOf: { '@id': `${site.url}/fr/#website` },
          },
          {
            '@type': 'ItemList',
            name: 'Guides des compteurs prépayés STS',
            itemListElement: frenchCategories.map((category, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: category.description,
              url: absoluteUrl(category.href),
            })),
          },
          {
            '@type': 'FAQPage',
            inLanguage: 'fr-FR',
            mainEntity: frenchFaqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          },
        ],
      }}
    />
  );
}

function FrenchHomePage() {
  return (
    <div className="relative min-h-screen bg-white">
      <FrenchStructuredData />
      <Navbar locale="fr" languageHref="/" categories={frenchCategories} />
      <main>
        <section className="overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-950 via-primary-900 to-primary-700 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-24">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-200">{frenchHome.eyebrow}</p>
              <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {frenchHome.h1}
              </h1>
              <div className="mt-7 rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-primary-200">Réponse directe</p>
                <p className="mt-2 max-w-3xl leading-8 text-slate-100">{frenchHome.directAnswer}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/fr/#produits" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 py-3 font-semibold text-primary-900 transition hover:bg-primary-50">
                  {frenchHome.primaryAction}
                </Link>
                <Link href="/fr/#contact" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/60 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
                  {frenchHome.secondaryAction}
                </Link>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-2xl">
              <Image
                src="/images/banners/banner-product.jpg"
                alt="Compteurs prépayés STS d'électricité et d'eau CalinMeters"
                width={900}
                height={680}
                priority
                sizes="(min-width: 1024px) 38vw, 90vw"
                className="h-auto max-h-[470px] w-full object-contain"
              />
            </div>
          </div>
        </section>

        <section id="produits" aria-labelledby="french-products-heading" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">{frenchHome.productSection.eyebrow}</p>
            <h2 id="french-products-heading" className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">{frenchHome.productSection.title}</h2>
            <p className="mt-4 leading-8 text-slate-600">{frenchHome.productSection.description}</p>
          </div>
          <div className="mt-9 grid gap-6 md:grid-cols-2">
            {[
              {
                ...frenchHome.productSection.electricity,
                image: '/images/products/electricity/single-phase.jpg',
              },
              {
                ...frenchHome.productSection.water,
                image: '/images/products/water/prepaid-water-meter.jpg',
              },
            ].map((category) => (
              <article key={category.href} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex min-h-64 items-center justify-center bg-slate-50 p-8">
                  <Image src={category.image} alt={category.title} width={720} height={480} className="h-56 w-full object-contain" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-950">{category.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{category.description}</p>
                  <Link href={category.href} className="mt-6 inline-flex min-h-11 items-center font-bold text-primary-700 hover:text-primary-900">
                    Voir le guide et les modèles →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="solutions" className="scroll-mt-24 border-y border-slate-200 bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">{frenchHome.selection.eyebrow}</p>
            <h2 className="mt-2 max-w-4xl text-3xl font-bold text-slate-950 sm:text-4xl">{frenchHome.selection.title}</h2>
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {frenchHome.selection.items.map((item, index) => (
                <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-800">{index + 1}</span>
                  <h3 className="mt-4 text-lg font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="technical-decisions-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">Décisions techniques</p>
              <h2 id="technical-decisions-heading" className="mt-2 text-3xl font-bold text-slate-950">Préparez les données qui orientent le devis</h2>
              <p className="mt-4 leading-8 text-slate-600">
                Une demande structurée permet de comparer les modèles publiés sans supposer la configuration finale.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {technicalDecisions.map((item) => (
                <article key={item.title} className="rounded-xl border border-slate-200 p-5">
                  <h3 className="font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="scroll-mt-24 bg-slate-950 py-16 text-white">
          <div className="mx-auto grid max-w-7xl gap-9 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-300">{frenchHome.trust.eyebrow}</p>
              <h2 className="mt-2 text-3xl font-bold">{frenchHome.trust.title}</h2>
              <p className="mt-4 leading-8 text-slate-300">{frenchHome.trust.description}</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
              <h3 className="text-xl font-bold">{site.legalName}</h3>
              <p className="mt-3 leading-7 text-slate-300">
                Fabricant basé à Shenzhen, en Chine. Les pages produit présentent les configurations publiées ; les paramètres définitifs et les documents applicables sont confirmés pour chaque projet.
              </p>
              <address className="mt-4 not-italic text-sm leading-7 text-slate-400">{site.address}</address>
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-24 border-b border-slate-200 bg-slate-50 py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-primary-700">Questions des acheteurs</p>
            <h2 className="mt-2 text-center text-3xl font-bold text-slate-950">Questions fréquentes</h2>
            <div className="mt-8 space-y-4">
              {frenchFaqs.map((faq) => (
                <details key={faq.question} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <summary className="cursor-pointer font-bold text-slate-950">{faq.question}</summary>
                  <p className="mt-4 border-t border-slate-100 pt-4 leading-7 text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 py-16">
          <div className="mx-auto grid max-w-7xl gap-9 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">Demande de projet</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">Recevez une étude de configuration</h2>
              <p className="mt-4 leading-8 text-slate-600">
                Décrivez l’application, les paramètres techniques, la quantité, le pays ou la région et la période cible. Nous vérifierons ces éléments par rapport aux modèles publiés.
              </p>
              <p className="mt-5 text-sm leading-7 text-slate-500">
                Le français écrit est traité avec assistance de traduction. Les paramètres techniques du devis doivent être validés par écrit.
              </p>
            </div>
            <FrenchInquiryForm />
          </div>
        </section>
      </main>
      <Footer
        locale="fr"
        categories={frenchCategories.map((category) => ({
          label: category.description,
          href: category.href,
        }))}
      />
      <SocialSidebar locale="fr" />
    </div>
  );
}

export default function HomePage({ locale }: HomePageProps) {
  if (locale === 'fr') return <FrenchHomePage />;

  return (
    <div className="min-h-screen bg-white relative">
      <StructuredData />
      <Navbar languageHref="/fr/" />
      <main>
        <BannerCarousel />
        <ProductsSection />
        <SolutionsSection />
        <FeaturesSection />
        <AboutSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
      <SocialSidebar />
    </div>
  );
}
