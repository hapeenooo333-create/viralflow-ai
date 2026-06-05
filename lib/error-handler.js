/**
 * Error Handler & Recovery
 * Centralized error management and recovery logic
 */

class ErrorHandler {
  constructor() {
    this.errors = [];
    this.setupGlobalErrorHandlers();
  }

  /**
   * Setup global error handlers
   */
  setupGlobalErrorHandlers() {
    // Unhandled promise rejection
    window.addEventListener('unhandledrejection', (event) => {
      Logger.error('Unhandled rejection:', event.reason);
      this.handle(event.reason);
    });

    // Global error
    window.addEventListener('error', (event) => {
      Logger.error('Global error:', event.error);
      this.handle(event.error);
    });
  }

  /**
   * Handle error
   */
  handle(error) {
    const err = {
      message: error.message || 'Unknown error',
      code: error.code || 'UNKNOWN',
      timestamp: new Date().toISOString(),
      stack: error.stack,
      details: error.details || {}
    };

    this.errors.push(err);
    this.showUserNotification(err);
    this.logToServer(err);
  }

  /**
   * Show user notification
   */
  showUserNotification(error) {
    const message = this.getUserFriendlyMessage(error.code);
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
      <div class="error-content">
        <strong>⚠️ Error:</strong> ${message}
        <button onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f97316;
      color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 400px;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(code) {
    const messages = {
      'NETWORK_ERROR': 'Network connection failed. Please check your internet.',
      'API_ERROR': 'API request failed. Please try again.',
      'AUTH_ERROR': 'Authentication failed. Please log in again.',
      'VALIDATION_ERROR': 'Invalid input. Please check your data.',
      'STORAGE_ERROR': 'Storage error. Please try again.',
      'UNKNOWN': 'Something went wrong. Please try again.'
    };
    return messages[code] || messages['UNKNOWN'];
  }

  /**
   * Log to server (for Phase 2+)
   */
  logToServer(error) {
    if (Config.APP_ENV === 'production') {
      // Send to error logging service
      Logger.warn('Error logged to server:', error);
    }
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit = 10) {
    return this.errors.slice(-limit);
  }

  /**
   * Clear errors
   */
  clearErrors() {
    this.errors = [];
  }
}

// Initialize error handler
const errorHandler = new ErrorHandler();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ErrorHandler, errorHandler };
}
