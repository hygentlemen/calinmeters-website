export interface ProductSpec {
  label: string;
  pdf: string;
}

export interface VerifiedProductSpec {
  label: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  slug?: string;
  model?: string;
  name: string;
  description: string;
  image: string;
  specs: ProductSpec[];
  highlights?: string[];
  verifiedSpecs?: VerifiedProductSpec[];
  applications?: string[];
  confirmBeforeQuote?: string[];
}

export interface ProductSubCategory {
  name: string;
  variants: ProductVariant[];
}

export interface ProductCategory {
  name: string;
  slug?: string;
  description: string;
  image: string;
  subCategories?: ProductSubCategory[];
  variants?: ProductVariant[];
}

export const productCategories: ProductCategory[] = [
  {
    name: 'Energy Meter',
    slug: 'sts-prepaid-electricity-meter',
    description: 'STS prepaid electricity meters for residential and commercial use',
    image: '/images/products/electricity/single-phase.jpg',
    subCategories: [
      {
        name: 'Single Phase Energy Meter',
        variants: [
          {
            id: 'ca168-lorawan',
            slug: 'ca168-lorawan-sts-prepaid-electricity-meter',
            model: 'CA168-S-NS06',
            name: 'CA168 Smart STS Prepaid DIN Rail Energy Meter (LoRaWAN)',
            description: 'DIN rail STS prepaid energy meter with LoRaWAN communication for remote meter reading and token management.',
            image: '/images/products/electricity/ca168-lorawan-1.png',
            specs: [
              { label: 'Specification (PDF)', pdf: '/specs/energy-meter/CA168-LoRaWAN.pdf' },
            ],
            highlights: [
              '35 mm DIN-rail format for compact meter enclosures',
              'STS prepayment with a 20-digit token workflow',
              'LoRaWAN communication for remote and centralized reading',
              'Optional Customer Interface Unit (CIU) for indoor token entry',
            ],
            verifiedSpecs: [
              { label: 'Phase', value: 'Single phase' },
              { label: 'Nominal voltage', value: '230 V' },
              { label: 'Nominal frequency', value: '50-60 Hz' },
              { label: 'Current', value: '5 A basic; 60 A or 80 A maximum' },
              { label: 'Active energy accuracy', value: 'Class 1.0' },
              { label: 'Communication', value: 'LoRaWAN; optional CIU link by M-Bus, PLC, or RF' },
              { label: 'Meter case protection', value: 'IP54' },
            ],
            applications: [
              'Residential and small commercial prepaid service connections',
              'Split installations where the meter and customer keypad are separated',
              'LoRaWAN projects that require centralized meter reading',
            ],
            confirmBeforeQuote: [
              'Maximum-current option and service wiring',
              'CIU communication method and installation distance',
              'LoRaWAN frequency plan, gateway coverage, and backhaul',
              'Destination utility specifications and required documentation',
            ],
          },
          {
            id: 'ca168-gprs',
            slug: 'ca168-gprs-sts-prepaid-electricity-meter',
            model: 'CA168-CS23',
            name: 'CA168 Smart STS Prepaid Energy Meter (GPRS)',
            description: 'STS prepaid single-phase meter with GPRS communication for remote monitoring and control.',
            image: '/images/products/electricity/ca168-gprs-1.png',
            specs: [
              { label: 'Specification (PDF)', pdf: '/specs/energy-meter/CA168-GPRS.pdf' },
            ],
            highlights: [
              'Built-in keypad for direct STS token entry',
              'Modular communication options for remote metering projects',
              'Configurable prepaid or post-paid operation',
              'Terminal-cover and meter event detection functions',
            ],
            verifiedSpecs: [
              { label: 'Phase', value: 'Single phase' },
              { label: 'Nominal voltage', value: '230 V' },
              { label: 'Nominal frequency', value: '50-60 Hz' },
              { label: 'Current', value: '5 A basic; 60 A maximum, with 80 A or 100 A options' },
              { label: 'Active energy accuracy', value: 'Class 1.0' },
              { label: 'Communication options', value: 'PLC, GPRS, 3G, 4G, or RF module' },
              { label: 'Meter shell protection', value: 'IP54' },
            ],
            applications: [
              'Residential and small commercial prepaid connections',
              'Projects that need a built-in keypad and optional cellular reading',
              'Utility deployments that may add a CIU or communication module',
            ],
            confirmBeforeQuote: [
              'Required maximum current and communication module',
              'Built-in keypad or split CIU configuration',
              'Cellular operator coverage and data plan responsibility',
              'Destination utility specifications and required documentation',
            ],
          },
          {
            id: 'ca168-sts',
            slug: 'ca168-sts-prepaid-electricity-meter',
            model: 'CA168',
            name: 'CA168 STS Prepaid Energy Meter',
            description: 'Standard STS prepaid single-phase energy meter with keypad for token entry.',
            image: '/images/products/electricity/ca168-sts-1.jpg',
            specs: [],
            highlights: [
              'Single-phase prepaid electricity metering',
              'Built-in keypad for STS token entry',
              'Standalone credit loading without an always-on data connection',
            ],
            applications: [
              'Residential prepaid service connections',
              'Property and sub-metering projects using keypad token recharge',
            ],
            confirmBeforeQuote: [
              'Nominal voltage, frequency, and maximum current',
              'Installation and wiring arrangement',
              'Vending-system and key-management requirements',
              'Destination utility specifications and required documentation',
            ],
          },
        ],
      },
      {
        name: 'Three Phase Energy Meter',
        variants: [
          {
            id: 'ca368-gprs',
            slug: 'ca368-gprs-sts-prepaid-three-phase-electricity-meter',
            model: 'CA368-WS23',
            name: 'CA368 Smart STS Prepaid Three Phase Energy Meter (GPRS)',
            description: 'Three-phase STS prepaid electricity meter for commercial, industrial, and utility service connections, with GPRS communication for remote reading and management.',
            image: '/images/products/electricity/ca368-gprs-1.png',
            specs: [
              { label: 'Specification (PDF)', pdf: '/specs/energy-meter/CA368-GPRS.pdf' },
            ],
            highlights: [
              'Three-phase four-wire prepaid electricity metering',
              'Built-in keypad with STS token operation',
              'Modular PLC, RF, GPRS, 3G, or 4G communication options',
              'Optional split configuration with a Customer Interface Unit',
            ],
            verifiedSpecs: [
              { label: 'Phase and wiring', value: 'Three phase, four wire' },
              { label: 'Nominal voltage', value: '3 x 230/240 V' },
              { label: 'Frequency', value: '50/60 Hz +/-5%' },
              { label: 'Current', value: '10 A basic; 100 A maximum' },
              { label: 'Accuracy', value: 'Class 1.0 active energy; Class 2.0 reactive energy' },
              { label: 'Communication options', value: 'PLC, RF, GPRS, 3G, or 4G module' },
              { label: 'Meter shell protection', value: 'IP54' },
            ],
            applications: [
              'Commercial and utility three-phase service connections',
              'Projects requiring direct cellular meter reading and management',
              'Prepaid deployments that also need a customer-facing CIU',
            ],
            confirmBeforeQuote: [
              'Service voltage, wiring, and maximum current',
              'Communication module and cellular network availability',
              'Built-in keypad or split CIU arrangement',
              'Vending/API scope and destination utility requirements',
            ],
          },
          {
            id: 'ca368-sts',
            slug: 'ca368-sts-prepaid-three-phase-electricity-meter',
            model: 'CA368-WS21',
            name: 'CA368 STS Prepaid Three Phase Energy Meter',
            description: 'Standalone three-phase STS prepaid electricity meter with keypad token entry for projects that do not require always-on remote communication.',
            image: '/images/products/electricity/ca368-sts-1.png',
            specs: [
              { label: 'Specification (PDF)', pdf: '/specs/energy-meter/CA368-STS.pdf' },
            ],
            highlights: [
              'Three-phase four-wire prepaid electricity metering',
              '20-digit STS token operation with a built-in keypad',
              'Optional PLC, RF, or cable link to a Customer Interface Unit',
              'Standalone prepayment without an always-on cellular connection',
            ],
            verifiedSpecs: [
              { label: 'Phase and wiring', value: 'Three phase, four wire' },
              { label: 'Nominal voltage', value: '3 x 230/240 V' },
              { label: 'Frequency', value: '50/60 Hz +/-5%' },
              { label: 'Current', value: '10 A basic; 100 A maximum' },
              { label: 'Accuracy', value: 'Class 1.0 active energy; Class 2.0 reactive energy' },
              { label: 'CIU communication options', value: 'PLC, RF, or cable' },
              { label: 'Meter shell protection', value: 'IP54' },
            ],
            applications: [
              'Commercial and utility three-phase prepaid connections',
              'Sites that use secure keypad tokens without continuous cellular service',
              'Protected meter installations using a separate indoor CIU',
            ],
            confirmBeforeQuote: [
              'Service voltage, wiring, and maximum current',
              'Built-in keypad or split CIU arrangement',
              'Vending-system and key-management requirements',
              'Destination utility specifications and required documentation',
            ],
          },
        ],
      },
      {
        name: 'CT Meter',
        variants: [
          {
            id: 'ct-meter',
            slug: 'ct-operated-electricity-meter',
            name: 'CT Operated Energy Meter',
            description: 'Transformer-operated (CT) energy meter for high-current commercial and industrial metering.',
            image: '/images/products/electricity/ct-meter.jpg',
            specs: [],
            highlights: [
              'Current-transformer-operated metering format',
              'Intended for higher-current commercial and industrial connections',
            ],
            applications: [
              'Commercial and industrial services that use external current transformers',
            ],
            confirmBeforeQuote: [
              'CT ratio, voltage inputs, wiring, and accuracy requirement',
              'Prepayment, communication, and installation requirements',
              'Destination utility specifications and required documentation',
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Water Meter',
    slug: 'sts-prepaid-water-meter',
    description: 'Smart STS prepaid water meters with multiple communication options',
    image: '/images/products/water/prepaid-water-meter.jpg',
    subCategories: [
      {
        name: 'Multi-Jet Water Meter (Plastic)',
        variants: [
          {
            id: 'water-multi-jet-plastic',
            slug: 'sts-prepaid-multi-jet-water-meter-plastic',
            model: 'CA568-R01',
            name: 'Smart STS Prepaid Multi-Jet Water Meter - LoRa WAN (Plastic)',
            description: 'Plastic-body multi-jet water meter with STS prepayment and LoRaWAN communication for cost-sensitive residential and community rollouts.',
            image: '/images/products/water/multi-jet-plastic-1.png',
            specs: [
              { label: 'Specification (PDF)', pdf: '/specs/water-meter/Multi-Jet-Plastic.pdf' },
            ],
            highlights: [
              'Multi-jet measurement with a plastic-body configuration',
              'Keypad entry for 20-digit STS recharge tokens',
              'IP68 enclosure rating stated in the product datasheet',
              'Optional expansion for concentrated meter reading',
            ],
            verifiedSpecs: [
              { label: 'Nominal sizes', value: 'DN15, DN20, or DN25' },
              { label: 'Permanent flow Q3', value: '2.5, 4, or 6.3 m3/h by size' },
              { label: 'Range ratio', value: 'R80 or R100 configuration' },
              { label: 'Maximum pressure', value: '16 bar' },
              { label: 'Maximum water temperature', value: '50 C' },
              { label: 'Prepayment input', value: '20-digit STS token by keypad' },
              { label: 'Enclosure rating', value: 'IP68' },
            ],
            applications: [
              'Cost-sensitive residential and community prepaid water projects',
              'Cold-water installations requiring DN15-DN25 sizes',
            ],
            confirmBeforeQuote: [
              'Pipe size, flow range, water pressure, and water temperature',
              'Installation orientation, valve, and back-flow requirements',
              'Keypad/CIU access and remote-reading communication',
              'Destination utility specifications and required documentation',
            ],
          },
        ],
      },
      {
        name: 'Multi-Jet Water Meter (Brass)',
        variants: [
          {
            id: 'water-multi-jet-brass',
            slug: 'sts-prepaid-multi-jet-water-meter-brass',
            model: 'CA568-R01',
            name: 'Smart STS Prepaid Multi-Jet Water Meter - LoRa WAN (Brass)',
            description: 'Brass-body multi-jet water meter with STS prepayment and LoRaWAN communication for projects that prefer a stronger metal enclosure in tougher installation environments.',
            image: '/images/products/water/multi-jet-brass-1.png',
            specs: [
              { label: 'Specification (PDF)', pdf: '/specs/water-meter/Multi-Jet-Brass.pdf' },
            ],
            highlights: [
              'Multi-jet measurement with a brass-body configuration',
              'Keypad entry for 20-digit STS recharge tokens',
              'IP68 enclosure rating stated in the product datasheet',
              'Size options from DN15 to DN50 in the datasheet',
            ],
            verifiedSpecs: [
              { label: 'Nominal sizes', value: 'DN15, DN20, DN25, DN32, DN40, or DN50' },
              { label: 'Permanent flow Q3', value: '2.5-25 m3/h depending on size' },
              { label: 'Range ratio', value: 'R80 or R100 configuration' },
              { label: 'Maximum pressure', value: '16 bar' },
              { label: 'Maximum water temperature', value: '50 C' },
              { label: 'Prepayment input', value: '20-digit STS token by keypad' },
              { label: 'Enclosure rating', value: 'IP68' },
            ],
            applications: [
              'Residential, community, and utility prepaid water projects',
              'Installations that specify a metal meter body or sizes up to DN50',
            ],
            confirmBeforeQuote: [
              'Pipe size, flow range, water pressure, and water temperature',
              'Installation orientation, valve, and back-flow requirements',
              'Keypad/CIU access and remote-reading communication',
              'Destination utility specifications and required documentation',
            ],
          },
        ],
      },
      {
        name: 'Ultrasonic Water Meter',
        variants: [
          {
            id: 'water-ultrasonic',
            slug: 'sts-prepaid-ultrasonic-water-meter',
            model: 'CA568-R22',
            name: 'Smart STS Prepaid Ultrasonic Water Meter - LoRa WAN GPRS',
            description: 'STS prepaid ultrasonic water meter with no moving measuring parts and LoRaWAN or GPRS communication for remote utility metering projects.',
            image: '/images/products/water/ultrasonic-1.png',
            specs: [
              { label: 'Specification (PDF)', pdf: '/specs/water-meter/Ultrasonic.pdf' },
            ],
            highlights: [
              'Ultrasonic measurement with no moving measuring parts',
              'Range ratio up to R250 in the product datasheet',
              'LoRa or LoRaWAN communication with an AMI/AMR architecture',
              'Customer Interface Unit for token and information-code entry',
            ],
            verifiedSpecs: [
              { label: 'Nominal sizes', value: 'DN15, DN20, or DN25' },
              { label: 'Permanent flow Q3', value: '2.5, 4.0, or 6.3 m3/h by size' },
              { label: 'Range ratio', value: 'R250' },
              { label: 'Maximum operating pressure', value: '1.6 MPa' },
              { label: 'Maximum working temperature', value: '55 C' },
              { label: 'Communication', value: 'LoRa or LoRaWAN; datasheet also describes GPRS/3G reading options' },
              { label: 'Battery', value: '2 x ER26500, 3.6 V, 19000 mAh total stated capacity' },
              { label: 'Enclosure rating', value: 'IP68' },
            ],
            applications: [
              'Utility and community water projects requiring remote reading',
              'Installations where a no-moving-parts measuring principle is preferred',
              'LoRaWAN AMI deployments with gateways and a back-end system',
            ],
            confirmBeforeQuote: [
              'Pipe size, expected flow range, pressure, and temperature',
              'Body material and installation orientation',
              'CIU, valve, reporting interval, and remote-control workflow',
              'LoRaWAN frequency, gateway plan, and destination requirements',
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Gas Meter',
    slug: 'sts-prepaid-gas-meter',
    description: 'Smart STS prepaid gas meters for residential and commercial applications',
    image: '/images/products/gas/prepaid-gas-meter.jpg',
    subCategories: [
      {
        name: 'Gas Meter',
        variants: [
          {
            id: 'ca768-lorawan',
            slug: 'ca768-lorawan-sts-prepaid-gas-meter',
            model: 'CA768-K02',
            name: 'CA768-K02 Smart STS Prepaid Gas Meter',
            description: 'STS prepaid gas meter with valve control and LoRaWAN communication for residential and commercial projects that need token-based credit management, remote reading, and operator visibility.',
            image: '/images/products/gas/ca768-1.png',
            specs: [
              { label: 'Specification (PDF)', pdf: '/specs/gas-meter/CA768-LoRaWAN.pdf' },
            ],
            highlights: [
              'Diaphragm gas meter with keypad STS token recharge',
              'G1.6, G2.5, and G4 flow configurations in the datasheet',
              'Low-credit and low-battery alerts',
              'Optional LoRaWAN, NB-IoT, GPRS, or 3G communication',
            ],
            verifiedSpecs: [
              { label: 'Meter types', value: 'G1.6, G2.5, or G4' },
              { label: 'Nominal flow', value: '1.6, 2.5, or 4 m3/h by type' },
              { label: 'Maximum flow', value: '2.5, 4, or 6 m3/h by type' },
              { label: 'Working pressure', value: '0.5-50 kPa' },
              { label: 'Prepayment input', value: '20-digit token by keypad' },
              { label: 'Communication options', value: 'LoRaWAN, NB-IoT, GPRS, or 3G' },
              { label: 'Valve function', value: 'Optional valve-leakage warning described in the datasheet' },
            ],
            applications: [
              'Residential and commercial prepaid gas service',
              'Projects requiring token credit control and remote meter reading',
              'Gas utility deployments using a separate customer interface where needed',
            ],
            confirmBeforeQuote: [
              'Gas type, meter size, flow range, and service pressure',
              'Installation orientation and environmental conditions',
              'Valve close/reopen policy and customer recharge method',
              'Communication network, destination standards, and pilot acceptance tests',
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'CIU (Customer Interface Unit)',
    description: 'Customer interface units for in-home display and token management',
    image: '/images/products/ciu/ciu.png',
    variants: [
      {
        id: 'ciu',
        name: 'Customer Interface Unit (CIU)',
        description: 'In-home display unit for token entry, credit balance checking, and consumption monitoring.',
        image: '/images/products/ciu/ciu.png',
        specs: [],
      },
    ],
  },
  {
    name: 'DCU (Data Concentrator Unit)',
    description: 'Data concentrators for AMI network data aggregation',
    image: '/images/products/dcu/dcu.png',
    variants: [
      {
        id: 'dcu',
        name: 'Data Concentrator Unit (DCU)',
        description: 'Data concentrator for collecting and transmitting meter data in AMI systems.',
        image: '/images/products/dcu/dcu.png',
        specs: [
          { label: 'Specification (PDF)', pdf: '/specs/dcu/CAL-II03.pdf' },
        ],
      },
    ],
  },
  {
    name: 'Gateway',
    description: 'LoRaWAN gateways for IoT meter connectivity',
    image: '/images/products/gateway/gateway.png',
    variants: [
      {
        id: 'gateway',
        name: 'LoRaWAN Gateway',
        description: 'Industrial LoRaWAN gateway for connecting smart meters to the cloud network.',
        image: '/images/products/gateway/gateway.png',
        specs: [
          { label: 'Specification (PDF)', pdf: '/specs/gateway/CAL-025.pdf' },
        ],
      },
    ],
  },
];
