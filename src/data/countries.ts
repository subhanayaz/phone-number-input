export interface CountryMeta {
  iso2: string;
  name: string;
  dialCode: string;
  minLength: number;
  maxLength: number;
  format: string;
  priority?: number;
  areaCodes?: string[];
}

type RawCountryEntry = Omit<CountryMeta, 'iso2' | 'format'>;

const buildDefaultFormat = (length: number): string => {
  const groups: string[] = [];
  let remaining = length;
  while (remaining > 0) {
    const chunk = Math.min(3, remaining);
    groups.push('X'.repeat(chunk));
    remaining -= chunk;
  }
  return groups.join(' ');
};

const rawCountryData: Record<string, RawCountryEntry> = {
  AD: { name: 'Andorra', dialCode: '+376', minLength: 6, maxLength: 6 },
  AE: { name: 'United Arab Emirates', dialCode: '+971', minLength: 9, maxLength: 9 },
  AF: { name: 'Afghanistan', dialCode: '+93', minLength: 9, maxLength: 9 },
  AG: { name: 'Antigua & Barbuda', dialCode: '+1268', minLength: 10, maxLength: 10 },
  AI: { name: 'Anguilla', dialCode: '+1264', minLength: 10, maxLength: 10 },
  AL: { name: 'Albania', dialCode: '+355', minLength: 9, maxLength: 9 },
  AM: { name: 'Armenia', dialCode: '+374', minLength: 8, maxLength: 8 },
  AO: { name: 'Angola', dialCode: '+244', minLength: 9, maxLength: 9 },
  AR: { name: 'Argentina', dialCode: '+54', minLength: 10, maxLength: 10 },
  AS: { name: 'American Samoa', dialCode: '+1684', minLength: 10, maxLength: 10 },
  AT: { name: 'Austria', dialCode: '+43', minLength: 10, maxLength: 10 },
  AU: { name: 'Australia', dialCode: '+61', minLength: 9, maxLength: 9 },
  AW: { name: 'Aruba', dialCode: '+297', minLength: 7, maxLength: 7 },
  AX: { name: 'Åland Islands', dialCode: '+358', minLength: 9, maxLength: 9 },
  AZ: { name: 'Azerbaijan', dialCode: '+994', minLength: 9, maxLength: 9 },
  BA: { name: 'Bosnia & Herzegovina', dialCode: '+387', minLength: 8, maxLength: 9 },
  BB: { name: 'Barbados', dialCode: '+1246', minLength: 10, maxLength: 10 },
  BD: { name: 'Bangladesh', dialCode: '+880', minLength: 10, maxLength: 10 },
  BE: { name: 'Belgium', dialCode: '+32', minLength: 9, maxLength: 9 },
  BF: { name: 'Burkina Faso', dialCode: '+226', minLength: 8, maxLength: 8 },
  BG: { name: 'Bulgaria', dialCode: '+359', minLength: 9, maxLength: 9 },
  BH: { name: 'Bahrain', dialCode: '+973', minLength: 8, maxLength: 8 },
  BI: { name: 'Burundi', dialCode: '+257', minLength: 8, maxLength: 8 },
  BJ: { name: 'Benin', dialCode: '+229', minLength: 8, maxLength: 8 },
  BL: { name: 'Saint Barthélemy', dialCode: '+590', minLength: 10, maxLength: 10 },
  BM: { name: 'Bermuda', dialCode: '+1441', minLength: 10, maxLength: 10 },
  BN: { name: 'Brunei Darussalam', dialCode: '+673', minLength: 7, maxLength: 7 },
  BO: { name: 'Bolivia', dialCode: '+591', minLength: 8, maxLength: 8 },
  BQ: { name: 'Caribbean Netherlands', dialCode: '+599', minLength: 7, maxLength: 7 },
  BR: { name: 'Brazil', dialCode: '+55', minLength: 10, maxLength: 11 },
  BS: { name: 'Bahamas', dialCode: '+1242', minLength: 10, maxLength: 10 },
  BT: { name: 'Bhutan', dialCode: '+975', minLength: 8, maxLength: 8 },
  BV: { name: 'Bouvet Island', dialCode: '+47', minLength: 8, maxLength: 8 },
  BW: { name: 'Botswana', dialCode: '+267', minLength: 8, maxLength: 8 },
  BY: { name: 'Belarus', dialCode: '+375', minLength: 9, maxLength: 9 },
  BZ: { name: 'Belize', dialCode: '+501', minLength: 7, maxLength: 7 },
  CA: { name: 'Canada', dialCode: '+1', minLength: 10, maxLength: 10 },
  CC: { name: 'Cocos (Keeling) Islands', dialCode: '+61', minLength: 10, maxLength: 10 },
  CD: { name: 'Congo (Kinshasa)', dialCode: '+243', minLength: 9, maxLength: 9 },
  CF: { name: 'Central African Republic', dialCode: '+236', minLength: 8, maxLength: 8 },
  CG: { name: 'Congo (Brazzaville)', dialCode: '+242', minLength: 8, maxLength: 8 },
  CH: { name: 'Switzerland', dialCode: '+41', minLength: 9, maxLength: 10 },
  CI: { name: 'Côte d’Ivoire', dialCode: '+225', minLength: 8, maxLength: 10 },
  CK: { name: 'Cook Islands', dialCode: '+682', minLength: 6, maxLength: 6 },
  CL: { name: 'Chile', dialCode: '+56', minLength: 9, maxLength: 9 },
  CM: { name: 'Cameroon', dialCode: '+237', minLength: 8, maxLength: 9 },
  CN: { name: 'China', dialCode: '+86', minLength: 11, maxLength: 11 },
  CO: { name: 'Colombia', dialCode: '+57', minLength: 10, maxLength: 10 },
  CR: { name: 'Costa Rica', dialCode: '+506', minLength: 8, maxLength: 8 },
  CU: { name: 'Cuba', dialCode: '+53', minLength: 9, maxLength: 9 },
  CV: { name: 'Cape Verde', dialCode: '+238', minLength: 7, maxLength: 7 },
  CW: { name: 'Curaçao', dialCode: '+599', minLength: 7, maxLength: 7 },
  CX: { name: 'Christmas Island', dialCode: '+61', minLength: 10, maxLength: 10 },
  CY: { name: 'Cyprus', dialCode: '+357', minLength: 8, maxLength: 10 },
  CZ: { name: 'Czech Republic', dialCode: '+420', minLength: 9, maxLength: 9 },
  DE: { name: 'Germany', dialCode: '+49', minLength: 10, maxLength: 11 },
  DJ: { name: 'Djibouti', dialCode: '+253', minLength: 8, maxLength: 8 },
  DK: { name: 'Denmark', dialCode: '+45', minLength: 8, maxLength: 8 },
  DM: { name: 'Dominica', dialCode: '+1767', minLength: 10, maxLength: 10 },
  DO: { name: 'Dominican Republic', dialCode: '+1809', minLength: 10, maxLength: 10 },
  DZ: { name: 'Algeria', dialCode: '+213', minLength: 9, maxLength: 9 },
  EC: { name: 'Ecuador', dialCode: '+593', minLength: 9, maxLength: 9 },
  EE: { name: 'Estonia', dialCode: '+372', minLength: 7, maxLength: 8 },
  EG: { name: 'Egypt', dialCode: '+20', minLength: 9, maxLength: 10 },
  ER: { name: 'Eritrea', dialCode: '+291', minLength: 7, maxLength: 7 },
  ES: { name: 'Spain', dialCode: '+34', minLength: 9, maxLength: 9 },
  ET: { name: 'Ethiopia', dialCode: '+251', minLength: 9, maxLength: 9 },
  FI: { name: 'Finland', dialCode: '+358', minLength: 9, maxLength: 9 },
  FJ: { name: 'Fiji', dialCode: '+679', minLength: 7, maxLength: 7 },
  FK: { name: 'Falkland Islands', dialCode: '+500', minLength: 5, maxLength: 5 },
  FM: { name: 'Micronesia', dialCode: '+691', minLength: 7, maxLength: 7 },
  FO: { name: 'Faroe Islands', dialCode: '+298', minLength: 6, maxLength: 6 },
  FR: { name: 'France', dialCode: '+33', minLength: 9, maxLength: 9 },
  GA: { name: 'Gabon', dialCode: '+241', minLength: 7, maxLength: 8 },
  GB: { name: 'United Kingdom', dialCode: '+44', minLength: 10, maxLength: 10 },
  GD: { name: 'Grenada', dialCode: '+1473', minLength: 10, maxLength: 10 },
  GE: { name: 'Georgia', dialCode: '+995', minLength: 9, maxLength: 9 },
  GF: { name: 'French Guiana', dialCode: '+594', minLength: 10, maxLength: 10 },
  GG: { name: 'Guernsey', dialCode: '+44', minLength: 10, maxLength: 10 },
  GH: { name: 'Ghana', dialCode: '+233', minLength: 9, maxLength: 9 },
  GI: { name: 'Gibraltar', dialCode: '+350', minLength: 8, maxLength: 8 },
  GL: { name: 'Greenland', dialCode: '+299', minLength: 6, maxLength: 6 },
  GM: { name: 'Gambia', dialCode: '+220', minLength: 7, maxLength: 7 },
  GN: { name: 'Guinea', dialCode: '+224', minLength: 8, maxLength: 8 },
  GP: { name: 'Guadeloupe', dialCode: '+590', minLength: 10, maxLength: 10 },
  GQ: { name: 'Equatorial Guinea', dialCode: '+240', minLength: 9, maxLength: 9 },
  GR: { name: 'Greece', dialCode: '+30', minLength: 10, maxLength: 10 },
  GT: { name: 'Guatemala', dialCode: '+502', minLength: 8, maxLength: 8 },
  GU: { name: 'Guam', dialCode: '+1671', minLength: 10, maxLength: 10 },
  GW: { name: 'Guinea-Bissau', dialCode: '+245', minLength: 8, maxLength: 8 },
  GY: { name: 'Guyana', dialCode: '+592', minLength: 7, maxLength: 7 },
  HK: { name: 'Hong Kong', dialCode: '+852', minLength: 8, maxLength: 8 },
  HM: { name: 'Heard & McDonald Islands', dialCode: '+61', minLength: 10, maxLength: 10 },
  HN: { name: 'Honduras', dialCode: '+504', minLength: 8, maxLength: 8 },
  HR: { name: 'Croatia', dialCode: '+385', minLength: 9, maxLength: 9 },
  HT: { name: 'Haiti', dialCode: '+509', minLength: 8, maxLength: 8 },
  HU: { name: 'Hungary', dialCode: '+36', minLength: 9, maxLength: 9 },
  ID: { name: 'Indonesia', dialCode: '+62', minLength: 10, maxLength: 11 },
  IE: { name: 'Ireland', dialCode: '+353', minLength: 9, maxLength: 9 },
  IL: { name: 'Israel', dialCode: '+972', minLength: 9, maxLength: 9 },
  IM: { name: 'Isle of Man', dialCode: '+44', minLength: 10, maxLength: 10 },
  IN: { name: 'India', dialCode: '+91', minLength: 10, maxLength: 10 },
  IO: { name: 'British Indian Ocean Territory', dialCode: '+246', minLength: 7, maxLength: 7 },
  IQ: { name: 'Iraq', dialCode: '+964', minLength: 10, maxLength: 10 },
  IR: { name: 'Iran', dialCode: '+98', minLength: 10, maxLength: 10 },
  IS: { name: 'Iceland', dialCode: '+354', minLength: 7, maxLength: 7 },
  IT: { name: 'Italy', dialCode: '+39', minLength: 10, maxLength: 10 },
  JE: { name: 'Jersey', dialCode: '+44', minLength: 10, maxLength: 10 },
  JM: { name: 'Jamaica', dialCode: '+1876', minLength: 10, maxLength: 10 },
  JO: { name: 'Jordan', dialCode: '+962', minLength: 9, maxLength: 9 },
  JP: { name: 'Japan', dialCode: '+81', minLength: 10, maxLength: 11 },
  KE: { name: 'Kenya', dialCode: '+254', minLength: 9, maxLength: 9 },
  KG: { name: 'Kyrgyzstan', dialCode: '+996', minLength: 9, maxLength: 9 },
  KH: { name: 'Cambodia', dialCode: '+855', minLength: 9, maxLength: 9 },
  KI: { name: 'Kiribati', dialCode: '+686', minLength: 7, maxLength: 7 },
  KM: { name: 'Comoros', dialCode: '+269', minLength: 7, maxLength: 7 },
  KN: { name: 'Saint Kitts & Nevis', dialCode: '+1869', minLength: 10, maxLength: 10 },
  KP: { name: 'North Korea', dialCode: '+850', minLength: 9, maxLength: 9 },
  KR: { name: 'South Korea', dialCode: '+82', minLength: 10, maxLength: 10 },
  KW: { name: 'Kuwait', dialCode: '+965', minLength: 8, maxLength: 8 },
  KY: { name: 'Cayman Islands', dialCode: '+1345', minLength: 10, maxLength: 10 },
  KZ: { name: 'Kazakhstan', dialCode: '+7', minLength: 10, maxLength: 10 },
  LA: { name: 'Laos', dialCode: '+856', minLength: 9, maxLength: 9 },
  LB: { name: 'Lebanon', dialCode: '+961', minLength: 8, maxLength: 8 },
  LC: { name: 'Saint Lucia', dialCode: '+1758', minLength: 10, maxLength: 10 },
  LI: { name: 'Liechtenstein', dialCode: '+423', minLength: 8, maxLength: 8 },
  LK: { name: 'Sri Lanka', dialCode: '+94', minLength: 9, maxLength: 9 },
  LR: { name: 'Liberia', dialCode: '+231', minLength: 7, maxLength: 7 },
  LS: { name: 'Lesotho', dialCode: '+266', minLength: 9, maxLength: 9 },
  LT: { name: 'Lithuania', dialCode: '+370', minLength: 8, maxLength: 8 },
  LU: { name: 'Luxembourg', dialCode: '+352', minLength: 9, maxLength: 9 },
  LV: { name: 'Latvia', dialCode: '+371', minLength: 8, maxLength: 8 },
  LY: { name: 'Libya', dialCode: '+218', minLength: 9, maxLength: 9 },
  MA: { name: 'Morocco', dialCode: '+212', minLength: 9, maxLength: 9 },
  MC: { name: 'Monaco', dialCode: '+377', minLength: 10, maxLength: 10 },
  MD: { name: 'Moldova', dialCode: '+373', minLength: 8, maxLength: 8 },
  ME: { name: 'Montenegro', dialCode: '+382', minLength: 8, maxLength: 8 },
  MF: { name: 'Saint Martin', dialCode: '+1599', minLength: 10, maxLength: 10 },
  MG: { name: 'Madagascar', dialCode: '+261', minLength: 9, maxLength: 9 },
  MH: { name: 'Marshall Islands', dialCode: '+692', minLength: 7, maxLength: 7 },
  MK: { name: 'North Macedonia', dialCode: '+389', minLength: 8, maxLength: 9 },
  ML: { name: 'Mali', dialCode: '+223', minLength: 8, maxLength: 8 },
  MM: { name: 'Myanmar', dialCode: '+95', minLength: 9, maxLength: 9 },
  MN: { name: 'Mongolia', dialCode: '+976', minLength: 8, maxLength: 8 },
  MO: { name: 'Macao', dialCode: '+853', minLength: 8, maxLength: 8 },
  MP: { name: 'Northern Mariana Islands', dialCode: '+1670', minLength: 10, maxLength: 10 },
  MQ: { name: 'Martinique', dialCode: '+596', minLength: 7, maxLength: 7 },
  MR: { name: 'Mauritania', dialCode: '+222', minLength: 8, maxLength: 8 },
  MS: { name: 'Montserrat', dialCode: '+1664', minLength: 10, maxLength: 10 },
  MT: { name: 'Malta', dialCode: '+356', minLength: 8, maxLength: 8 },
  MU: { name: 'Mauritius', dialCode: '+230', minLength: 7, maxLength: 7 },
  MV: { name: 'Maldives', dialCode: '+960', minLength: 7, maxLength: 7 },
  MW: { name: 'Malawi', dialCode: '+265', minLength: 9, maxLength: 9 },
  MX: { name: 'Mexico', dialCode: '+52', minLength: 10, maxLength: 10 },
  MY: { name: 'Malaysia', dialCode: '+60', minLength: 9, maxLength: 10 },
  MZ: { name: 'Mozambique', dialCode: '+258', minLength: 9, maxLength: 9 },
  NA: { name: 'Namibia', dialCode: '+264', minLength: 9, maxLength: 9 },
  NC: { name: 'New Caledonia', dialCode: '+687', minLength: 6, maxLength: 6 },
  NE: { name: 'Niger', dialCode: '+227', minLength: 8, maxLength: 8 },
  NF: { name: 'Norfolk Island', dialCode: '+672', minLength: 10, maxLength: 10 },
  NG: { name: 'Nigeria', dialCode: '+234', minLength: 10, maxLength: 10 },
  NI: { name: 'Nicaragua', dialCode: '+505', minLength: 8, maxLength: 8 },
  NL: { name: 'Netherlands', dialCode: '+31', minLength: 9, maxLength: 9 },
  NO: { name: 'Norway', dialCode: '+47', minLength: 8, maxLength: 8 },
  NP: { name: 'Nepal', dialCode: '+977', minLength: 10, maxLength: 10 },
  NR: { name: 'Nauru', dialCode: '+674', minLength: 7, maxLength: 7 },
  NU: { name: 'Niue', dialCode: '+683', minLength: 4, maxLength: 4 },
  NZ: { name: 'New Zealand', dialCode: '+64', minLength: 9, maxLength: 9 },
  OM: { name: 'Oman', dialCode: '+968', minLength: 8, maxLength: 8 },
  PA: { name: 'Panama', dialCode: '+507', minLength: 8, maxLength: 8 },
  PE: { name: 'Peru', dialCode: '+51', minLength: 9, maxLength: 9 },
  PF: { name: 'French Polynesia', dialCode: '+689', minLength: 6, maxLength: 6 },
  PG: { name: 'Papua New Guinea', dialCode: '+675', minLength: 7, maxLength: 7 },
  PH: { name: 'Philippines', dialCode: '+63', minLength: 10, maxLength: 11 },
  PK: { name: 'Pakistan', dialCode: '+92', minLength: 10, maxLength: 10 },
  PL: { name: 'Poland', dialCode: '+48', minLength: 9, maxLength: 9 },
  PM: { name: 'Saint Pierre & Miquelon', dialCode: '+508', minLength: 6, maxLength: 6 },
  PN: { name: 'Pitcairn Islands', dialCode: '+64', minLength: 6, maxLength: 6 },
  PR: { name: 'Puerto Rico', dialCode: '+1787', minLength: 10, maxLength: 10 },
  PS: { name: 'Palestine', dialCode: '+970', minLength: 9, maxLength: 9 },
  PT: { name: 'Portugal', dialCode: '+351', minLength: 9, maxLength: 9 },
  PW: { name: 'Palau', dialCode: '+680', minLength: 7, maxLength: 7 },
  PY: { name: 'Paraguay', dialCode: '+595', minLength: 9, maxLength: 9 },
  QA: { name: 'Qatar', dialCode: '+974', minLength: 8, maxLength: 8 },
  RE: { name: 'Réunion', dialCode: '+262', minLength: 9, maxLength: 9 },
  RO: { name: 'Romania', dialCode: '+40', minLength: 9, maxLength: 10 },
  RS: { name: 'Serbia', dialCode: '+381', minLength: 8, maxLength: 9 },
  RU: { name: 'Russia', dialCode: '+7', minLength: 10, maxLength: 10 },
  RW: { name: 'Rwanda', dialCode: '+250', minLength: 9, maxLength: 9 },
  SA: { name: 'Saudi Arabia', dialCode: '+966', minLength: 9, maxLength: 9 },
  SB: { name: 'Solomon Islands', dialCode: '+677', minLength: 7, maxLength: 7 },
  SC: { name: 'Seychelles', dialCode: '+248', minLength: 7, maxLength: 7 },
  SD: { name: 'Sudan', dialCode: '+249', minLength: 9, maxLength: 9 },
  SE: { name: 'Sweden', dialCode: '+46', minLength: 9, maxLength: 9 },
  SG: { name: 'Singapore', dialCode: '+65', minLength: 8, maxLength: 8 },
  SH: { name: 'Saint Helena', dialCode: '+290', minLength: 9, maxLength: 9 },
  SI: { name: 'Slovenia', dialCode: '+386', minLength: 8, maxLength: 8 },
  SJ: { name: 'Svalbard & Jan Mayen', dialCode: '+47', minLength: 8, maxLength: 8 },
  SK: { name: 'Slovakia', dialCode: '+421', minLength: 9, maxLength: 9 },
  SL: { name: 'Sierra Leone', dialCode: '+232', minLength: 9, maxLength: 9 },
  SM: { name: 'San Marino', dialCode: '+378', minLength: 9, maxLength: 9 },
  SN: { name: 'Senegal', dialCode: '+221', minLength: 9, maxLength: 9 },
  SO: { name: 'Somalia', dialCode: '+252', minLength: 8, maxLength: 8 },
  SR: { name: 'Suriname', dialCode: '+597', minLength: 7, maxLength: 7 },
  SS: { name: 'South Sudan', dialCode: '+211', minLength: 9, maxLength: 9 },
  ST: { name: 'Sao Tome & Principe', dialCode: '+239', minLength: 7, maxLength: 7 },
  SV: { name: 'El Salvador', dialCode: '+503', minLength: 8, maxLength: 8 },
  SX: { name: 'Sint Maarten', dialCode: '+1721', minLength: 10, maxLength: 10 },
  SY: { name: 'Syria', dialCode: '+963', minLength: 9, maxLength: 9 },
  SZ: { name: 'Eswatini', dialCode: '+268', minLength: 9, maxLength: 9 },
  TC: { name: 'Turks & Caicos Islands', dialCode: '+1649', minLength: 10, maxLength: 10 },
  TD: { name: 'Chad', dialCode: '+235', minLength: 8, maxLength: 8 },
  TF: { name: 'French Southern Territories', dialCode: '+262', minLength: 9, maxLength: 9 },
  TG: { name: 'Togo', dialCode: '+228', minLength: 8, maxLength: 8 },
  TH: { name: 'Thailand', dialCode: '+66', minLength: 9, maxLength: 10 },
  TJ: { name: 'Tajikistan', dialCode: '+992', minLength: 9, maxLength: 9 },
  TK: { name: 'Tokelau', dialCode: '+690', minLength: 5, maxLength: 5 },
  TL: { name: 'Timor-Leste', dialCode: '+670', minLength: 7, maxLength: 7 },
  TM: { name: 'Turkmenistan', dialCode: '+993', minLength: 8, maxLength: 8 },
  TN: { name: 'Tunisia', dialCode: '+216', minLength: 8, maxLength: 8 },
  TO: { name: 'Tonga', dialCode: '+676', minLength: 6, maxLength: 6 },
  TR: { name: 'Turkey', dialCode: '+90', minLength: 10, maxLength: 10 },
  TT: { name: 'Trinidad & Tobago', dialCode: '+1868', minLength: 10, maxLength: 10 },
  TV: { name: 'Tuvalu', dialCode: '+688', minLength: 5, maxLength: 5 },
  TW: { name: 'Taiwan', dialCode: '+886', minLength: 9, maxLength: 9 },
  TZ: { name: 'Tanzania', dialCode: '+255', minLength: 9, maxLength: 9 },
  UA: { name: 'Ukraine', dialCode: '+380', minLength: 9, maxLength: 9 },
  UG: { name: 'Uganda', dialCode: '+256', minLength: 9, maxLength: 9 },
  UM: { name: 'U.S. Minor Outlying Islands', dialCode: '+1808', minLength: 10, maxLength: 10 },
  US: { name: 'United States', dialCode: '+1', minLength: 10, maxLength: 10 },
  UY: { name: 'Uruguay', dialCode: '+598', minLength: 9, maxLength: 9 },
  UZ: { name: 'Uzbekistan', dialCode: '+998', minLength: 9, maxLength: 9 },
  VA: { name: 'Vatican City', dialCode: '+379', minLength: 10, maxLength: 10 },
  VC: { name: 'Saint Vincent & the Grenadines', dialCode: '+1784', minLength: 10, maxLength: 10 },
  VE: { name: 'Venezuela', dialCode: '+58', minLength: 10, maxLength: 10 },
  VG: { name: 'British Virgin Islands', dialCode: '+1284', minLength: 10, maxLength: 10 },
  VI: { name: 'U.S. Virgin Islands', dialCode: '+1340', minLength: 10, maxLength: 10 },
  VN: { name: 'Vietnam', dialCode: '+84', minLength: 9, maxLength: 10 },
  VU: { name: 'Vanuatu', dialCode: '+678', minLength: 6, maxLength: 6 },
  WF: { name: 'Wallis & Futuna', dialCode: '+681', minLength: 6, maxLength: 6 },
  WS: { name: 'Samoa', dialCode: '+685', minLength: 7, maxLength: 7 },
  YE: { name: 'Yemen', dialCode: '+967', minLength: 9, maxLength: 9 },
  YT: { name: 'Mayotte', dialCode: '+262', minLength: 9, maxLength: 9 },
  ZA: { name: 'South Africa', dialCode: '+27', minLength: 9, maxLength: 9 },
  ZM: { name: 'Zambia', dialCode: '+260', minLength: 9, maxLength: 9 },
  ZW: { name: 'Zimbabwe', dialCode: '+263', minLength: 9, maxLength: 9 },
  EH: { name: 'Western Sahara', dialCode: '+212', minLength: 9, maxLength: 9 }
};

export const countries: CountryMeta[] = Object.entries(rawCountryData).map(([iso2, meta]) => ({
  iso2,
  ...meta,
  format: buildDefaultFormat(meta.maxLength)
}));

const countriesByDialCodeList = [...countries].sort((a, b) => {
  const cleanA = a.dialCode.replace('+', '');
  const cleanB = b.dialCode.replace('+', '');
  return cleanB.length - cleanA.length || cleanA.localeCompare(cleanB);
});

export const findCountryByDialCode = (digits: string): CountryMeta | undefined => {
  const normalized = digits.replace(/\D/g, '');
  for (const country of countriesByDialCodeList) {
    const normalizedDial = country.dialCode.replace('+', '');
    if (normalized.startsWith(normalizedDial)) {
      return country;
    }
  }
  return undefined;
};

export const countriesByIso = countries.reduce<Record<string, CountryMeta>>((acc, country) => {
  acc[country.iso2] = country;
  return acc;
}, {});

export const getCountryByIso = (iso?: string): CountryMeta | undefined => {
  if (!iso) return undefined;
  return countriesByIso[iso.toUpperCase()];
};

export const detectCountryFromLocale = (options?: { locale?: string; fallback?: string }): CountryMeta => {
  const fallbackIso = (options?.fallback ?? 'US').toUpperCase();
  let locale = options?.locale;
  if (!locale && typeof navigator !== 'undefined') {
    locale = navigator.language;
  }
  if (locale) {
    const parts = locale.split(/[-_]/);
    const maybeIso = parts[parts.length - 1];
    const candidate = getCountryByIso(maybeIso);
    if (candidate) {
      return candidate;
    }
  }
  return getCountryByIso(fallbackIso) ?? countries[0];
};

export const toFlagEmoji = (iso2: string): string => {
  if (!iso2) return '';
  return iso2
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65))
    .join('');
};
