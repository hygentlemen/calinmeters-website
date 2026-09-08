import Link from 'next/link';

export function ProjectSolutions({ locale = 'en' }: { locale?: 'en' | 'fr' }) {
  const fr = locale === 'fr';
  const links = [
    {
      href: '/solutions/solar-mini-grid-metering/',
      title: fr ? 'Comptage pour mini-réseaux solaires' : 'Solar mini-grid metering',
      text: fr ? 'Stock disponible, prestataire au Nigeria et assistance du siège en Chine. Préparez la vente de crédit, le déploiement et les critères du pilote.' : 'Stocked products, a Nigeria service provider and direct China headquarters support. Plan vending, field deployment and pilot acceptance for your sites.',
    },
    {
      href: '/solutions/oem-skd-ckd-meter-manufacturing/',
      title: fr ? 'Coopération de fabrication OEM, SKD et CKD' : 'OEM, SKD and CKD manufacturing',
      text: fr ? 'Compteurs complets, sous-ensembles ou composants pour les fabricants locaux. Définissez le périmètre de fourniture, l’assemblage, les essais et la formation.' : 'Complete meters, assemblies and component supply for local meter factories. Define the supply boundary, assembly, testing and training package.',
    },
  ];
  return <div className="mb-10 grid gap-6 md:grid-cols-2">{links.map(link => <article key={link.href} className="flex flex-col rounded-xl border border-primary-200 bg-primary-50 p-7">
    <h3 className="text-2xl font-bold text-slate-950">{link.title}</h3>
    <p className="mt-4 flex-1 leading-7 text-slate-700">{link.text}</p>
    <Link href={link.href} className="mt-5 inline-flex min-h-12 items-center font-bold text-primary-800 underline">{fr ? 'Voir la solution en anglais →' : 'Explore the solution →'}</Link>
  </article>)}</div>;
}
