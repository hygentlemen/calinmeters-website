export interface Certificate {
  name: string;
  file: string;
  type: 'image' | 'pdf';
}

export interface CertificateCategory {
  name: string;
  items: Certificate[];
}

export const companyCertificates: Certificate[] = [
  { name: 'ISO 9001 (2022-2025)', file: '/certificates/ISO9001 2022-2025.pdf', type: 'pdf' },
  { name: 'ISO 14001', file: '/certificates/ISO 14001.pdf', type: 'pdf' },
  { name: 'ISO 45001', file: '/certificates/ISO45001.pdf', type: 'pdf' },
  { name: 'Environmental Management System 14001', file: '/certificates/ENVIRONMENTAL MANAGEMENT SYSTEM 14001 270904.pdf', type: 'pdf' },
  { name: 'OH&S Management System 45001', file: '/certificates/OCCUPATIONAL HEALTH AND SAFETY MANAGEMENT SYSTEM 45001270904.pdf', type: 'pdf' },
  { name: 'DLMS Certificate of Membership', file: '/certificates/2025 DLMS certificate of membership.pdf', type: 'pdf' },
  { name: 'NSI CalinMeter', file: '/certificates/NSI CalinMeter.jpg', type: 'image' },
  { name: 'Business License (English)', file: '/certificates/英文营业执照认证.pdf', type: 'pdf' },
];

export const productCertificates: CertificateCategory[] = [
  {
    name: 'Energy Meter',
    items: [
      { name: '1 Phase UNBS Certificate', file: '/certificates/energy-meter/1 Phase UNBS Certificate.pdf', type: 'pdf' },
      { name: '3 Phase UNBS Certificate', file: '/certificates/energy-meter/3 Phase  UNBS Certificate.pdf', type: 'pdf' },
      { name: 'SONCAP Certification', file: '/certificates/energy-meter/5 SONCAP product certification.pdf', type: 'pdf' },
      { name: 'CA168 STS Certificate', file: '/certificates/energy-meter/CA168 STS.pdf', type: 'pdf' },
      { name: 'DLMS Product Certificate (3-Phase)', file: '/certificates/energy-meter/DLMS-UA-3234-Product-Certificate-Three-Phase-Smart-Energy-Meter.pdf', type: 'pdf' },
      { name: 'KEMA Certificate', file: '/certificates/energy-meter/KEMA-certificate.pdf', type: 'pdf' },
      { name: 'MID M4 Certificate', file: '/certificates/energy-meter/MID M4 69268271 0001_extsigned-signed.pdf', type: 'pdf' },
      { name: 'NEMSA DCES 1-Phase', file: '/certificates/energy-meter/NEMSA _DCES_1phase2023.pdf', type: 'pdf' },
      { name: 'NEMSA DCES 3-Phase', file: '/certificates/energy-meter/NEMSA _DCES_3phase 2023.pdf', type: 'pdf' },
      { name: 'NEMSA (Nigeria)', file: '/certificates/energy-meter/NIGERIAN ELECTRICITY MANAGEMENT SERVICES AGENCY.pdf', type: 'pdf' },
      { name: 'SABS Certificate', file: '/certificates/energy-meter/SABS.pdf', type: 'pdf' },
      { name: 'Test Report CA168-M (2025)', file: '/certificates/energy-meter/Test Report - CA168-M Single Phase Smart Energy Meter 2025.pdf', type: 'pdf' },
      { name: 'Test Report CA368-M (2025)', file: '/certificates/energy-meter/Test Report- CA368-M Three Phase Smart Energy Meter 2025.pdf', type: 'pdf' },
    ],
  },
  {
    name: 'Water Meter',
    items: [
      { name: 'CE Certification', file: '/certificates/water-meter/CE certification for water meter - Calin.pdf', type: 'pdf' },
      { name: 'MID-B Certificate CA568', file: '/certificates/water-meter/MID-B 证书CA568 Water meter.pdf', type: 'pdf' },
      { name: 'MID-B Annex & Test Report', file: '/certificates/water-meter/MID-B 附件和测试报告CA568 Annexture.pdf', type: 'pdf' },
      { name: 'NSI Certificate', file: '/certificates/water-meter/NSI.jpeg', type: 'image' },
      { name: 'STS Certificate CA568', file: '/certificates/water-meter/STS -SHENZHEN CALINMETER CO., LTD. WATER METER CA568 V1.0 NUMBER 1649.pdf', type: 'pdf' },
    ],
  },
  {
    name: 'Gas Meter',
    items: [
      { name: 'CA768 STS Certificate', file: '/certificates/gas-meter/CA768 STS.pdf', type: 'pdf' },
      { name: 'IT 069-24-2213', file: '/certificates/gas-meter/IT 069-24-2213_rev0 calinmeter.pdf', type: 'pdf' },
      { name: 'Explosion Proof Certificate', file: '/certificates/gas-meter/防爆合格证 英文 SKMBT_42323072718270.pdf', type: 'pdf' },
    ],
  },
];

export const shippingCertificates: Certificate[] = [
  { name: 'Gas Meter - Sea Freight (ER26500-2025)', file: '/certificates/shipping/gas/By Sea-ER26500-Y2025.pdf', type: 'pdf' },
  { name: 'Gas Meter - UN38.3', file: '/certificates/shipping/gas/ER26500 UN38.3(2).pdf', type: 'pdf' },
  { name: 'Gas Meter - MSDS 2025', file: '/certificates/shipping/gas/ER26500-MSDS-2025.pdf', type: 'pdf' },
];
