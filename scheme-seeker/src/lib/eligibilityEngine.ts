import { Scheme, UserProfile, EligibilityResult } from '@/types/scheme';
import { schemesData } from '@/data/schemes';

interface MatchResult {
  isEligible: boolean;
  matchScore: number;
  reasons: string[];
}

function checkEligibility(scheme: Scheme, profile: UserProfile): MatchResult {
  const reasons: string[] = [];
  let matchScore = 0;
  let isEligible = true;

  const { eligibility } = scheme;

  if (eligibility.minAge !== undefined && profile.age < eligibility.minAge) {
    isEligible = false;
    reasons.push(`Minimum age requirement: ${eligibility.minAge} years`);
  } else if (eligibility.minAge !== undefined) {
    matchScore += 15;
    reasons.push(`✓ Age requirement met (${profile.age} years)`);
  }

  if (eligibility.maxAge !== undefined && profile.age > eligibility.maxAge) {
    isEligible = false;
    reasons.push(`Maximum age limit: ${eligibility.maxAge} years`);
  } else if (eligibility.maxAge !== undefined) {
    matchScore += 15;
  }

  if (eligibility.maxIncome !== undefined) {
    if (profile.annualIncome > eligibility.maxIncome) {
      isEligible = false;
      reasons.push(`Income limit: ₹${(eligibility.maxIncome / 100000).toFixed(1)} lakh`);
    } else {
      matchScore += 20;
      reasons.push(`✓ Income criteria met (₹${(profile.annualIncome / 100000).toFixed(1)} lakh)`);
    }
  }

  if (eligibility.gender && eligibility.gender !== 'All') {
    if (profile.gender !== eligibility.gender) {
      isEligible = false;
      reasons.push(`Gender requirement: ${eligibility.gender}`);
    } else {
      matchScore += 15;
      reasons.push(`✓ Gender criteria met`);
    }
  }

  if (eligibility.categories && eligibility.categories.length > 0) {
    const categoryMatch = eligibility.categories.some(
      cat =>
        cat.toLowerCase() === profile.category.toLowerCase() ||
        cat.toLowerCase() === 'general'
    );
    if (!categoryMatch) {
      isEligible = false;
      reasons.push(`Category requirement: ${eligibility.categories.join(', ')}`);
    } else {
      matchScore += 15;
      reasons.push(`✓ Category matched (${profile.category})`);
    }
  }

  if (eligibility.occupations && eligibility.occupations.length > 0) {
    const occupationMatch = eligibility.occupations.some(
      occ => occ.toLowerCase() === profile.occupation.toLowerCase()
    );
    if (!occupationMatch) {
      isEligible = false;
      reasons.push(`Occupation requirement: ${eligibility.occupations.join(', ')}`);
    } else {
      matchScore += 20;
      reasons.push(`✓ Occupation matched (${profile.occupation})`);
    }
  }

  if (eligibility.states && eligibility.states.length > 0) {
    const stateMatch = eligibility.states.some(
      state => state.toLowerCase() === profile.state.toLowerCase()
    );
    if (!stateMatch) {
      isEligible = false;
      reasons.push(`State requirement: ${eligibility.states.join(', ')}`);
    } else {
      matchScore += 15;
      reasons.push(`✓ State matched (${profile.state})`);
    }
  }

  if (eligibility.educationLevel && eligibility.educationLevel.length > 0) {
    const educationMatch = eligibility.educationLevel.some(
      edu => edu.toLowerCase() === profile.education.toLowerCase()
    );
    if (!educationMatch) {
      isEligible = false;
      reasons.push(`Education requirement: ${eligibility.educationLevel.join(', ')}`);
    } else {
      matchScore += 10;
      reasons.push(`✓ Education criteria met`);
    }
  }

  if (eligibility.isDisabled === true && !profile.hasDisability) {
    isEligible = false;
    reasons.push(`Requires disability status`);
  }

  matchScore = Math.min(100, matchScore);

  return { isEligible, matchScore, reasons };
}

export function checkAllEligibility(profile: UserProfile): EligibilityResult {
  if (!profile.consent) {
    return {
      eligible: false,
      schemes: [],
      totalMatched: 0,
      profileSummary: profile,
    };
  }

  const eligibleSchemes: Scheme[] = [];

  for (const scheme of schemesData) {
    const result = checkEligibility(scheme, profile);

    if (result.isEligible) {
      eligibleSchemes.push({
        ...scheme,
        matchScore: result.matchScore,
        matchReasons: result.reasons.filter(r => r.startsWith('✓')),
      });
    }
  }

  eligibleSchemes.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  return {
    eligible: eligibleSchemes.length > 0,
    schemes: eligibleSchemes,
    totalMatched: eligibleSchemes.length,
    profileSummary: profile,
  };
}

export function searchSchemes(
  query: string,
  categoryFilter: string = 'all',
  typeFilter: 'Central' | 'State' | 'all' = 'all',
  schemes: Scheme[] = schemesData
): Scheme[] {

  let filtered = [...schemes];

  if (query && query.trim() !== '') {
    const searchLower = query.toLowerCase();

    filtered = filtered.filter((scheme) => {
      const name = scheme.name?.toLowerCase() || '';
      const description = scheme.description?.toLowerCase() || '';
      const ministry = scheme.ministry?.toLowerCase() || '';
      const category = scheme.category?.toLowerCase() || '';

      return (
        name.includes(searchLower) ||
        description.includes(searchLower) ||
        ministry.includes(searchLower) ||
        category.includes(searchLower)
      );
    });
  }

  if (categoryFilter !== 'all') {
    filtered = filtered.filter(
      (scheme) => scheme.category === categoryFilter
    );
  }

  if (typeFilter !== 'all') {
    filtered = filtered.filter(
      (scheme) => scheme.type === typeFilter
    );
  }

  return filtered;
}
