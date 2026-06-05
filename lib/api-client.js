/**
 * API Client Module
 * Handles all API requests with error handling and retry logic
 */

class APIClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.timeout = 30000; // 30 seconds
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
  }

  /**
   * Make API request with retry logic
   */
  async request(method, path, body = null, options = {}) {
    const url = `${this.endpoint}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const config = {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) })
    };

    let lastError;
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const response = await Promise.race([
          fetch(url, config),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), this.timeout)
          )
        ]);

        if (!response.ok) {
          throw new AppError(
            `API Error: ${response.statusText}`,
            'API_ERROR',
            { status: response.status, url }
          );
        }

        return await response.json();
      } catch (error) {
        lastError = error;
        Logger.warn(`Request failed (attempt ${attempt + 1}/${this.maxRetries}):`, error);

        if (attempt < this.maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        }
      }
    }

    throw lastError || new AppError('API request failed', 'API_ERROR');
  }

  /**
   * GET request
   */
  async get(path, options = {}) {
    return this.request('GET', path, null, options);
  }

  /**
   * POST request
   */
  async post(path, body, options = {}) {
    return this.request('POST', path, body, options);
  }

  /**
   * PUT request
   */
  async put(path, body, options = {}) {
    return this.request('PUT', path, body, options);
  }

  /**
   * DELETE request
   */
  async delete(path, options = {}) {
    return this.request('DELETE', path, null, options);
  }
}

// Initialize Groq API client
const groqClient = new APIClient(Config.GROQ_API_ENDPOINT);

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { APIClient, groqClient };
}
