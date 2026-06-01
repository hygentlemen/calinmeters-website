const solutions = [
  {
    title: 'STS prepaid electricity meter projects',
    eyebrow: 'Electricity utilities and property operators',
    summary:
      'CalinMeters STS prepaid electricity meters help utilities, landlords, and sub-metering operators collect payment before consumption while still supporting familiar 20-digit token workflows.',
    points: [
      'Single phase, three phase, DIN rail, and CT options cover residential, commercial, and high-current installations.',
      'Keypad STS meters can operate without a live network connection for basic token recharge.',
      'GPRS and LoRaWAN models support remote reading, remote monitoring, and AMI project management.',
    ],
    keywords: ['STS prepaid electricity meter', 'token based prepaid meter', 'split keypad prepaid meter'],
  },
  {
    title: 'LoRaWAN smart water meter deployments',
    eyebrow: 'Water utilities and residential communities',
    summary:
      'LoRaWAN smart water meters are suitable for projects that need remote reading without placing a SIM card in every meter. Multi-jet and ultrasonic options support different budget, durability, and accuracy requirements.',
    points: [
      'Plastic multi-jet meters are practical for cost-sensitive residential rollouts.',
      'Brass multi-jet meters are better for tougher installation environments.',
      'Ultrasonic meters have no moving parts and are useful when long-term measurement stability matters.',
    ],
    keywords: ['LoRaWAN smart water meter', 'prepaid water meter', 'ultrasonic water meter'],
  },
  {
    title: 'AMI metering solution architecture',
    eyebrow: 'Remote reading and data collection',
    summary:
      'An AMI metering solution typically combines smart meters, CIUs, DCUs or LoRaWAN gateways, and a back-end vending or meter management platform for token, reading, and device operations.',
    points: [
      'CIUs keep token entry and balance checks accessible when meters are locked outdoors or mounted on poles.',
      'DCUs aggregate meter data for dense clusters such as villages, compounds, and utility service areas.',
      'LoRaWAN gateways connect smart meters to the network where remote reading is required at scale.',
    ],
    keywords: ['AMI metering solution', 'data concentrator unit', 'LoRaWAN gateway'],
  },
  {
    title: 'Prepaid gas meter applications',
    eyebrow: 'Residential and commercial gas metering',
    summary:
      'CalinMeters prepaid gas meters combine STS token security, valve control, and LoRaWAN communication for projects that need credit control and remote reading in gas applications.',
    points: [
      'STS prepayment supports secure token-based credit management.',
      'LoRaWAN communication reduces dependence on individual cellular subscriptions.',
      'Remote reading helps operators monitor consumption and reduce manual field collection.',
    ],
    keywords: ['prepaid gas meter', 'STS gas meter', 'smart gas meter'],
  },
];

export default function SolutionsSection() {
  return (
    <section id="solutions" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Metering solutions</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-4xl">Solutions for utility metering projects</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-slate-600 lg:justify-self-end">
            Use these project scenarios to match prepaid meters, communication devices, and AMI components before requesting a quote.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {solutions.map((solution) => (
            <article key={solution.title} className="rounded-md border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">{solution.eyebrow}</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">{solution.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{solution.summary}</p>
              <ul className="mt-5 space-y-3">
                {solution.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-6 text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {solution.keywords.map((keyword) => (
                  <span key={keyword} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                    {keyword}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
