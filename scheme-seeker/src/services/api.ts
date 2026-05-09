/**
 * Centralized API Service Layer
 * 
 * This file contains all API endpoint placeholders for future backend integration.
 * Currently uses mock data and simulated delays.
 * 
 * FUTURE INTEGRATION NOTES:
 * - Replace BASE_URL with actual backend URL (FastAPI, Spring Boot, or Node.js)
 * - Remove mock delays and return actual API responses
 * - Add proper error handling and retry logic
 */

import { Scheme, UserProfile, EligibilityResult } from '@/types/scheme';
import { schemesData as mockSchemes } from '@/data/schemes';
import { checkAllEligibility } from '@/lib/eligibilityEngine';

// API Base URL - Replace with actual backend URL when available
const BASE_URL = '/api';

// Simulated API delay for realistic UX
const simulateDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// ELIGIBILITY API
// ============================================

/**
 * POST /api/eligibility/check
 * Check user eligibility for all schemes
 */
export async function checkEligibility(profile: UserProfile): Promise<EligibilityResult> {
  // TODO: Replace with actual API call
  // return fetch(`${BASE_URL}/eligibility/check`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(profile),
  // }).then(res => res.json());

  await simulateDelay(1500);
  return checkAllEligibility(profile);
}

// ============================================
// SCHEMES API
// ============================================

/**
 * GET /api/schemes
 * Fetch all schemes with optional filters
 */
export async function getSchemes(filters?: {
  category?: string;
  type?: string;
  search?: string;
}): Promise<Scheme[]> {
  // TODO: Replace with actual API call
  // const params = new URLSearchParams(filters as Record<string, string>);
  // return fetch(`${BASE_URL}/schemes?${params}`).then(res => res.json());

  await simulateDelay();
  
  let result = [...mockSchemes];
  
  if (filters?.category && filters.category !== 'all') {
    result = result.filter(s => s.category === filters.category);
  }
  if (filters?.type && filters.type !== 'all') {
    result = result.filter(s => s.type === filters.type);
  }
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    result = result.filter(s => 
      s.name.toLowerCase().includes(search) || 
      s.description.toLowerCase().includes(search)
    );
  }
  
  return result;
}

/**
 * GET /api/schemes/:id
 * Fetch single scheme by ID
 */
export async function getSchemeById(id: string): Promise<Scheme | null> {
  // TODO: Replace with actual API call
  // return fetch(`${BASE_URL}/schemes/${id}`).then(res => res.json());

  await simulateDelay(500);
  return mockSchemes.find(s => s.id === id) || null;
}

// ============================================
// AUTHENTICATION API
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  token?: string;
}

/**
 * POST /api/auth/login
 * User login
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  // TODO: Replace with actual API call
  // return fetch(`${BASE_URL}/auth/login`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(credentials),
  // }).then(res => res.json());

  await simulateDelay(1000);
  
  // Mock validation
  if (credentials.email && credentials.password) {
    return {
      success: true,
      message: 'Login successful',
      user: {
        id: 'user_001',
        email: credentials.email,
        name: 'Demo User',
      },
      token: 'mock_jwt_token_' + Date.now(),
    };
  }
  
  return {
    success: false,
    message: 'Invalid credentials',
  };
}

/**
 * POST /api/auth/register
 * User registration
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  // TODO: Replace with actual API call
  // return fetch(`${BASE_URL}/auth/register`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // }).then(res => res.json());

  await simulateDelay(1200);
  
  return {
    success: true,
    message: 'Registration successful',
    user: {
      id: 'user_' + Date.now(),
      email: data.email,
      name: data.name,
    },
  };
}

/**
 * POST /api/auth/logout
 * User logout
 */
export async function logout(): Promise<{ success: boolean }> {
  await simulateDelay(300);
  return { success: true };
}

// ============================================
// USER PROFILE API
// ============================================

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  savedProfile?: Partial<UserProfile>;
  matchedSchemes?: Scheme[];
  lastChecked?: string;
}

/**
 * GET /api/user/profile
 * Get current user profile
 */
export async function getUserProfile(): Promise<UserProfileData | null> {
  // TODO: Replace with actual API call
  // return fetch(`${BASE_URL}/user/profile`, {
  //   headers: { 'Authorization': `Bearer ${token}` },
  // }).then(res => res.json());

  await simulateDelay();
  
  // Return mock user data
  return {
    id: 'user_001',
    name: 'Demo User',
    email: 'demo@example.com',
    phone: '+91 98765 43210',
    savedProfile: {
      age: 28,
      gender: 'Male',
      annualIncome: 350000,
      occupation: 'Self-Employed',
      category: 'OBC',
      state: 'Maharashtra',
    },
    matchedSchemes: mockSchemes.slice(0, 3),
    lastChecked: new Date().toISOString(),
  };
}

/**
 * PUT /api/user/profile
 * Update user profile
 */
export async function updateUserProfile(data: Partial<UserProfileData>): Promise<UserProfileData> {
  await simulateDelay();
  return { ...data, id: 'user_001' } as UserProfileData;
}

// ============================================
// ADMIN API
// ============================================

export interface AdminLoginCredentials {
  email: string;
  password: string;
}

/**
 * POST /api/admin/login
 * Admin login
 */
export async function adminLogin(credentials: AdminLoginCredentials): Promise<AuthResponse> {
  // TODO: Replace with actual API call
  
  await simulateDelay(1000);
  
  // Mock admin validation
  if (credentials.email === 'admin@yojnadarshan.gov.in' && credentials.password === 'admin123') {
    return {
      success: true,
      message: 'Admin login successful',
      user: {
        id: 'admin_001',
        email: credentials.email,
        name: 'Admin User',
      },
      token: 'admin_jwt_token_' + Date.now(),
    };
  }
  
  return {
    success: false,
    message: 'Invalid admin credentials',
  };
}

/**
 * GET /api/admin/schemes
 * Get all schemes (admin view)
 */
export async function getAdminSchemes(): Promise<Scheme[]> {
  await simulateDelay();
  return mockSchemes;
}

/**
 * POST /api/admin/schemes
 * Create new scheme
 */
export async function createScheme(scheme: Omit<Scheme, 'id'>): Promise<Scheme> {
  await simulateDelay(1000);
  return {
    ...scheme,
    id: 'scheme_' + Date.now(),
  } as Scheme;
}

/**
 * PUT /api/admin/schemes/:id
 * Update existing scheme
 */
export async function updateScheme(id: string, data: Partial<Scheme>): Promise<Scheme> {
  await simulateDelay(800);
  const scheme = mockSchemes.find(s => s.id === id);
  if (!scheme) throw new Error('Scheme not found');
  return { ...scheme, ...data };
}

/**
 * DELETE /api/admin/schemes/:id
 * Disable/delete scheme
 */
export async function deleteScheme(id: string): Promise<{ success: boolean }> {
  await simulateDelay(500);
  return { success: true };
}

// ============================================
// NOTIFICATION API
// ============================================

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  newSchemes: boolean;
  eligibilityUpdates: boolean;
}

/**
 * POST /api/notifications/subscribe
 * Subscribe to notifications
 */
export async function subscribeNotifications(preferences: NotificationPreferences): Promise<{ success: boolean }> {
  await simulateDelay();
  return { success: true };
}

/**
 * GET /api/notifications/preferences
 * Get notification preferences
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  await simulateDelay(500);
  return {
    email: true,
    sms: false,
    whatsapp: false,
    newSchemes: true,
    eligibilityUpdates: true,
  };
}

/**
 * PUT /api/notifications/preferences
 * Update notification preferences
 */
export async function updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
  await simulateDelay();
  return {
    email: true,
    sms: false,
    whatsapp: false,
    newSchemes: true,
    eligibilityUpdates: true,
    ...preferences,
  };
}
