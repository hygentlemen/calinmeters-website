import Link from 'next/link';
import { targetProductCategories } from '@/lib/catalog';
import { productPath, site } from '@/lib/site';

interface FooterProps {
  locale?: 'en' | 'fr';
  categories?: Array<{ label: string; href: string }>;
}

export default function Footer({ locale = 'en', categories }: FooterProps) {
  const isFrench = locale === 'fr';
  const homeHref = isFrench ? '/fr/' : '/';
  const productCategories = categories ?? targetProductCategories.map((category) => ({
    label: category.description,
    href: productPath(category.slug),
  }));

  return (
    <footer className="bg-slate-950 py-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-9 md:grid-cols-4">
          <div>
            <h2 className="text-xl font-bold">{site.legalName}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              {isFrench
                ? 'Compteurs prépayés STS d’électricité et d’eau, avec options de communication pour les projets de comptage.'
                : 'Prepaid electricity, water and gas meters, plus supporting AMI devices for project configuration.'}
            </p>
          </div>
          <div>
            <h2 className="font-semibold">{isFrench ? 'Guides produits' : 'Product guides'}</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              {productCategories.map((category) => (
                <li key={category.href}>
                  <Link href={category.href} className="hover:text-white">{category.label}</Link>
                </li>
              ))}
              <li><Link href={`${homeHref}#${isFrench ? 'produits' : 'products'}`} className="hover:text-white">
                {isFrench ? 'Produits présentés' : 'All products and AMI devices'}
              </Link></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold">{isFrench ? 'Entreprise' : 'Company'}</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li><Link href={`${homeHref}#solutions`} className="hover:text-white">Solutions</Link></li>
              <li><Link href={`${homeHref}#about`} className="hover:text-white">{isFrench ? 'À propos' : 'About'}</Link></li>
              <li><Link href={`${homeHref}#faq`} className="hover:text-white">FAQ</Link></li>
              <li><Link href={`${homeHref}#contact`} className="hover:text-white">{isFrench ? 'Demander un devis' : 'Contact'}</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold">{isFrench ? 'Contact direct' : 'Direct contact'}</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li><a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></li>
              <li><a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp: {site.phone}</a></li>
              <li><a href="https://www.linkedin.com/in/qiscott/" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} {site.legalName} {isFrench ? 'Tous droits réservés.' : 'All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
}
