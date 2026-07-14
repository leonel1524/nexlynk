// Business types
export interface Business {
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  description?: string;
  logo_url?: string;
  cover_url?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  is_active: boolean;
  plan: PlanType;
  created_at: Date;
  updated_at: Date;
}

export type PlanType = 'free' | 'basic' | 'pro' | 'business' | 'enterprise';

// Location types
export interface Location {
  id: string;
  business_id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  whatsapp?: string;
  schedule: Schedule;
  is_main: boolean;
}

export interface Schedule {
  [key: string]: string; // e.g., { "lun-vie": "8am-6pm", "sab": "9am-2pm" }
}

// Menu types
export interface Menu {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
}

export interface MenuCategory {
  id: string;
  menu_id: string;
  name: string;
  description?: string;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  price?: number;
  image_url?: string;
  is_available: boolean;
  sort_order: number;
}

// Analytics types
export interface AnalyticsEvent {
  id: string;
  business_id: string;
  event_type: EventType;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

export type EventType = 
  | 'page_view'
  | 'click_whatsapp'
  | 'click_maps'
  | 'click_phone'
  | 'view_menu'
  | 'select_item'
  | 'share';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  plan: PlanType;
  plan_expires_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// Auth types
export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  business_name?: string;
}
