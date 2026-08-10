export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  topic: string;
  items: FaqItem[];
}

export const faqCategories: FaqCategory[] = [
  {
    topic: 'Product Selection',
    items: [
      {
        question: 'What is an STS prepaid water meter?',
        answer: 'An STS prepaid water meter uses a registered 20-digit token to load purchased water credit. The customer enters the token on the meter keypad or a Customer Interface Unit, and the meter applies the credit under the configured valve and tariff rules. LoRaWAN or another supported communication option can add remote reading, but the STS token workflow and the communications network perform separate roles.',
      },
      {
        question: 'What is the difference between brass and plastic water meters?',
        answer: 'Brass provides a metal meter body and is often specified where buyers prefer higher impact resistance. Plastic reduces body weight and can suit cost-sensitive standard installations. The correct choice still depends on water conditions, pipe size, installation environment, utility specifications, lifecycle plan, and the exact body configuration offered for the model.',
      },
      {
        question: 'Does a prepaid meter have to come with a SIM card?',
        answer: 'No. The basic technology used in prepaid meters is STS (Standard Transfer Specification), a secure message system that does not require internet. The sales point encrypts credit information to generate a 20-digit token, which the user enters via the meter keypad to recharge. A SIM card is only needed for remote meter reading or remote management functions.',
      },
      {
        question: 'What is an STS prepaid electricity meter?',
        answer: 'An STS prepaid electricity meter is a meter that uses the Standard Transfer Specification to accept secure 20-digit recharge tokens. It is commonly used by utilities, landlords, and property operators that need token-based credit control without requiring every meter to stay online.',
      },
      {
        question: 'When should a project use a three-phase prepaid electricity meter?',
        answer: 'A three-phase prepaid electricity meter is normally used for three-phase commercial, industrial, or utility service connections. The buyer should confirm the nominal voltage, maximum current or CT ratio, installation method, accuracy requirement, communication coverage, and destination-market standards before selecting a model.',
      },
      {
        question: 'What is the difference between the CA368 GPRS and standalone STS models?',
        answer: 'Both CA368 models support STS 20-digit token prepayment for three-phase service connections. The CA368 GPRS model adds direct cellular communication for remote reading, monitoring, and meter management. The standalone CA368 STS model uses keypad token entry without requiring always-on remote communication, which is suitable when secure prepayment is needed but direct cellular management is not.',
      },
      {
        question: 'What information is needed for a CA368 three-phase meter quotation?',
        answer: 'Provide the nominal voltage, maximum current or CT ratio, installation and wiring requirement, GPRS or standalone communication preference, vending or API requirement, estimated quantity, target deployment conditions, and required destination-country standards or utility specifications.',
      },
      {
        question: 'Which prepaid meter is suitable for Africa utility projects?',
        answer: 'For many Africa utility and sub-metering projects, CalinMeters recommends STS prepaid electricity meters because 20-digit token recharge can work without continuous network coverage. Split keypad meters and CIUs are useful when the meter is installed outdoors, locked in a cabinet, or mounted on a pole. GPRS, DCU, or LoRaWAN options can be added when remote reading or AMI management is required.',
      },
      {
        question: 'What information should a utility provide when requesting prepaid meters for Africa?',
        answer: 'The utility should provide the service type and maximum current, single-phase or three-phase requirement, installation method, built-in or split keypad preference, STS vending and payment workflow, remote communication requirement, destination-country standards or type approvals, estimated quantity, and pilot conditions. These details allow Shenzhen Calinmeter Co., Ltd. to match the meter, CIU, communication device, and vending integration to the project.',
      },
      {
        question: 'What compliance information is needed for an Africa prepaid meter project?',
        answer: 'Compliance requirements differ by country and utility. Before selecting a model, the buyer should identify the required national standards, utility specifications, type approvals, accuracy class, enclosure rating, test reports, and documentation. CalinMeters can then confirm which requirements and documents apply to the proposed meter configuration without making assumptions about the destination market.',
      },
      {
        question: 'Which meter types are suitable for Southeast Asia smart metering projects?',
        answer: 'For Southeast Asia projects, CalinMeters usually selects the meter according to building density, communication coverage, and utility workflow. LoRaWAN smart water meters are useful for communities and municipal service areas with many meters in one area. STS prepaid electricity meters are practical for token-based credit control, and prepaid gas meters with LoRaWAN are suitable where valve control and remote reading are required.',
      },
      {
        question: 'How should a utility choose a prepaid gas meter?',
        answer: 'Choose a prepaid gas meter only after confirming the gas service, meter size and flow requirement, installation environment, valve operation, customer recharge method, remote reading requirement, and destination-market standards. The CA768 combines STS token prepayment with LoRaWAN communication, but the final configuration should be checked against the local utility specification and a representative pilot.',
      },
      {
        question: 'Why use LoRaWAN for a prepaid gas meter project?',
        answer: 'LoRaWAN is useful when many gas meters are installed in one service area and the operator needs remote reading without a cellular subscription in every meter. Practical coverage depends on building materials, meter location, gateway placement, terrain, and local radio conditions, so the network should be validated with a site survey and pilot.',
      },
      {
        question: 'What information is needed for a prepaid gas meter quotation?',
        answer: 'Provide the gas type and service conditions, required meter size and flow range, installation orientation and environment, valve and STS prepayment requirements, keypad or customer interface requirement, LoRaWAN network and gateway plan, estimated quantity, destination country, required utility specifications or approvals, and pilot acceptance conditions.',
      },
      {
        question: 'What is the expected battery lifetime for Calin meters?',
        answer: 'The published CA568-R22 ultrasonic datasheet states two ER26500 cells with 19000 mAh total capacity and describes battery life of up to 10 years. Actual service life depends on reporting intervals, communication coverage, valve operations, temperature, battery configuration, and field maintenance, so the project should confirm the operating assumptions and replacement procedure.',
      },
    ],
  },
  {
    topic: 'Technical Specifications',
    items: [
      {
        question: 'What is the difference between LoRa and LoRaWAN?',
        answer: 'LoRa is the radio modulation used for long-range, low-power links. LoRaWAN is a network protocol built around LoRa radios and defines how end devices, gateways and network servers communicate. Coverage, reporting interval and gateway capacity are not fixed universal values; they depend on the radio plan, payloads, duty-cycle rules, terrain, building materials and network design.',
      },
      {
        question: 'What causes signal noise in PLC communication?',
        answer: 'PLC (Power Line Communication) performance can be affected by motors, switching power supplies, impedance changes, aging wiring, signal reflection and other electrical noise. The project should test the actual network. LoRaWAN may be evaluated as an alternative where a radio network is practical, but its coverage must also be validated through a site survey and pilot.',
      },
      {
        question: 'How many meters can be managed by one gateway?',
        answer: 'There is no single gateway count or distance that applies to every deployment. Capacity and coverage depend on payload size, reporting frequency, channel plan, local duty-cycle rules, spreading factors, building materials, terrain, interference, gateway placement and backhaul. Use a network calculation followed by a representative site survey and pilot.',
      },
      {
        question: 'When should a utility choose LoRaWAN instead of GPRS for smart meters?',
        answer: 'LoRaWAN is often preferred when a project has many meters in one service area and wants lower communication operating cost without a SIM card in every meter. GPRS is useful when cellular coverage is available and each meter needs direct wide-area connectivity.',
      },
      {
        question: 'Which CalinMeters water meter is best for a LoRaWAN AMI project?',
        answer: 'For LoRaWAN AMI water projects, plastic multi-jet meters are usually chosen for cost-sensitive residential rollouts, brass multi-jet meters are better for tougher installation environments, and ultrasonic water meters are preferred when long-term measurement stability and no moving parts are more important than the lowest upfront cost.',
      },
      {
        question: 'What is the difference between multi-jet and ultrasonic prepaid water meters?',
        answer: 'A multi-jet water meter uses a mechanical measuring mechanism and is often selected for familiar operation and lower initial cost. Plastic-body models suit cost-sensitive standard installations, while brass-body models provide a stronger metal enclosure. An ultrasonic meter has no moving measuring parts and is selected when long-term measurement stability is more important than the lowest initial cost. All project choices should be confirmed against flow range, water quality, installation conditions, communication, battery, and destination-market requirements.',
      },
      {
        question: 'What information is needed for a LoRaWAN smart water meter quotation?',
        answer: 'Provide the pipe size, expected flow range, water quality and temperature, installation orientation, plastic or brass body preference, multi-jet or ultrasonic preference, valve and STS prepayment requirement, keypad or CIU requirement, communication method, estimated meter density, gateway or backhaul plan, quantity, and required destination-country standards or utility specifications.',
      },
      {
        question: 'How should a utility plan LoRaWAN coverage for smart water meters?',
        answer: 'Start with a site survey and pilot rather than relying only on a quoted maximum distance. Building materials, terrain, meter boxes, installation height, underground locations, local interference, gateway placement, and backhaul availability all affect practical coverage. Test representative meter locations before fixing the gateway quantity and rollout plan.',
      },
      {
        question: 'How is the gateway powered?',
        answer: 'The gateway is powered by grid power, not by battery.',
      },
    ],
  },
  {
    topic: 'STS Tokens & Vending',
    items: [
      {
        question: 'How does a token based prepaid meter work?',
        answer: 'A token based prepaid meter uses STS security to load credit before consumption. The operator registers the meter in a vending system, the customer buys credit, the system generates a secure 20-digit token, and the customer enters that token on the meter keypad or CIU. Remote recharge can also be supported when the project uses GPRS, LoRaWAN, or AMI integration.',
      },
      {
        question: 'When should a utility choose a split keypad prepaid meter?',
        answer: 'A split keypad prepaid meter is useful when the main meter is installed outdoors, locked in a cabinet, mounted on a pole, or placed where the customer should not access the wiring compartment. The CIU gives the customer an indoor keypad for token entry, balance checking, and consumption information while the main meter remains protected.',
      },
      {
        question: 'Do prepaid meter tokens have an expiry date?',
        answer: 'Token acceptance depends on the meter state, vending configuration, token sequence and key-management lifecycle. Do not assume that every unused token remains valid indefinitely. If a token is rejected or lost, the customer should contact the responsible utility or vending operator so the transaction can be checked against that meter.',
      },
      {
        question: 'How does the vending system work?',
        answer: 'A vending system registers meters, accepts a credit-sale request and generates the token used by the customer. Browser access, payment integration, mobile-money delivery, API behavior and remote token loading are project-specific. Confirm the required workflow, responsibilities and supported interfaces before selecting the final system architecture.',
      },
      {
        question: 'Do you provide the management system or can we use our own?',
        answer: 'CalinMeters can review either a supplier-provided vending option or integration with the buyer’s existing platform. The available API, key-management boundary, payment connection, security responsibilities and supported meter functions must be confirmed for the proposed configuration.',
      },
      {
        question: 'Can CalinMeters integrate with a third-party payment or vending platform?',
        answer: 'Third-party payment or vending integration can be reviewed for a project. The buyer should provide the existing platform, required API operations, authentication method, token-delivery workflow, key-management boundary, supported devices and acceptance tests so compatibility can be confirmed in writing.',
      },
      {
        question: 'Can STS prepaid meters work with mobile money in Africa?',
        answer: 'Yes, when the vending and payment integration is configured for the project. A customer can pay through a mobile money channel, the payment platform can request an STS token through the vending system or API, and the token can be delivered to the customer for keypad or CIU entry. Remote token delivery may also be available when the selected meter and communication architecture support it.',
      },
    ],
  },
  {
    topic: 'Commercial Terms',
    items: [
      {
        question: 'What are your payment terms?',
        answer: 'Payment terms are quotation- and contract-specific. Request the proposed deposit, balance, shipment, batch-delivery and banking terms in writing for the current order before making a commercial decision.',
      },
      {
        question: 'What is your warranty policy?',
        answer: 'Warranty coverage depends on the selected product, configuration and sales contract. Ask CalinMeters for the written warranty period, start date, exclusions, failure-confirmation process, spare-unit arrangement and replacement responsibility that apply to the specific quotation.',
      },
      {
        question: 'Can you share the price list?',
        answer: 'Please contact us directly at info@calinmeters.com or via WhatsApp/WeChat at +8613713788753 and we will send a quote as soon as possible.',
      },
    ],
  },
  {
    topic: 'CIU & DCU',
    items: [
      {
        question: 'What is a CIU (Customer Interface Unit)?',
        answer: 'A CIU is an extension keypad for the meter, especially for meters without a built-in keypad like DIN rail meters. These meters are usually locked and mounted on poles for better communication with the gateway and for theft prevention. The CIU allows users to conveniently enter tokens and check balances.',
      },
      {
        question: 'What is a DCU (Data Concentrator Unit)?',
        answer: 'A DCU is not a meter but a separate data device that acts as a gateway between meters and the back-end system. DCUs are used for cluster installations — for example, in a village with many households. Using a DCU is more cost-effective than putting a SIM card in each meter, as meters with SIM cards are more costly than those without.',
      },
      {
        question: 'What equipment is needed for an AMI metering solution?',
        answer: 'A typical AMI metering solution includes smart prepaid meters, CIUs when users need a separate keypad or display, DCUs or LoRaWAN gateways for data collection, and a back-end vending or meter management platform for token, reading, and device operations.',
      },
      {
        question: 'Can ultrasonic meters work without a CIU?',
        answer: 'Yes, our ultrasonic meters can operate without a CIU as they have an integrated keypad. However, we recommend CIUs when meters are installed outdoors or enclosed in anti-tamper boxes, as the CIU significantly enhances accessibility and functionality in these scenarios.',
      },
    ],
  },
  {
    topic: 'Product Reliability',
    items: [
      {
        question: 'How mature is the ultrasonic water meter technology?',
        answer: 'Ultrasonic water metering uses a no-moving-parts measuring principle, but product maturity for a specific project should be assessed through the published specifications, test documentation, installation requirements and a representative pilot. Validate flow performance, communication, battery assumptions, valve operations and maintenance procedures before large-scale deployment.',
      },
    ],
  },
];

export const allFaqItems = faqCategories.flatMap((category) => category.items);

export function getFaqItemsByQuestions(questions: string[]) {
  return questions.flatMap((question) => {
    const item = allFaqItems.find((candidate) => candidate.question === question);
    return item ? [item] : [];
  });
}
