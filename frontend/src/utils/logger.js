/**
 * Logger utility for environment-specific logging
 * 
 * This utility provides different logging behaviors based on the environment:
 * - In development: All logs are shown with full details
 * - In production: Sensitive data is sanitized or omitted
 */

import { isProduction, SENSITIVE_FIELDS } from '../constants';

/**
 * Sanitizes an object by replacing sensitive field values with "[REDACTED]"
 * @param {Object} obj - The object to sanitize
 * @returns {Object} - A sanitized copy of the object
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  // Handle regular objects
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Check if this is a sensitive field
    const isSensitive = SENSITIVE_FIELDS.some(field => 
      key.toLowerCase().includes(field.toLowerCase())
    );
    
    if (isSensitive && typeof value === 'string') {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

/**
 * Sanitizes request/response data for logging in production
 * @param {any} data - The data to sanitize
 * @returns {any} - Sanitized data
 */
const sanitizeData = (data) => {
  if (!data) return data;
  
  // If it's an object, sanitize it
  if (typeof data === 'object') {
    return sanitizeObject(data);
  }
  
  // For other types, return as is
  return data;
};

/**
 * Formats log data based on environment
 * @param {any} data - The data to format
 * @returns {any} - Formatted data
 */
const formatLogData = (data) => {
  if (isProduction()) {
    return sanitizeData(data);
  }
  return data;
};

/**
 * Logger object with methods for different log levels
 */
const logger = {
  /**
   * Debug level logging - only shown in development
   * @param {string} message - Log message
   * @param {any} data - Optional data to log
   */
  debug: (message, data) => {
    if (!isProduction()) {
      console.log(`[DEBUG] ${message}`, data !== undefined ? data : '');
    }
  },
  
  /**
   * Info level logging - shown in all environments, but sanitized in production
   * @param {string} message - Log message
   * @param {any} data - Optional data to log
   */
  info: (message, data) => {
    console.log(`[INFO] ${message}`, data !== undefined ? formatLogData(data) : '');
  },
  
  /**
   * Warning level logging - shown in all environments, but sanitized in production
   * @param {string} message - Log message
   * @param {any} data - Optional data to log
   */
  warn: (message, data) => {
    console.warn(`[WARN] ${message}`, data !== undefined ? formatLogData(data) : '');
  },
  
  /**
   * Error level logging - shown in all environments, but sanitized in production
   * @param {string} message - Log message
   * @param {any} data - Optional data to log
   */
  error: (message, data) => {
    console.error(`[ERROR] ${message}`, data !== undefined ? formatLogData(data) : '');
  },
  
  /**
   * HTTP request logging - sanitizes request data in production
   * @param {Object} request - The HTTP request object
   */
  httpRequest: (request) => {
    if (!isProduction()) {
      // In development, log everything
      console.log('[HTTP Request]', {
        url: request.url,
        method: request.method,
        data: request.data,
        baseURL: request.baseURL,
        headers: request.headers
      });
    } else {
      // In production, log minimal info and sanitize
      console.log('[HTTP Request]', {
        url: request.url,
        method: request.method,
        // Omit request data and sensitive headers in production
        headers: sanitizeObject({
          'Content-Type': request.headers?.['Content-Type'],
          'Accept': request.headers?.['Accept']
        })
      });
    }
    return request;
  },
  
  /**
   * HTTP response logging - sanitizes response data in production
   * @param {Object} response - The HTTP response object
   */
  httpResponse: (response) => {
    if (!isProduction()) {
      // In development, log everything
      console.log('[HTTP Response]', response);
    } else {
      // In production, log minimal info and sanitize
      console.log('[HTTP Response]', {
        status: response.status,
        statusText: response.statusText,
        config: {
          url: response.config?.url,
          method: response.config?.method
        }
        // Intentionally omit response.data in production
      });
    }
    return response;
  },
  
  /**
   * HTTP error logging - sanitizes error details in production
   * @param {Object} error - The HTTP error object
   */
  httpError: (error) => {
    if (!isProduction()) {
      // In development, log everything
      console.error('[HTTP Error]', error);
      console.error('[Error Details]', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers
        }
      });
    } else {
      // In production, log minimal info and sanitize
      console.error('[HTTP Error]', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        // Sanitize error data
        data: sanitizeData(error.response?.data),
        config: {
          url: error.config?.url,
          method: error.config?.method
          // Omit request data and headers in production
        }
      });
    }
    return Promise.reject(error);
  }
};

export default logger;
