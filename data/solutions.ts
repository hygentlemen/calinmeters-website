export interface SolutionSection {
  title: string;
  intro?: string;
  items: Array<{ title: string; text: string }>;
}

export interface SolutionPageData {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  answer: string;
  image: string;
  imageAlt: string;
  imageCaption: string;
  sections: SolutionSection[];
  faqQuestions: string[];
  quoteTopic: string;
}

export const solutionPages: Record<string, SolutionPageData> = {
  'solar-mini-grid-metering': {
    slug: 'solar-mini-grid-metering',
    title: 'Solar Mini-grid Prepaid Metering and Technical Support',
    description: 'STS prepaid meters, vending and remote reading for solar mini-grid developers and EPCs, with standing product stock, Nigeria service support and China engineering response.',
    eyebrow: 'For mini-grid developers, operators and EPCs',
    h1: 'Prepaid metering from the first mini-grid pilot to rollout',
    answer: 'CalinMeters supplies prepaid electricity meters and supporting communication devices for solar mini-grids. We hold stock for mini-grid products, work with a service provider in Nigeria and provide direct technical support from our China headquarters. Start with a coordinated meter, vending and communication configuration, then validate it at your pilot site.',
    image: '/images/projects/meter-installation.jpeg',
    imageAlt: 'Field technician working on pole-mounted Calin electricity meter enclosures',
    imageCaption: 'Pole-mounted distribution-meter installation. Photograph supplied by CalinMeters.',
    sections: [
      {
        title: 'Choose the operating model before choosing the radio',
        items: [
          { title: 'Prepayment at the connection', text: 'Match the electrical service, maximum load, enclosure and customer keypad access. STS token entry supports local credit loading; define low-credit, overload and reconnection behaviour in the selected meter configuration.' },
          { title: 'Vending and payment reconciliation', text: 'Agree who runs vending, manages keys, receives payment confirmations and resolves duplicate or failed transactions. Link a payment reference, token transaction and meter account so the operator can reconcile collections with issued credit.' },
          { title: 'Remote reading and operations', text: 'Select cellular or a gateway-based architecture according to the model and site. Confirm radio coverage, gateway backhaul, reporting intervals and the handling of delayed data. Local token entry and remote communications have separate availability requirements.' },
          { title: 'Residential and productive-use loads', text: 'Plan single-phase household connections separately from three-phase shops, workshops, pumps and other productive-use loads. CT-operated metering requires a defined CT ratio and the appropriate external load-control arrangement.' },
        ],
      },
      {
        title: 'A deployment process your field team can follow',
        intro: 'Adapted from the supplied Calin four-step deployment guide. The final work instructions and keypad codes must match the selected model and firmware.',
        items: [
          { title: '1. Prepare and register', text: 'Allocate meters and gateways to the site. Record device IDs, agree the configuration and provide the device list for registration. Select a representative sample set for pre-deployment testing.' },
          { title: '2. Test the complete chain', text: 'Connect sample meters, CIUs and gateways, verify backhaul, create test accounts and confirm that meter data reaches the management system. Test each gateway group before dispatch to site.' },
          { title: '3. Survey and install', text: 'Map the actual service area, test candidate gateway locations and check connectivity at each meter position. Install the devices and associate each connection with the correct operator account.' },
          { title: '4. Commission and hand over', text: 'Verify power, activation, customer supply, token loading and data reception before the field team leaves. Record exceptions, hand over the device/account list and agree the maintenance and escalation contacts.' },
        ],
      },
      {
        title: 'Pilot acceptance: agree the evidence before rollout',
        intro: 'Proposed acceptance plan for your project, not a report of achieved field results. Set numerical thresholds and observation periods with the operator before testing.',
        items: [
          { title: 'Meter and account identity', text: 'Record the installed meter, CIU, gateway and customer-account mapping. Acceptance evidence: a signed device list and a successful test transaction for each sampled configuration.' },
          { title: 'Credit and reconciliation', text: 'Test valid recharge, rejected or repeated tokens, payment exceptions and balance updates. Acceptance evidence: matched transaction records and an exception-resolution log.' },
          { title: 'Connectivity and recovery', text: 'Test representative indoor/outdoor locations, loss of backhaul and restoration of supply. Acceptance evidence: time-stamped read records, recovery observations and a list of unresolved coverage gaps.' },
          { title: 'Operational handover', text: 'Confirm field training, spare-device allocation, account access and escalation. Record open actions and approvals; expand the rollout only after the agreed acceptance criteria are met.' },
        ],
      },
      {
        title: 'Deployment experience and partner support',
        items: [
          { title: 'Nigeria distribution-metering experience', text: 'Company project material documents supply of split-keypad single-phase meters, three-phase meters and DCUs for a Nigeria electricity-distribution project. The experience covers meter supply, installation planning and system coordination for distribution metering.' },
          { title: 'A service provider in Nigeria', text: 'CalinMeters currently works with a service provider in Nigeria. Agree the service location, on-site responsibilities and visit arrangements for your project, with China headquarters supporting the technical work directly.' },
          { title: 'Service-provider cooperation in other countries', text: 'We are developing service-provider cooperation in additional markets. Installation firms, metering integrators and maintenance teams can discuss training, territory coverage, tools, spare parts and escalation responsibilities with us.' },
        ],
      },
    ],
    faqQuestions: ['What support is available for a solar mini-grid metering project?', 'Are mini-grid meters kept in stock?', 'Does STS token entry mean the entire vending system works offline?', 'Does programme funding automatically qualify a meter for a mini-grid project?'],
    quoteTopic: 'Solar mini-grid metering pilot',
  },
  'oem-skd-ckd-meter-manufacturing': {
    slug: 'oem-skd-ckd-meter-manufacturing',
    title: 'OEM, SKD and CKD Meter Manufacturing Cooperation',
    description: 'OEM, SKD and CKD cooperation for local meter manufacturers: supply scope, configuration, assembly planning, test responsibilities and technical support from CalinMeters.',
    eyebrow: 'For local meter factories and manufacturing partners',
    h1: 'Build your metering business with OEM, SKD and CKD cooperation',
    answer: 'Shenzhen Calinmeter Co., Ltd. offers established manufacturing cooperation for prepaid metering, including complete OEM products, SKD assemblies and CKD component supply. We work with partners on the product configuration, assembly boundary and production handover needed for their local operation.',
    image: '/images/manufacturing/board-inspection.jpg',
    imageAlt: 'Operator inspecting meter circuit boards at a factory inspection station',
    imageCaption: 'Circuit-board inspection station at the factory. Photograph supplied by CalinMeters.',
    sections: [
      {
        title: 'Three supply formats, one agreed product configuration',
        items: [
          { title: 'OEM: complete meters for your product offer', text: 'Finished-meter cooperation for partners who need a market-ready hardware supply format. Agree model selection, branding, labels, packaging, configuration and the documents needed for your destination and customer.' },
          { title: 'SKD: assemblies for local completion', text: 'Semi-knocked-down supply supports a defined set of local assembly and finishing operations. Agree which assemblies arrive completed, the remaining operations, tools, inspection points and final-release responsibility.' },
          { title: 'CKD: components for a broader local assembly scope', text: 'Completely knocked-down cooperation is structured around an agreed bill of materials and assembly boundary. Define component supply, local sourcing, process documentation, production testing and configuration control together.' },
        ],
      },
      {
        title: 'Define the cooperation package',
        intro: 'Use this scope checklist to turn manufacturing capability into a clear quotation and handover plan. The signed project scope identifies the deliverables for your chosen model.',
        items: [
          { title: 'Hardware and supply boundary', text: 'Identify the meter, enclosure, keypad or CIU, communication option and packaging. Mark every item as supplied complete, supplied as an assembly, supplied as a component or sourced locally.' },
          { title: 'Branding and product configuration', text: 'Agree artwork, serial-number rules, meter labels, approved firmware/configuration versions, language and tariff requirements. Keep the released configuration traceable through samples and production batches.' },
          { title: 'Assembly and testing handover', text: 'Define work instructions, tools and fixtures, operator training, incoming checks, calibration arrangements, functional checks, traceability records and the final inspection plan.' },
          { title: 'Lifecycle and technical support', text: 'Agree engineering-change approval, spare-part needs, fault analysis, return handling and support escalation. Set responsibilities for firmware updates and any change requiring renewed product assessment.' },
        ],
      },
      {
        title: 'From approved sample to a repeatable production process',
        intro: 'Proposed cooperation workflow. The test plan below is a planning framework; project-specific test records and acceptance limits are supplied for the agreed configuration.',
        items: [
          { title: '1. Freeze requirements and samples', text: 'Review the target specification, supply format and bill of materials. Approve reference samples and record the hardware, firmware, artwork and communication versions.' },
          { title: '2. Check incoming items and assemble', text: 'Define component and assembly acceptance checks, then document the local assembly sequence, workmanship criteria and traceability. Train the operators for the agreed operations.' },
          { title: '3. Verify metrology and functions', text: 'Set calibration and accuracy-test conditions appropriate to the meter and service. Check display, inputs/outputs, credit functions, communications and configured load-control or valve behaviour using the applicable model procedures.' },
          { title: '4. Review compliance and release the batch', text: 'Separate routine production checks from type testing and protocol certification. Confirm the applicable certificate/model/firmware scope, resolve nonconformities and retain the agreed inspection records before release.' },
        ],
      },
    ],
    faqQuestions: ['What OEM, SKD and CKD supply formats does CalinMeters offer?', 'What information starts a local meter manufacturing quotation?', 'Does an existing certificate automatically cover an OEM or CKD configuration?'],
    quoteTopic: 'OEM / SKD / CKD meter manufacturing cooperation',
  },
};

export const documentedCertificates = [
  { title: 'ISO 9001:2015', reference: '02819Q10880R2S', scope: 'R&D, manufacture and export sales of electronic energy, smart water and gas meters; software development.', validity: 'Document term: 4 Sep 2025–28 Aug 2028' },
  { title: 'ISO 14001:2015', reference: '02824E12054R0S', scope: 'Environmental management activities for the metering and software scope stated on the certificate.', validity: 'Document term: 5 Sep 2024–4 Sep 2027' },
  { title: 'ISO 45001:2018', reference: '02824S11937R0S', scope: 'Occupational health and safety management for the stated metering and software activities.', validity: 'Document term: 5 Sep 2024–4 Sep 2027' },
  { title: 'DLMS UA compliance', reference: '3234', scope: 'CA368 series, firmware 222101, HDLC profile. This record does not establish every communication option or OEM variant.', validity: 'Issued 13 Dec 2024' },
  { title: 'STS water meter', reference: 'STS-1649', scope: 'CA568 water meter, firmware V1.0; STS Edition 2 specifications identified in the document.', validity: 'Issued 24 Feb 2025' },
  { title: 'STS gas meter', reference: 'STS-730', scope: 'CA768 keypad prepaid gas meter, V1.0, to the extent tested in the certificate.', validity: 'Issued 2 Feb 2018' },
];
