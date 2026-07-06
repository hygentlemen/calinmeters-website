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

const waterMeterComparison = [
  {
    type: 'Plastic multi-jet prepaid water meter',
    principle: 'Mechanical multi-jet',
    communication: 'LoRaWAN',
    bestFor: 'Cost-sensitive residential and community rollouts with standard installation conditions.',
    selectionNote: 'Confirm pipe size, flow range, water quality, installation orientation, valve requirement, and enclosure conditions.',
  },
  {
    type: 'Brass multi-jet prepaid water meter',
    principle: 'Mechanical multi-jet',
    communication: 'LoRaWAN',
    bestFor: 'Projects that prefer a stronger metal body for tougher installation environments.',
    selectionNote: 'Confirm pipe size, flow range, water quality, body-material requirement, valve operation, and local compliance documents.',
  },
  {
    type: 'Ultrasonic prepaid water meter',
    principle: 'Ultrasonic, no moving measuring parts',
    communication: 'LoRaWAN or GPRS',
    bestFor: 'Projects that prioritize no moving measuring parts and long-term measurement stability over the lowest initial cost.',
    selectionNote: 'Confirm flow range, installation conditions, keypad or CIU access, communication coverage, battery expectations, and pilot requirements.',
  },
];

const africaProcurementChecklist = [
  {
    label: 'Load and meter type',
    guidance:
      'Specify single phase, three phase, DIN rail, or CT-operated metering according to the service connection and maximum current.',
  },
  {
    label: 'Installation and customer access',
    guidance:
      'Choose a built-in keypad when the meter is accessible. Choose a split keypad prepaid meter or CIU when the meter is locked outdoors, mounted on a pole, or installed in an anti-tamper enclosure.',
  },
  {
    label: 'STS vending and payment',
    guidance:
      'Confirm 20-digit STS token vending, sales-point workflow, mobile money integration, and whether an API is needed for an existing payment or customer platform.',
  },
  {
    label: 'Communication and AMI',
    guidance:
      'Use standalone token meters for basic prepayment. Add GPRS, LoRaWAN, a DCU, or a gateway when remote reading, alarms, or device management are required.',
  },
  {
    label: 'Destination-market compliance',
    guidance:
      'State the required national standards, utility specifications, type approvals, accuracy class, enclosure rating, and documentation before model selection. Requirements differ by country and project.',
  },
  {
    label: 'Pilot and rollout plan',
    guidance:
      'Run a pilot with representative installation conditions, test token and payment workflows, verify communication coverage, and confirm field procedures before mass deployment.',
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

        <div id="lorawan-water-meter-guide" className="mt-16 scroll-mt-24 border-t border-slate-200 pt-12">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">LoRaWAN water meter selection</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-950">Plastic, brass, or ultrasonic: which smart water meter fits the project?</h3>
            </div>
            <p className="text-base leading-8 text-slate-600">
              Shenzhen Calinmeter Co., Ltd. supplies STS prepaid water meters for utility and community projects. Select the meter by measurement principle, body material, field conditions, communication coverage, lifecycle expectations, and destination-market requirements.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-y border-slate-200 bg-slate-50 text-slate-950">
                  <th className="px-4 py-3 font-semibold">Meter type</th>
                  <th className="px-4 py-3 font-semibold">Measurement principle</th>
                  <th className="px-4 py-3 font-semibold">Communication</th>
                  <th className="px-4 py-3 font-semibold">Best fit</th>
                  <th className="px-4 py-3 font-semibold">Confirm before quotation</th>
                </tr>
              </thead>
              <tbody>
                {waterMeterComparison.map((item) => (
                  <tr key={item.type} className="border-b border-slate-200 align-top">
                    <td className="px-4 py-4 font-semibold text-slate-950">{item.type}</td>
                    <td className="px-4 py-4 leading-6 text-slate-700">{item.principle}</td>
                    <td className="px-4 py-4 text-slate-700">{item.communication}</td>
                    <td className="px-4 py-4 leading-6 text-slate-600">{item.bestFor}</td>
                    <td className="px-4 py-4 leading-6 text-slate-600">{item.selectionNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-sm leading-7 text-slate-600">
            For LoRaWAN projects, complete a site survey before rollout. Gateway placement, building materials, terrain, meter-box location, and local radio conditions affect practical coverage, so a pilot is more reliable than choosing equipment from a distance figure alone.
          </p>

          <a href="#contact" className="mt-7 inline-flex h-11 items-center justify-center rounded-md bg-primary-700 px-5 text-sm font-semibold text-white transition hover:bg-primary-800">
            Request water meter configuration
          </a>
        </div>

        <div className="mt-16 border-t border-slate-200 pt-12">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Africa utility procurement</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-950">What to specify before buying prepaid meters for Africa</h3>
            </div>
            <p className="text-base leading-8 text-slate-600">
              Utilities and system integrators should define the electrical service, installation method, STS vending workflow, communication architecture, destination-market compliance, and pilot plan before requesting a final meter configuration.
            </p>
          </div>

          <dl className="mt-8 border-t border-slate-200">
            {africaProcurementChecklist.map((item) => (
              <div key={item.label} className="grid gap-2 border-b border-slate-200 py-5 md:grid-cols-[240px_1fr] md:gap-8">
                <dt className="font-semibold text-slate-950">{item.label}</dt>
                <dd className="text-sm leading-7 text-slate-600">{item.guidance}</dd>
              </div>
            ))}
          </dl>

          <a href="#contact" className="mt-7 inline-flex h-11 items-center justify-center rounded-md bg-primary-700 px-5 text-sm font-semibold text-white transition hover:bg-primary-800">
            Request project configuration
          </a>
        </div>
      </div>
    </section>
  );
}
