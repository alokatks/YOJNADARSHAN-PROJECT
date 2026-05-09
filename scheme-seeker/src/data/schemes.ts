import { Scheme } from '@/types/scheme';

export const schemesData: Scheme[] = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN Samman Nidhi',
    description: 'Direct income support of ₹6,000 per year to farmer families across India, transferred in three equal installments.',
    category: 'Agriculture',
    type: 'Central',
    benefits: [
      '₹6,000 annual financial assistance',
      'Direct bank transfer in 3 installments',
      'No middlemen involvement',
      'Covers all landholding farmer families'
    ],
    eligibility: {
      minAge: 18,
      occupations: ['Farmer', 'Agricultural Laborer'],
      maxIncome: 200000,
    },
    requiredDocuments: ['Aadhaar Card', 'Bank Account Details', 'Land Records', 'Income Certificate'],
    officialLink: 'https://pmkisan.gov.in/',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    launchYear: 2019,
  },
  {
    id: 'pmay',
    name: 'Pradhan Mantri Awas Yojana (PMAY)',
    description: 'Housing for All initiative providing affordable housing with credit-linked subsidy for economically weaker sections.',
    category: 'Social Welfare',
    type: 'Central',
    benefits: [
      'Interest subsidy up to ₹2.67 lakh',
      'Affordable housing units',
      'Priority to women ownership',
      'Covers urban and rural areas'
    ],
    eligibility: {
      maxIncome: 1800000,
      categories: ['EWS', 'LIG', 'MIG-I', 'MIG-II', 'General', 'OBC', 'SC', 'ST'],
    },
    requiredDocuments: ['Aadhaar Card', 'Income Certificate', 'Bank Statements', 'Property Documents'],
    officialLink: 'https://pmaymis.gov.in/',
    ministry: 'Ministry of Housing and Urban Affairs',
    launchYear: 2015,
  },
  {
    id: 'pmjdy',
    name: 'Pradhan Mantri Jan Dhan Yojana',
    description: 'Financial inclusion program providing zero-balance bank accounts with RuPay debit card and overdraft facility.',
    category: 'Social Welfare',
    type: 'Central',
    benefits: [
      'Zero balance savings account',
      'RuPay Debit Card',
      'Overdraft facility up to ₹10,000',
      'Accident insurance cover of ₹2 lakh',
      'Life insurance cover of ₹30,000'
    ],
    eligibility: {
      minAge: 10,
    },
    requiredDocuments: ['Aadhaar Card', 'PAN Card (optional)', 'Passport size photo'],
    officialLink: 'https://www.pmjdy.gov.in/',
    ministry: 'Ministry of Finance',
    launchYear: 2014,
  },
  {
    id: 'pmsby',
    name: 'Pradhan Mantri Suraksha Bima Yojana',
    description: 'Accident insurance scheme offering ₹2 lakh coverage at just ₹20 per year for all bank account holders.',
    category: 'Social Welfare',
    type: 'Central',
    benefits: [
      '₹2 lakh accidental death coverage',
      '₹2 lakh permanent disability cover',
      '₹1 lakh partial disability cover',
      'Premium only ₹20/year'
    ],
    eligibility: {
      minAge: 18,
      maxAge: 70,
    },
    requiredDocuments: ['Aadhaar Card', 'Bank Account', 'Nominee Details'],
    officialLink: 'https://www.jansuraksha.gov.in/',
    ministry: 'Ministry of Finance',
    launchYear: 2015,
  },
  {
    id: 'ujjwala',
    name: 'Pradhan Mantri Ujjwala Yojana',
    description: 'Free LPG connections to women from BPL households, promoting clean cooking fuel and reducing health hazards.',
    category: 'Women',
    type: 'Central',
    benefits: [
      'Free LPG connection',
      'First LPG refill free',
      'Stove provided free of cost',
      'Subsidized refills'
    ],
    eligibility: {
      gender: 'Female',
      maxIncome: 100000,
      categories: ['BPL', 'SC', 'ST', 'PMAY beneficiary'],
    },
    requiredDocuments: ['Aadhaar Card', 'BPL Ration Card', 'Bank Account', 'Passport Photo'],
    officialLink: 'https://www.pmuy.gov.in/',
    ministry: 'Ministry of Petroleum and Natural Gas',
    launchYear: 2016,
  },
  {
    id: 'scholarship-sc',
    name: 'Post-Matric Scholarship for SC Students',
    description: 'Financial assistance for SC students pursuing post-matriculation education including professional courses.',
    category: 'Education',
    type: 'Central',
    benefits: [
      'Full tuition fee reimbursement',
      'Maintenance allowance',
      'Book and stationery grant',
      'Covers UG, PG, and professional courses'
    ],
    eligibility: {
      minAge: 16,
      maxAge: 35,
      categories: ['SC'],
      maxIncome: 250000,
      educationLevel: ['10th Pass', '12th Pass', 'Graduate', 'Post Graduate'],
    },
    requiredDocuments: ['Caste Certificate', 'Income Certificate', 'Mark Sheets', 'Aadhaar Card', 'Bank Account'],
    officialLink: 'https://scholarships.gov.in/',
    ministry: 'Ministry of Social Justice & Empowerment',
    launchYear: 2006,
  },
  {
    id: 'mudra',
    name: 'Pradhan Mantri MUDRA Yojana',
    description: 'Collateral-free loans up to ₹10 lakh for micro and small enterprises under Shishu, Kishore, and Tarun categories.',
    category: 'MSME',
    type: 'Central',
    benefits: [
      'Loans up to ₹10 lakh without collateral',
      'Shishu: up to ₹50,000',
      'Kishore: ₹50,000 to ₹5 lakh',
      'Tarun: ₹5 lakh to ₹10 lakh',
      'No processing fee'
    ],
    eligibility: {
      minAge: 18,
      occupations: ['Business Owner', 'Self-Employed', 'Entrepreneur'],
    },
    requiredDocuments: ['Aadhaar Card', 'Business Plan', 'Identity Proof', 'Address Proof', 'Business Registration'],
    officialLink: 'https://www.mudra.org.in/',
    ministry: 'Ministry of Finance',
    launchYear: 2015,
  },
  {
    id: 'ayushman',
    name: 'Ayushman Bharat - PMJAY',
    description: 'Health insurance coverage of ₹5 lakh per family per year for secondary and tertiary hospitalization.',
    category: 'Health',
    type: 'Central',
    benefits: [
      '₹5 lakh health cover per family',
      'Cashless treatment at empaneled hospitals',
      'Covers 1,929+ treatment packages',
      'Pre and post hospitalization expenses'
    ],
    eligibility: {
      maxIncome: 250000,
      categories: ['BPL', 'EWS', 'SC', 'ST', 'OBC', 'General'],
    },
    requiredDocuments: ['Aadhaar Card', 'Ration Card', 'Income Certificate', 'Family ID'],
    officialLink: 'https://pmjay.gov.in/',
    ministry: 'Ministry of Health and Family Welfare',
    launchYear: 2018,
  },
  {
    id: 'national-pension',
    name: 'Atal Pension Yojana',
    description: 'Guaranteed pension scheme for unorganized sector workers with government co-contribution.',
    category: 'Senior Citizens',
    type: 'Central',
    benefits: [
      'Guaranteed pension of ₹1,000-5,000/month',
      'Government co-contribution',
      'Tax benefits under Section 80CCD',
      'Spouse pension continuation'
    ],
    eligibility: {
      minAge: 18,
      maxAge: 40,
      occupations: ['Farmer', 'Daily Wage Worker', 'Self-Employed', 'Unorganized Worker'],
    },
    requiredDocuments: ['Aadhaar Card', 'Bank Account', 'Mobile Number'],
    officialLink: 'https://npscra.nsdl.co.in/scheme-details.php',
    ministry: 'Ministry of Finance',
    launchYear: 2015,
  },
  {
    id: 'maharashtra-ladki-bahin',
    name: 'Ladki Bahin Yojana',
    description: 'Maharashtra state scheme providing monthly financial assistance to women for economic empowerment.',
    category: 'Women',
    type: 'State',
    state: 'Maharashtra',
    benefits: [
      '₹1,500 monthly assistance',
      'Direct bank transfer',
      'No age limit for eligible women',
      'Supports financial independence'
    ],
    eligibility: {
      gender: 'Female',
      maxIncome: 250000,
      states: ['Maharashtra'],
      minAge: 21,
      maxAge: 65,
    },
    requiredDocuments: ['Aadhaar Card', 'Domicile Certificate', 'Income Certificate', 'Bank Account'],
    officialLink: 'https://womenchild.maharashtra.gov.in/',
    ministry: 'Women & Child Development, Maharashtra',
    launchYear: 2024,
  },
];

export const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'Education', label: 'Education' },
  { value: 'Health', label: 'Health' },
  { value: 'Agriculture', label: 'Agriculture' },
  { value: 'Women', label: 'Women Empowerment' },
  { value: 'MSME', label: 'MSME & Business' },
  { value: 'Social Welfare', label: 'Social Welfare' },
  { value: 'Senior Citizens', label: 'Senior Citizens' },
];

export const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

export const occupations = [
  'Student', 'Farmer', 'Agricultural Laborer', 'Government Employee',
  'Private Employee', 'Business Owner', 'Self-Employed', 'Entrepreneur',
  'Daily Wage Worker', 'Unorganized Worker', 'Homemaker', 'Retired', 'Unemployed',
];

export const educationLevels = [
  'Below 10th', '10th Pass', '12th Pass', 'Diploma', 'Graduate', 'Post Graduate', 'Doctorate',
];

export const socialCategories = [
  'General', 'OBC', 'SC', 'ST', 'EWS', 'BPL',
];
