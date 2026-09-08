import Image from 'next/image';
import Link from 'next/link';

export default function AboutSection() {
  return (
    <section id="about" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">Company</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-4xl">About Shenzhen Calinmeter Co., Ltd.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Shenzhen Calinmeter Co., Ltd. (CalinMeters) supplies prepaid meters for electricity, water and gas projects, together with Customer Interface Units, data concentrators and LoRaWAN gateways.
            </p>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              We offer established OEM, SKD and CKD manufacturing cooperation for local meter factories, alongside direct project supply. Our China headquarters provides technical support, with a service provider in Nigeria and cooperation being developed in additional countries.
            </p>
            <Link href="/solutions/oem-skd-ckd-meter-manufacturing/" className="mt-5 inline-flex min-h-11 items-center font-semibold text-primary-700 underline">Explore manufacturing cooperation and documentation</Link>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-lg font-bold text-primary-700">Electricity, Water & Gas</div>
                <div className="mt-1 text-sm leading-6 text-slate-600">Prepaid metering product categories</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-lg font-bold text-primary-700">Meters, CIUs & Network Devices</div>
                <div className="mt-1 text-sm leading-6 text-slate-600">Components for project architecture</div>
              </div>
            </div>
          </div>
          <div className="relative h-96 overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="/images/company/factory.jpg"
              alt="CalinMeters facility interior"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
