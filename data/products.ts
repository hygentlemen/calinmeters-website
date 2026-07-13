export interface ProductSpec {
  label: string;
  pdf: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  description: string;
  image: string;
  specs: ProductSpec[];
}

export interface ProductSubCategory {
  name: string;
  variants: ProductVariant[];
}

export interface ProductCategory {
  name: string;
  description: string;
  image: string;
  subCategories?: ProductSubCategory[];
  variants?: ProductVariant[];
}

export const productCategories: ProductCategory[] = [
  {
    name: 'Energy Meter',
    description: 'STS prepaid electricity meters for residential and commercial use',
    image: '/images/products/electricity/single-phase.jpg',
    subCategories: [
      {
        name: 'Single Phase Energy Meter',
        variants: [
          {
            id: 'ca168-lorawan',
            name: 'CA168 Smart STS Prepaid DIN Rail Energy Meter (LoRaWAN)',
            description: 'DIN rail STS prepaid energy meter with LoRaWAN communication for remote meter reading and token management.',
            image: '/images/products/electricity/ca168-lorawan-1.png',
            specs: [
              { label: 'Specification (PDF)', pdf: '/specs/energy-meter/CA168-LoRaWAN.pdf' },
            ],
          },
          {
            id: 'ca168-gprs',
            name: 'CA168 Smart STS Prepaid Energy Meter (GPRS)',
            description: 'STS prepaid single-phase meter with GPRS communication for remote monitoring and control.',
            image: '/images/products/electricity/ca168-gprs-1.png',
            specs: [
              { label: 'Specification (PDF)', pdf: '/specs/energy-meter/CA168-GPRS.pdf' },
            ],
          },
          {
            id: 'ca168-sts',
            name: 'CA168 STS Prepaid Energy Meter',
            description: 'Standard STS prepaid single-phase energy meter with keypad for token entry.',
            image: '/images/products/electricity/ca168-sts-1.jpg',
            specs: [],
          },
        ],
      },
      {
        name: 'Three Phase Energy Meter',
        variants: [
          {
            id: 'ca368-gprs',
            name: 'CA368 Smart STS Prepaid Three Phase Energy Meter (GPRS)',
            description: 'Three-phase STS prepaid electricity meter for commercial, industrial, and utility service connections, with GPRS communication for remote reading and management.',
            image: '/images/products/electricity/ca368-gprs-1.png',
            specs: [
              { label: 'Specification (PDF)', pdf: '/specs/energy-meter/CA368-GPRS.pdf' },
            ],
          },
          {
            id: 'ca368-sts',
            name: 'CA368 STS Prepaid Three Phase Energy Meter',
            description: 'Standalone three-phase STS prepaid electricity meter with keypad token entry for projects that do not require always-on remote communication.',
            image: '/images/products/electricity/ca368-sts-1.png',
            specs: [
              { label: 'Specification (PDF)', pdf: '/specs/energy-meter/CA368-STS.pdf' },
            ],
          },
        ],
      },
      {
        name: 'CT Meter',
        variants: [
          {
            id: 'ct-meter',
            name: 'CT Operated Energy Meter',
            description: 'Transformer-operated (CT) energy meter for high-current commercial and industrial metering.',
            image: '/images/products/electricity/ct-meter.jpg',
            specs: [],
          },
        ],
      },
    ],
  },
  {
    name: 'Water Meter',
    description: 'Smart STS prepaid water meters with multiple communication options',
    image: '/images/products/water/prepaid-water-meter.jpg',
    subCategories: [
      {
        name: 'Multi-Jet Water Meter (Plastic)',
        variants: [
          {
            id: 'water-multi-jet-plastic',
            name: 'Smart STS Prepaid Multi-Jet Water Meter - LoRa WAN (Plastic)',
            description: 'Plastic-body multi-jet water meter with STS prepayment and LoRaWAN communication for cost-sensitive residential and community rollouts.',
            image: '/images/products/water/multi-jet-plastic-1.png',
            specs: [
              { label: 'Specification (PDF)', pdf: '/specs/water-meter/Multi-Jet-Plastic.pdf' },
            ],
          },
        ],
      },
      {
        name: 'Multi-Jet Water Meter (Brass)',
        variants: [
          {
            id: 'water-multi-jet-brass',
            name: 'Smart STS Prepaid Multi-Jet Water Meter - LoRa WAN (Brass)',
            description: 'Brass-body multi-jet water meter with STS prepayment and LoRaWAN communication for projects that prefer a stronger metal enclosure in tougher installation environments.',
            image: '/images/products/water/multi-jet-brass-1.png',
            specs: [
              { label: 'Specification (PDF)', pdf: '/specs/water-meter/Multi-Jet-Brass.pdf' },
            ],
          },
        ],
      },
      {
        name: 'Ultrasonic Water Meter',
        variants: [
          {
            id: 'water-ultrasonic',
            name: 'Smart STS Prepaid Ultrasonic Water Meter - LoRa WAN GPRS',
            description: 'STS prepaid ultrasonic water meter with no moving measuring parts and LoRaWAN or GPRS communication for remote utility metering projects.',
            image: '/images/products/water/ultrasonic-1.png',
            specs: [
              { label: 'Specification (PDF)', pdf: '/specs/water-meter/Ultrasonic.pdf' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Gas Meter',
    description: 'Smart STS prepaid gas meters for residential and commercial applications',
    image: '/images/products/gas/prepaid-gas-meter.jpg',
    subCategories: [
      {
        name: 'Gas Meter',
        variants: [
          {
            id: 'ca768-lorawan',
            name: 'CA768 Smart STS Prepaid Gas Meter (LoRa WAN)',
            description: 'STS prepaid gas meter with valve control and LoRaWAN communication for residential and commercial projects that need token-based credit management, remote reading, and operator visibility.',
            image: '/images/products/gas/ca768-1.png',
            specs: [
              { label: 'Specification (PDF)', pdf: '/specs/gas-meter/CA768-LoRaWAN.pdf' },
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
