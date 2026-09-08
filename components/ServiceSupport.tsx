import Link from 'next/link';

export function ServiceSupport({ locale = 'en' }: { locale?: 'en' | 'fr' }) {
  const fr = locale === 'fr';
  const items = fr ? [
    ['Stock pour les mini-réseaux', 'Des produits pour mini-réseaux sont tenus en stock. Confirmez le modèle, la configuration et la quantité à réserver.'],
    ['Prestataire au Nigeria', 'Un prestataire de services est présent au Nigeria, avec le soutien technique direct du siège en Chine.'],
    ['Réponse sous 2 h / 12 h', 'Le siège répond sous 2 heures pendant ses heures de travail en Chine, et sous 12 heures en dehors de ces horaires. Il s’agit du délai de réponse, pas du délai de résolution.'],
  ] : [
    ['Stock for mini-grid projects', 'Mini-grid products are kept in stock. Confirm the model, configuration and quantity to reserve for your rollout.'],
    ['Service provider in Nigeria', 'An existing Nigeria service provider works alongside direct technical support from our China headquarters.'],
    ['Response within 2 h / 12 h', 'China headquarters responds within 2 hours during its business hours and within 12 hours outside them. This is the initial response time; resolution depends on the issue.'],
  ];
  return <section aria-label={fr ? 'Stock et assistance technique' : 'Stock and technical support'} className="py-12">
    <div className="grid gap-6 md:grid-cols-3">{items.map(([title,text]) => <div key={title} className="rounded-xl border border-primary-100 bg-primary-50 p-6"><h2 className="text-xl font-bold text-primary-900">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-700">{text}</p></div>)}</div>
    <p className="mt-5 text-sm leading-6 text-slate-600">{fr ? 'Nous développons notre réseau de prestataires dans d’autres pays. ' : 'We are developing service-provider cooperation in additional countries. '}<Link href={fr ? '/fr/?productName=Partenariat+de+services#contact' : '/?productName=Service-provider+cooperation#contact'} className="font-semibold text-primary-700 underline">{fr ? 'Discuter d’un partenariat' : 'Discuss a service partnership'}</Link></p>
  </section>;
}
