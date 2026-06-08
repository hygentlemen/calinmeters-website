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
        question: 'What is the difference between brass and plastic water meters?',
        answer: 'Brass meters offer higher impact resistance, excellent aging resistance (over 20 years lifespan vs 5-10 years for plastic), more stable measurement accuracy over time, and more reliable sealing. Plastic meters are more cost-effective but may experience oxidation, hardening, or embrittlement long-term, especially in high-temperature or direct sunlight environments.',
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
        question: 'Which prepaid meter is suitable for Africa utility projects?',
        answer: 'For many Africa utility and sub-metering projects, CalinMeters recommends STS prepaid electricity meters because 20-digit token recharge can work without continuous network coverage. Split keypad meters and CIUs are useful when the meter is installed outdoors, locked in a cabinet, or mounted on a pole. GPRS, DCU, or LoRaWAN options can be added when remote reading or AMI management is required.',
      },
      {
        question: 'Which meter types are suitable for Southeast Asia smart metering projects?',
        answer: 'For Southeast Asia projects, CalinMeters usually selects the meter according to building density, communication coverage, and utility workflow. LoRaWAN smart water meters are useful for communities and municipal service areas with many meters in one area. STS prepaid electricity meters are practical for token-based credit control, and prepaid gas meters with LoRaWAN are suitable where valve control and remote reading are required.',
      },
      {
        question: 'What is the expected battery lifetime for Calin meters?',
        answer: 'For both ultrasonic and multi-jet meters, the expected battery lifetime is 5-10 years. Our ultrasonic meters contain double the battery capacity of multi-jet models. The actual lifespan depends heavily on usage patterns — frequent valve operations (opening/closing) consume more battery. Battery replacement is simple for both meter types when needed.',
      },
    ],
  },
  {
    topic: 'Technical Specifications',
    items: [
      {
        question: 'What is the difference between LoRa and LoRaWAN?',
        answer: 'LoRaWAN is an enhanced and optimized version of LoRa technology. Key differences: LoRaWAN has better connectivity and penetration (1-1.5 km vs LoRa less than 1 km), real-time data granularity (hourly vs 24-hour latency), and can manage over 500 meters per gateway versus 200-300 for LoRa.',
      },
      {
        question: 'What causes signal noise in PLC communication?',
        answer: 'PLC (Power Line Communication) signal noise can be caused by: electromagnetic interference from motors and switching power supplies, design flaws like impedance mismatch or aging infrastructure leading to signal reflection, interference from other frequency bands, and inherent environmental noise. LoRaWAN is recommended as an alternative as it operates in a cleaner electromagnetic environment with frequency-hopping capabilities that automatically switch channels to maintain stable connectivity.',
      },
      {
        question: 'How many meters can be managed by one gateway?',
        answer: 'We recommend managing up to 500 meters per LoRaWAN gateway. The communication distance between gateway and meters is up to 2 kilometers by line of sight.',
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
        question: 'How is the gateway powered?',
        answer: 'The gateway is powered by grid power, not by battery.',
      },
    ],
  },
  {
    topic: 'STS Tokens & Vending',
    items: [
      {
        question: 'Do prepaid meter tokens have an expiry date?',
        answer: 'Tokens for prepaid meters do not have an expiry date. They remain valid indefinitely. However, if a user enters 50 new tokens after losing one, the lost token would no longer work. This scenario is rare, as most users contact their service provider to reprint lost tokens.',
      },
      {
        question: 'How does the vending system work?',
        answer: 'Our vending system is a web browser-based platform. You log in, select the meter number, and generate tokens. The system is flexible and compatible with third-party payment gateways like mobile money. When a customer purchases a token, it can be automatically sent remotely to the meter, so the customer does not need to enter the token manually.',
      },
      {
        question: 'Do you provide the management system or can we use our own?',
        answer: 'We are manufacturers focused on meters and solutions. Most of our clients have their own software. We provide API to allow partners to build their own platform. Alternatively, we also offer our own vending system if needed.',
      },
    ],
  },
  {
    topic: 'Sales & Warranty',
    items: [
      {
        question: 'What are your payment terms?',
        answer: 'We usually take a deposit as advance payment, then manufacture, and before shipment we collect the balance. For large quantity orders, we offer batch-by-batch rolling payment terms — you can divide large orders into batches, pay per batch as you withdraw, and we maintain reserve stock for continuous supply.',
      },
      {
        question: 'What is your warranty policy?',
        answer: 'Meters are free from defects in material and workmanship for 18 months from the date of confirmed receipt. We ship 0.2% of the main order as free replacements. Before warranty expiry, after the provided free replacements are consumed, Calin will continue to provide free replacements for any confirmed defective meters due to quality issues.',
      },
      {
        question: 'Can you share the price list?',
        answer: 'Please contact us directly at Scott@szcalinmeter.com or via WhatsApp/WeChat at +8613713788753 and we will send a quote as soon as possible.',
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
        answer: 'After implementing improvements to address initial field issues, our ultrasonic meters (with over 1,000 units deployed) have operated successfully for more than a year without customer complaints. They share similar electronic components with our mature multi-jet meters but feature simpler mechanical structures. We recommend conducting pilot tests before large-scale deployment.',
      },
    ],
  },
];
