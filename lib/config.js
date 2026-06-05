/**
 * Configuration Module
 * Centralized configuration for all services
 */

const Config = {
  // Application Info
  APP_NAME: 'ViralFlow AI',
  APP_VERSION: '1.0.0-alpha',
  APP_ENV: window.location.hostname === 'localhost' ? 'development' : 'production',

  // API Endpoints
  GROQ_API_ENDPOINT: 'https://viralflow-groq-api.hapeenooo555.workers.dev',
  SUPABASE_URL: localStorage.getItem('SUPABASE_URL') || '',
  SUPABASE_ANON_KEY: localStorage.getItem('SUPABASE_ANON_KEY') || '',
  STRIPE_PUBLISHABLE_KEY: localStorage.getItem('STRIPE_PUBLISHABLE_KEY') || '',

  // Rate Limiting
  RATE_LIMITS: {
    creator: { requests_per_day: 10, requests_per_minute: 2 },
    pro: { requests_per_day: 1000, requests_per_minute: 60 },
    agency: { requests_per_day: 10000, requests_per_minute: 600 }
  },

  // AI Models
  AI_MODELS: {
    'llama-3.3-70b-versatile': { name: 'Llama 3.3 70B', recommended: true },
    'mixtral-8x7b-32768': { name: 'Mixtral 8x7B', recommended: false },
    'gemma-7b-it': { name: 'Gemma 7B', recommended: false }
  },

  // Content Types
  CONTENT_TYPES: {
    'tiktok-hooks': 'TikTok Hooks',
    'faceless-scripts': 'Faceless Scripts',
    'capcut-scenes': 'CapCut Scenes',
    'whatsapp-closing': 'WhatsApp Closing',
    'affiliate-ads': 'Affiliate Ads',
    'storytelling': 'Storytelling',
    'youtube-shorts': 'YouTube Shorts',
    'viral-cta': 'Viral CTA',
    'product-desc': 'Product Description',
    'sales-copy': 'Sales Copy',
    'facebook-ads': 'Facebook Ads',
    'instagram-reels': 'Instagram Reels',
    'google-ads': 'Google Ads',
    'email-marketing': 'Email Marketing',
    'landing-pages': 'Landing Pages'
  },

  // Pricing Plans
  PLANS: {
    creator: { name: 'Creator', price: 0, generations_per_day: 10, max_tokens: 50000 },
    pro: { name: 'Pro', price: 29, generations_per_day: 1000, max_tokens: 1000000 },
    agency: { name: 'Agency', price: 99, generations_per_day: 10000, max_tokens: 10000000 }
  },

  // Feature Flags
  FEATURES: {
    supabase_enabled: true,
    analytics_enabled: true,
    export_enabled: true,
    billing_enabled: false, // Enable after Phase 6
    trends_enabled: false   // Enable after Phase 6
  },

  // Logging
  LOG_LEVEL: 'debug', // debug, info, warn, error
  DEBUG_MODE: true
};

/**
 * Logger Utility
 */
const Logger = {
  debug: (msg, data) => {
    if (Config.LOG_LEVEL === 'debug') {
      console.log(`[DEBUG] ${msg}`, data || '');
    }
  },
  info: (msg, data) => {
    if (['debug', 'info'].includes(Config.LOG_LEVEL)) {
      console.log(`[INFO] ${msg}`, data || '');
    }
  },
  warn: (msg, data) => {
    if (['debug', 'info', 'warn'].includes(Config.LOG_LEVEL)) {
      console.warn(`[WARN] ${msg}`, data || '');
    }
  },
  error: (msg, data) => {
    console.error(`[ERROR] ${msg}`, data || '');
  }
};

/**
 * Utility Functions
 */
const Utils = {
  /**
   * Generate UUID
   */
  generateUUID: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  /**
   * Debounce function
   */
  debounce: (func, delay) => {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  /**
   * Throttle function
   */
  throttle: (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Save to localStorage
   */
  saveToStorage: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      Logger.error('Storage error:', e);
      return false;
    }
  },

  /**
   * Get from localStorage
   */
  getFromStorage: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      Logger.error('Storage error:', e);
      return null;
    }
  },

  /**
   * Format date
   */
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Validate email
   */
  validateEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  /**
   * Capitalize string
   */
  capitalize: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};

/**
 * Error Handler
 */
class AppError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    Logger.error(message, details);
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Config, Logger, Utils, AppError };
}
