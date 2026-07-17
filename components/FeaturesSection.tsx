const features = [
  {
    title: 'Published Specifications',
    description: 'Compare parameters transcribed from the available product datasheets before confirming a model.',
  },
  {
    title: 'Token Prepayment',
    description: 'Plan 20-digit STS token entry, customer access and vending responsibilities for each deployment.',
  },
  {
    title: 'Communication Options',
    description: 'Select standalone, GPRS, LoRaWAN or other published options according to project coverage and operations.',
  },
  {
    title: 'Project Configuration',
    description: 'Confirm destination standards, utility specifications and required documents before final model selection.',
  },
] as const;

export default function FeaturesSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">Buyer-focused information</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-4xl">Evaluate the product and the project together</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">Metering products must be matched to service conditions, customer workflows, communication architecture and destination requirements.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <article key={feature.title} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-800">{index + 1}</span>
              <h3 className="mt-5 text-lg font-bold text-slate-950">{feature.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
