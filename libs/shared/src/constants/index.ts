// Plan limits
export const PLAN_LIMITS = {
  free: {
    max_items: 15,
    max_scans_per_month: 100,
    custom_domain: false,
    remove_branding: false,
    analytics: false,
    whatsapp_integration: true,
    maps_integration: true,
  },
  basic: {
    max_items: 50,
    max_scans_per_month: 500,
    custom_domain: false,
    remove_branding: false,
    analytics: true,
    whatsapp_integration: true,
    maps_integration: true,
  },
  pro: {
    max_items: 200,
    max_scans_per_month: 5000,
    custom_domain: true,
    remove_branding: true,
    analytics: true,
    whatsapp_integration: true,
    maps_integration: true,
  },
  business: {
    max_items: 1000,
    max_scans_per_month: 25000,
    custom_domain: true,
    remove_branding: true,
    analytics: true,
    whatsapp_integration: true,
    maps_integration: true,
  },
  enterprise: {
    max_items: Infinity,
    max_scans_per_month: Infinity,
    custom_domain: true,
    remove_branding: true,
    analytics: true,
    whatsapp_integration: true,
    maps_integration: true,
  },
} as const;

// Plan prices (USD)
export const PLAN_PRICES = {
  free: { monthly: 0, yearly: 0 },
  basic: { monthly: 5, yearly: 50 },
  pro: { monthly: 12, yearly: 120 },
  business: { monthly: 25, yearly: 250 },
  enterprise: { monthly: 0, yearly: 0 }, // Custom pricing
} as const;

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    refresh: '/api/auth/refresh',
    logout: '/api/auth/logout',
  },
  business: {
    list: '/api/businesses',
    get: '/api/businesses/:id',
    create: '/api/businesses',
    update: '/api/businesses/:id',
    delete: '/api/businesses/:id',
  },
  menu: {
    list: '/api/menus',
    get: '/api/menus/:id',
    create: '/api/menus',
    update: '/api/menus/:id',
    delete: '/api/menus/:id',
  },
  public: {
    business: '/:slug',
    menu: '/:slug/menu',
  },
} as const;

// Storage keys
export const STORAGE_KEYS = {
  auth_token: 'nexlynk_auth_token',
  refresh_token: 'nexlynk_refresh_token',
  theme: 'nexlynk_theme',
} as const;

// App metadata
export const APP_CONFIG = {
  name: 'Nexlynk',
  slogan: 'El enlace entre tu negocio y el mundo',
  description: 'Crea tu página de negocio interactiva con un solo enlace',
  url: 'https://nexlynk.app',
  support_email: 'support@nexlynk.app',
  social: {
    twitter: 'https://twitter.com/nexlynk',
    instagram: 'https://instagram.com/nexlynk',
    github: 'https://github.com/nexlynk',
  },
} as const;

// Analytics event types
export const EVENT_TYPES = {
  PAGE_VIEW: 'page_view',
  CLICK_WHATSAPP: 'click_whatsapp',
  CLICK_MAPS: 'click_maps',
  CLICK_PHONE: 'click_phone',
  VIEW_MENU: 'view_menu',
  SELECT_ITEM: 'select_item',
  SHARE: 'share',
} as const;

// Days of the week (Spanish)
export const DAYS_OF_WEEK = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
  'domingo',
] as const;

// Validation constants
export const VALIDATION = {
  slug_pattern: /^[a-z0-9-]+$/,
  slug_min_length: 3,
  slug_max_length: 30,
  name_min_length: 2,
  name_max_length: 100,
  description_max_length: 500,
  phone_pattern: /^\+?[\d\s-]{10,}$/,
} as const;
