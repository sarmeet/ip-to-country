import NodeCache from 'node-cache';
import config from '../config/config';
import { IpInfo } from '../types';

/**
 * Service for caching IP to country lookup results.
 */
class CacheService {
  private cache: NodeCache;

  /**
   * Initializes the cache service with configured max size and TTL.
   */
  constructor() {
    this.cache = new NodeCache({
      maxKeys: config.cacheMaxSize,
      stdTTL: config.cacheTTL,
    });
  }

  /**
   * Stores IP information in the cache.
   * @param ip - The IP address to use as the key
   * @param data - The IP information to store
   */
  set(ip: string, data: IpInfo): void {
    this.cache.set(ip, data);
  }

  /**
   * Retrieves IP information from the cache.
   * @param ip - The IP address to look up
   * @returns The cached IP information, or undefined if not found
   */
  get(ip: string): IpInfo | undefined {
    return this.cache.get<IpInfo>(ip);
  }
}

export const cacheService = new CacheService();