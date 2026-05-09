export interface Scheme {

  id: string;

  name: string;

  description: string;

  category: string;

  type: string;

  ministry?: string;

  launchYear?: number;

  matchReasons?: string[];

  benefits?: string[] | string;

  requiredDocuments?: string[] | string;

  documents_required?: string[] | string;

  officialLink?: string;

  official_link?: string;

}

export interface EligibilityRule {
  minAge?: number;
  maxAge?: number;
  maxIncome?: number;

  // ✅ FIXED: backend compatibility
  gender?: 'Male' | 'Female' | 'Other' | 'All';

  categories?: string[];
  occupations?: string[];
  states?: string[];
  educationLevel?: string[];
  isDisabled?: boolean;
}

export interface UserProfile {
  age: number;

  // ✅ must match EligibilityRule.gender
  gender: 'Male' | 'Female' | 'Other';

  annualIncome: number;
  occupation: string;
  category: string;
  state: string;
  education: string;
  hasDisability: boolean;
  consent: boolean;
}

export interface EligibilityResult {
  eligible: boolean;
  schemes: Scheme[];
  totalMatched: number;
  profileSummary: UserProfile;
}