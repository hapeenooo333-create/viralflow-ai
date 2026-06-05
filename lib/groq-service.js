/**
 * Groq AI Service
 * Handles content generation using Groq API
 */

class GroqService {
  constructor() {
    this.client = groqClient;
    this.usageTracking = [];
  }

  /**
   * Generate content
   */
  async generate(prompt, options = {}) {
    try {
      Validator.prompt(prompt);

      const model = options.model || 'llama-3.3-70b-versatile';
      Validator.model(model);

      Logger.info('Generating content with model:', model);

      const payload = {
        prompt,
        model,
        max_tokens: options.max_tokens || 1000,
        temperature: options.temperature || 0.7,
        top_p: options.top_p || 0.9
      };

      const response = await this.client.post('/', payload);

      if (!response || !response.result) {
        throw new AppError(
          'Invalid API response',
          'API_ERROR',
          { response }
        );
      }

      // Track usage
      this.trackUsage({
        model,
        tokens: response.tokens_used || 0,
        cost: response.cost || 0
      });

      Logger.info('Content generated successfully');
      return response.result;
    } catch (error) {
      Logger.error('Content generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate with specific content type
   */
  async generateForType(contentType, userPrompt, options = {}) {
    Validator.contentType(contentType);

    const systemPrompt = this.getSystemPrompt(contentType);
    const fullPrompt = `${systemPrompt}\n\nUser request: ${userPrompt}`;

    return this.generate(fullPrompt, options);
  }

  /**
   * Get system prompt for content type
   */
  getSystemPrompt(contentType) {
    const prompts = {
      'tiktok-hooks': `You are a TikTok content expert. Generate an engaging, short hook that grabs attention in the first 3 seconds. Focus on emotional triggers and curiosity. Format: HOOK: [hook]\nCAPTION: [caption]\nCTA: [call to action]\nHASHTAGS: [relevant hashtags]`,
      'faceless-scripts': `You are a faceless video script expert. Generate a compelling script that works without showing faces. Focus on storytelling and emotional connection. Include visual directions.`,
      'whatsapp-closing': `You are a sales expert. Generate a WhatsApp closing script that converts. Include urgency, social proof, and clear CTA.`,
      'affiliate-ads': `You are an affiliate marketing expert. Generate persuasive ad copy that highlights benefits and drives conversions. Include CTAs.`,
      'viral-cta': `You are a viral marketing expert. Generate multiple powerful CTAs that drive engagement and sharing.`,
      'product-desc': `You are a product marketing expert. Generate compelling product descriptions that highlight unique features and benefits.`,
      'sales-copy': `You are a copywriting expert. Generate sales copy that converts readers into customers. Use emotional triggers and urgency.`,
      'email-marketing': `You are an email marketing expert. Generate email subject lines and body copy that drive opens and clicks.`,
      'youtube-shorts': `You are a YouTube Shorts expert. Generate short-form video scripts optimized for YouTube's platform.`,
      'storytelling': `You are a storytelling expert. Generate compelling stories that engage and inspire audiences.`,
      'capcut-scenes': `You are a CapCut video editor. Generate detailed scene descriptions for TikTok/Shorts videos.`,
      'facebook-ads': `You are a Facebook Ads expert. Generate ad copy optimized for Facebook's algorithm and audience targeting.`,
      'instagram-reels': `You are an Instagram Reels expert. Generate engaging content optimized for Instagram's platform.`,
      'google-ads': `You are a Google Ads copywriter. Generate high-converting ad copy for Google Search and Display networks.`,
      'landing-pages': `You are a landing page expert. Generate persuasive landing page copy that converts visitors.`
    };

    return prompts[contentType] || `Generate content of type: ${contentType}`;
  }

  /**
   * Verify API connectivity
   */
  async verify() {
    try {
      const testPrompt = 'Reply with just the word "working" - this is a test';
      const response = await this.generate(testPrompt, { max_tokens: 10 });
      Logger.info('Groq API verified:', response);
      return true;
    } catch (error) {
      Logger.error('Groq API verification failed:', error);
      return false;
    }
  }

  /**
   * Track API usage
   */
  trackUsage(usage) {
    this.usageTracking.push({
      ...usage,
      timestamp: new Date().toISOString()
    });

    // Save to localStorage for now, will move to Supabase in Phase 2
    Utils.saveToStorage('groq_usage', this.usageTracking);
  }

  /**
   * Get usage statistics
   */
  getUsageStats() {
    const usage = this.usageTracking;
    return {
      total_requests: usage.length,
      total_tokens: usage.reduce((sum, u) => sum + u.tokens, 0),
      total_cost: usage.reduce((sum, u) => sum + u.cost, 0),
      average_cost_per_request: usage.length > 0
        ? usage.reduce((sum, u) => sum + u.cost, 0) / usage.length
        : 0
    };
  }

  /**
   * Reset usage tracking
   */
  resetUsageTracking() {
    this.usageTracking = [];
    Utils.saveToStorage('groq_usage', this.usageTracking);
  }
}

// Initialize Groq service
const groqService = new GroqService();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GroqService, groqService };
      }
