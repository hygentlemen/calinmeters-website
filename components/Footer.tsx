import Link from 'next/link';
import { targetProductCategories } from '@/lib/catalog';
import { productPath, site } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="bg-slate-950 py-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-9 md:grid-cols-4">
          <div>
            <h2 className="text-xl font-bold">{site.legalName}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">Prepaid electricity, water and gas meters, plus supporting AMI devices for project configuration.</p>
          </div>
          <div>
            <h2 className="font-semibold">Product guides</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              {targetProductCategories.map((category) => (
                <li key={category.slug}>
                  <Link href={productPath(category.slug)} className="hover:text-white">{category.description}</Link>
                </li>
              ))}
              <li><Link href="/#products" className="hover:text-white">All products and AMI devices</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold">Company</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li><Link href="/#solutions" className="hover:text-white">Solutions</Link></li>
              <li><Link href="/#about" className="hover:text-white">About</Link></li>
              <li><Link href="/#faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/#contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold">Direct contact</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li><a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></li>
              <li><a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp: {site.phone}</a></li>
              <li><a href="https://www.linkedin.com/in/qiscott/" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
