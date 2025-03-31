// User profile types
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// LinkedIn Lead types
export interface LinkedInLead {
  id: string;
  profile_url: string;
  full_name: string;
  headline?: string;
  location?: string;
  company?: string;
  position?: string;
  industry?: string;
  connection_degree?: number;
  summary?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  contact_info?: ContactInfo;
  created_at: string;
  updated_at: string;
  analyzed: boolean;
  score?: number;
}

export interface Experience {
  title: string;
  company: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  duration?: string;
  location?: string;
}

export interface Education {
  school: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  twitter?: string;
  website?: string;
}

// Insight types
export interface Insight {
  id: string;
  lead_id: string;
  type: 'industry' | 'network' | 'engagement' | 'skills' | 'career' | 'company';
  title: string;
  description: string;
  data: any;
  score: number;
  created_at: string;
  updated_at: string;
}

// Feedback types
export interface Feedback {
  id: string;
  insight_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

// Segment types
export interface LeadSegment {
  id: string;
  name: string;
  description?: string;
  filter_criteria: any;
  lead_count: number;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Lead Types
export interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  profile_url: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  connections: number;
  connection_degree?: number;
  analyzed: boolean;
  created_at: string;
  updated_at?: string;
  scrape_data: any; // Raw data from scraping
}

// Insight Types
export enum InsightType {
  INDUSTRY_TREND = 'industry_trend',
  CONNECTION_NETWORK = 'connection_network',
  SKILLS_ANALYSIS = 'skills_analysis',
  EDUCATION_BACKGROUND = 'education_background',
  CAREER_PROGRESSION = 'career_progression',
  ENGAGEMENT_OPPORTUNITY = 'engagement_opportunity',
  COMPANY_INTELLIGENCE = 'company_intelligence'
}

export interface Insight {
  id: string;
  lead_id: string;
  type: string;
  title: string;
  content: string;
  confidence_score: number;
  action_points?: string[];
  related_insights?: string[];
  created_at: string;
  updated_at?: string;
}

// Feedback Types
export interface Feedback {
  id: string;
  insight_id: string;
  lead_id: string;
  rating: number; // 1-5 scale
  comment?: string;
  created_at: string;
  updated_at?: string;
  created_by: string;
}

// Dashboard Types
export interface InsightStats {
  total: number;
  by_type: Record<string, number>;
  average_confidence: number;
}

export interface LeadStats {
  total: number;
  analyzed: number;
  not_analyzed: number;
}

export interface FeedbackStats {
  total: number;
  average_rating: number;
  by_rating: Record<number, number>; // Maps 1-5 to count
}

export interface DashboardData {
  lead_stats: LeadStats;
  insight_stats: InsightStats;
  feedback_stats: FeedbackStats;
  recent_insights: Insight[];
  recent_leads: Lead[];
}

// Supabase Auth User Type
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role: 'admin' | 'user';
}

// Phantombuster Types
export interface PhantomConfiguration {
  profileUrls?: string[];
  searchQuery?: string;
  maxProfiles?: number;
} 