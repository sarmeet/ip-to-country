import { IpVendor } from '../types';
import config from '../config/config';

/**
 * Service for managing rate limits for IP lookup vendors.
 */
class RateLimitService {
  private limits: Map<string, number>;
  private usage: Map<string, number>;
  private lastResetTime: Map<string, number>;

  /**
   * Initializes the rate limit service with configured limits.
   */
  constructor() {
    this.limits = new Map(Object.entries(config.rateLimit));
    this.usage = new Map();
    this.lastResetTime = new Map();
  }

  /**
   * Checks if a vendor can be used based on its current usage and rate limit.
   * @param vendor - The vendor to check
   * @returns True if the vendor can be used, false otherwise
   */
  canUseVendor(vendor: IpVendor): boolean {
    const now = Date.now();
    const vendorName = vendor.name;
    const limit = this.limits.get(vendorName) || 0;
    const lastReset = this.lastResetTime.get(vendorName) || 0;
    const usage = this.usage.get(vendorName) || 0;

    if (now - lastReset >= 3600000) { // 1 hour in milliseconds
      this.usage.set(vendorName, 0);
      this.lastResetTime.set(vendorName, now);
      return true;
    }

    return usage < limit;
  }

  /**
   * Increments the usage count for a vendor.
   * @param vendor - The vendor whose usage to increment
   */
  incrementUsage(vendor: IpVendor): void {
    const vendorName = vendor.name;
    const usage = (this.usage.get(vendorName) || 0) + 1;
    this.usage.set(vendorName, usage);
  }
}

export const rateLimitService = new RateLimitService();