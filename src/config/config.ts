import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuration object for the application.
 * Uses environment variables with fallback values.
 */
export default {
  // Server port
  port: process.env.PORT || 3000,
  // API key for IPstack service
  ipstackApiKey: process.env.IPSTACK_API_KEY,
  // Rate limits for each vendor
  rateLimit: {
    ipstack: parseInt(process.env.IPSTACK_RATE_LIMIT || '100', 10),
    ipapi: parseInt(process.env.IPAPI_RATE_LIMIT || '1000', 10),
  },
  // Maximum number of items to store in cache
  cacheMaxSize: parseInt(process.env.CACHE_MAX_SIZE || '1000', 10),
  // Time-to-live for cached items in seconds
  cacheTTL: parseInt(process.env.CACHE_TTL || '3600', 10),
};