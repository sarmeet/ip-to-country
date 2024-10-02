import { IpInfo, IpVendor } from '../types';
import { cacheService } from './cacheService';
import { rateLimitService } from './rateLimitService';
import { IpstackVendor } from '../vendors/ipstack';
import { IpapiVendor } from '../vendors/ipapi';

class IpService {
  private vendors: IpVendor[];

  constructor() {
    // Initialize vendors
    this.vendors = [new IpstackVendor(), new IpapiVendor()];
  }

  /**
   * Get country information for a given IP address.
   * @param ip - The IP address to look up
   * @returns Promise resolving to IpInfo object
   * @throws Error if rate limit is exceeded for all vendors
   */
  async getCountry(ip: string): Promise<IpInfo> {
    // Check cache first
    const cachedResult = cacheService.get(ip);
    if (cachedResult) {
      return cachedResult;
    }

    // Try each vendor until successful or all are exhausted
    for (const vendor of this.vendors) {
      if (rateLimitService.canUseVendor(vendor)) {
        try {
          const result = await vendor.getCountry(ip);
          rateLimitService.incrementUsage(vendor);
          const ipInfo: IpInfo = { ip, country: result.country };
          cacheService.set(ip, ipInfo);
          return ipInfo;
        } catch (error) {
          console.error(`Error with vendor ${vendor.name}:`, error);
          continue;
        }
      }
    }

    // If all vendors are rate limited, throw an error
    throw new Error('Rate limit exceeded for all vendors');
  }
}

export const ipService = new IpService();