export interface CategorySeoStep {
  title: string;
  text: string;
}

export interface CategorySeoPage {
  slug: string;
  primaryKeyword: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  directAnswer: string;
  intro: string;
  comparisonTitle?: string;
  comparisonAnswer?: string;
  comparisonNote?: string;
  selectionTitle: string;
  selectionSteps: CategorySeoStep[];
  workflowTitle: string;
  workflowIntro: string;
  workflowSteps: CategorySeoStep[];
  quotationChecklist: string[];
  faqQuestions: string[];
  productIds: string[];
}

export const categorySeoPages: Record<string, CategorySeoPage> = {
  'sts-prepaid-electricity-meter': {
    slug: 'sts-prepaid-electricity-meter',
    primaryKeyword: 'STS prepaid electricity meter',
    title: 'STS Prepaid Electricity Meters for Utility Projects',
    description:
      'Compare CalinMeters single-phase, three-phase, DIN-rail and communication-ready STS prepaid electricity meters for utility and sub-metering projects.',
    eyebrow: 'Electricity metering',
    h1: 'STS Prepaid Electricity Meters for Utility Projects',
    directAnswer:
      'An STS prepaid electricity meter measures energy and deducts credit loaded through a secure 20-digit token. Utilities can use standalone keypad models where continuous connectivity is not required, or select GPRS and LoRaWAN options for remote reading. The correct model depends on phase, current, installation, CIU access, vending integration and destination requirements.',
    intro:
      'Shenzhen Calinmeter Co., Ltd. (CalinMeters) supplies single-phase, three-phase and DIN-rail electricity meters for prepaid deployments. Use this page to compare the published models, understand the token and communication choices, and prepare the technical information needed for a quotation or pilot.',
    comparisonTitle:
      'Single-phase, three-phase, DIN-rail or CT-operated: which prepaid meter fits?',
    comparisonAnswer:
      'Choose a direct-connected single-phase model when the service voltage and current match the published configuration. Use a three-phase four-wire model for supported commercial or utility service connections. A DIN-rail meter with a separate Customer Interface Unit can keep the main meter inside a protected cabinet while the customer enters tokens indoors. Select standalone STS when local token entry is sufficient, or evaluate GPRS or LoRaWAN when the operator also needs remote reading.',
    comparisonNote:
      'Published values are transcribed from the current model datasheets. Confirm the final phase, voltage, current or CT ratio, wiring, communication option, installation conditions and destination requirements in the quotation and pilot.',
    selectionTitle: 'How to select an STS prepaid electricity meter',
    selectionSteps: [
      {
        title: 'Define the electrical service',
        text: 'Confirm single-phase or three-phase service, nominal voltage, frequency, maximum current and whether an external current transformer is required.',
      },
      {
        title: 'Choose direct or split customer access',
        text: 'Use a built-in keypad where customers can reach the meter. Use a DIN-rail or protected meter with a Customer Interface Unit when the main meter is outside, locked or pole-mounted.',
      },
      {
        title: 'Select the communication architecture',
        text: 'Standalone STS supports local token entry. GPRS can provide direct cellular connectivity, while LoRaWAN can aggregate many meters through shared gateways.',
      },
      {
        title: 'Define vending and integration',
        text: 'Document the vending platform, key-management responsibilities, sales channels, mobile-money flow and any API connection to existing utility systems.',
      },
      {
        title: 'Confirm compliance and pilot conditions',
        text: 'List the destination standards, utility specifications, test documents and representative pilot checks required before a production order.',
      },
    ],
    workflowTitle: 'How STS electricity token recharge works',
    workflowIntro:
      'The Standard Transfer Specification (STS) provides a token-based method for transferring prepaid credit to a registered meter. Network communication can add remote operations, but the basic keypad workflow does not require every meter to remain online.',
    workflowSteps: [
      {
        title: '1. Register the meter',
        text: 'The operator records the meter identity and required vending configuration in the prepaid management system.',
      },
      {
        title: '2. Sell electricity credit',
        text: 'The customer purchases a selected credit amount through an approved sales or payment channel.',
      },
      {
        title: '3. Generate the token',
        text: 'The vending system produces a 20-digit token associated with that meter and transaction.',
      },
      {
        title: '4. Load and consume credit',
        text: 'The customer enters the token on the meter or CIU; the meter accepts valid credit and deducts it as electricity is consumed.',
      },
    ],
    quotationChecklist: [
      'Single-phase, three-phase or CT-operated service',
      'Nominal voltage, frequency and maximum current or CT ratio',
      'Wiring, enclosure and installation location',
      'Built-in keypad or split Customer Interface Unit',
      'Standalone STS, GPRS, LoRaWAN, PLC or other communication requirement',
      'Vending platform, key management, payment channel and API scope',
      'Estimated quantity, rollout schedule and pilot acceptance criteria',
      'Destination standards, utility specifications and required documentation',
    ],
    faqQuestions: [
      'What is an STS prepaid electricity meter?',
      'When should a project use a three-phase prepaid electricity meter?',
      'What is the difference between the CA368 GPRS and standalone STS models?',
      'When should a utility choose a split keypad prepaid meter?',
      'Does a prepaid meter have to come with a SIM card?',
      'How does a token based prepaid meter work?',
    ],
    productIds: [
      'ca168-lorawan',
      'ca168-gprs',
      'ca168-sts',
      'ca368-gprs',
      'ca368-sts',
      'ct-meter',
    ],
  },
  'sts-prepaid-water-meter': {
    slug: 'sts-prepaid-water-meter',
    primaryKeyword: 'STS prepaid water meter',
    title: 'STS Prepaid Water Meters for Utility Projects',
    description:
      'Compare plastic and brass multi-jet and ultrasonic STS prepaid water meters, with LoRaWAN options and buyer-focused selection guidance.',
    eyebrow: 'Water metering',
    h1: 'STS Prepaid Water Meters for Utility and Community Projects',
    directAnswer:
      'An STS prepaid water meter controls water credit through a 20-digit token entered on a keypad or Customer Interface Unit. CalinMeters offers multi-jet and ultrasonic configurations with optional remote reading. Selection depends on pipe size, flow range, body material, measurement principle, valve workflow, customer access, communications and local utility requirements.',
    intro:
      'The CalinMeters water range includes plastic-body and brass-body multi-jet configurations plus an ultrasonic model with no moving measuring parts. Compare only the published parameters below, then validate water conditions, communication coverage and operating procedures through a representative pilot.',
    comparisonTitle: 'Plastic, brass or ultrasonic: which prepaid water meter fits the project?',
    comparisonAnswer:
      'Choose the plastic multi-jet model for cost-sensitive residential or community installations in its published DN15-DN25 range. Choose the brass multi-jet model when the project specifies a metal body or sizes up to DN50. Choose the ultrasonic model when no moving measuring parts, a published R250 range ratio and remote-reading architecture matter more than the lowest initial cost.',
    comparisonNote:
      'Published values are transcribed from the current model datasheets. Confirm the final size, flow range, communication frequency, installation conditions and destination requirements in the quotation and pilot.',
    selectionTitle: 'How to select an STS prepaid water meter',
    selectionSteps: [
      {
        title: 'Define hydraulic requirements',
        text: 'Confirm nominal pipe size, expected minimum and permanent flow, pressure, water temperature, water quality and installation orientation.',
      },
      {
        title: 'Choose the measurement principle',
        text: 'Multi-jet meters use a mechanical measuring mechanism. Ultrasonic meters have no moving measuring parts and should be evaluated against flow profile and lifecycle requirements.',
      },
      {
        title: 'Choose body and customer access',
        text: 'Specify plastic or brass body, integrated keypad or separate CIU, meter-box access and any valve or back-flow requirement.',
      },
      {
        title: 'Plan remote reading',
        text: 'Define LoRaWAN frequency, meter density, gateway locations, backhaul, reporting interval and remote-control scope, then test representative sites.',
      },
      {
        title: 'Confirm documentation and rollout',
        text: 'List destination requirements, quantity, installation training, commissioning workflow and pilot acceptance tests before scale-up.',
      },
    ],
    workflowTitle: 'How STS water credit and remote reading fit together',
    workflowIntro:
      'STS prepayment and remote meter reading solve different parts of the operating workflow. The token transfers credit to the registered meter; LoRaWAN or another communication layer can carry readings and supported control messages to the operator.',
    workflowSteps: [
      {
        title: '1. Configure the meter',
        text: 'The operator registers the meter, tariff rules, customer access method and any communication settings.',
      },
      {
        title: '2. Issue water credit',
        text: 'A vending system generates a 20-digit token after the customer purchases credit.',
      },
      {
        title: '3. Enter the token',
        text: 'The customer loads the token through the meter keypad or CIU according to the installation design.',
      },
      {
        title: '4. Read and manage remotely',
        text: 'Where configured, gateways and the back-end system collect readings and support the documented remote-management functions.',
      },
    ],
    quotationChecklist: [
      'Pipe size and expected minimum, permanent and overload flow',
      'Water pressure, temperature, quality and installation orientation',
      'Plastic or brass body preference',
      'Multi-jet or ultrasonic measurement principle',
      'Valve, back-flow and customer recharge workflow',
      'Integrated keypad, CIU and meter-box access',
      'LoRaWAN frequency, meter density, gateway and backhaul plan',
      'Quantity, destination requirements and pilot acceptance criteria',
    ],
    faqQuestions: [
      'What is an STS prepaid water meter?',
      'What is the difference between brass and plastic water meters?',
      'What is the difference between multi-jet and ultrasonic prepaid water meters?',
      'What information is needed for a LoRaWAN smart water meter quotation?',
      'How should a utility plan LoRaWAN coverage for smart water meters?',
      'Can ultrasonic meters work without a CIU?',
    ],
    productIds: [
      'water-multi-jet-plastic',
      'water-multi-jet-brass',
      'water-ultrasonic',
    ],
  },
  'sts-prepaid-gas-meter': {
    slug: 'sts-prepaid-gas-meter',
    primaryKeyword: 'STS prepaid gas meter',
    title: 'STS Prepaid Gas Meter for Utility Projects',
    description:
      'Review the CalinMeters CA768-K02 STS prepaid gas meter, published G1.6-G4 flow options, token workflow and remote-reading project checklist.',
    eyebrow: 'Gas metering',
    h1: 'STS Prepaid Gas Meter with Token Prepayment and Remote Reading',
    directAnswer:
      'An STS prepaid gas meter deducts purchased credit and uses a 20-digit token for recharge. The CalinMeters CA768-K02 datasheet lists G1.6, G2.5 and G4 diaphragm-meter options plus optional LoRaWAN, NB-IoT, GPRS or 3G communication. Final selection requires the gas service, flow, pressure, valve workflow, customer interface and destination requirements.',
    intro:
      'The CA768-K02 combines a diaphragm gas meter, prepaid token entry, credit alerts and optional remote communication. Gas projects are safety- and market-specific, so this page separates published product facts from the service conditions, procedures and documentation that the buyer must confirm before a pilot.',
    selectionTitle: 'How to specify an STS prepaid gas meter',
    selectionSteps: [
      {
        title: 'Define the gas service',
        text: 'State the gas type, meter class, nominal and maximum flow, working pressure, installation orientation and ambient conditions.',
      },
      {
        title: 'Document valve operation',
        text: 'Define low-credit behavior, valve close and reopen rules, emergency procedures and customer-support responsibilities.',
      },
      {
        title: 'Choose customer recharge access',
        text: 'Confirm where the meter will be installed and whether customers use its keypad directly or need a separate interface indoors.',
      },
      {
        title: 'Select remote communication',
        text: 'Choose LoRaWAN, NB-IoT, GPRS or 3G only after reviewing coverage, gateway or SIM responsibility, backhaul and reporting needs.',
      },
      {
        title: 'Confirm market requirements and pilot',
        text: 'Identify the utility specifications, approvals, test documents, installation procedures and pilot acceptance criteria required in the destination market.',
      },
    ],
    workflowTitle: 'How prepaid gas token recharge works',
    workflowIntro:
      'The vending workflow links a customer purchase to a registered gas meter. Communication can support remote reading, but token issue, customer entry and valve procedures must be documented for the specific gas utility project.',
    workflowSteps: [
      {
        title: '1. Register the customer meter',
        text: 'The operator configures the meter identity, vending relationship and gas-service rules.',
      },
      {
        title: '2. Purchase gas credit',
        text: 'The customer pays through an approved sales or payment channel.',
      },
      {
        title: '3. Generate and enter the token',
        text: 'The vending system issues a 20-digit token for entry on the meter keypad or configured customer interface.',
      },
      {
        title: '4. Apply the operating procedure',
        text: 'The meter updates credit and follows the configured low-credit and valve workflow; staff handle exceptions under the utility procedure.',
      },
    ],
    quotationChecklist: [
      'Gas type and service conditions',
      'G1.6, G2.5 or G4 meter class and required flow range',
      'Working pressure, installation orientation and environment',
      'Valve close, reopen, emergency and support procedures',
      'Keypad or separate customer interface requirement',
      'LoRaWAN, NB-IoT, GPRS or 3G communication plan',
      'Quantity, rollout schedule and pilot acceptance tests',
      'Destination utility specifications, approvals and required documentation',
    ],
    faqQuestions: [
      'How should a utility choose a prepaid gas meter?',
      'Why use LoRaWAN for a prepaid gas meter project?',
      'What information is needed for a prepaid gas meter quotation?',
      'How does a token based prepaid meter work?',
      'Does a prepaid meter have to come with a SIM card?',
    ],
    productIds: ['ca768-lorawan'],
  },
};

export function getCategorySeoPage(slug: string) {
  return categorySeoPages[slug];
}
