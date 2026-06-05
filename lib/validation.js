/**
 * Validation Module
 * Input validation and sanitization
 */

const Validator = {
  /**
   * Validate email
   */
  email: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  /**
   * Validate password
   */
  password: (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return re.test(password);
  },

  /**
   * Validate prompt (not empty, length)
   */
  prompt: (prompt) => {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }
    if (prompt.length > 5000) {
      throw new Error('Prompt cannot exceed 5000 characters');
    }
    return true;
  },

  /**
   * Validate API key format
   */
  apiKey: (key) => {
    if (!key || key.trim().length === 0) {
      throw new Error('API key cannot be empty');
    }
    if (key.length < 10) {
      throw new Error('Invalid API key format');
    }
    return true;
  },

  /**
   * Sanitize HTML input
   */
  sanitizeHTML: (input) => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  /**
   * Validate content type
   */
  contentType: (type) => {
    if (!Object.keys(Config.CONTENT_TYPES).includes(type)) {
      throw new Error(`Invalid content type: ${type}`);
    }
    return true;
  },

  /**
   * Validate model
   */
  model: (model) => {
    if (!Object.keys(Config.AI_MODELS).includes(model)) {
      throw new Error(`Invalid model: ${model}`);
    }
    return true;
  },

  /**
   * Validate plan
   */
  plan: (plan) => {
    if (!Object.keys(Config.PLANS).includes(plan)) {
      throw new Error(`Invalid plan: ${plan}`);
    }
    return true;
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Validator };
}
