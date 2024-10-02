import axios from 'axios';
import config from '../config/config';
import { IpVendor, VendorResponse } from '../types';

/**
 * Vendor implementation for IPstack service.
 */
export class IpstackVendor implements IpVendor {
  name = 'ipstack';

  /**
   * Retrieves country information for a given IP address using IPstack API.
   * @param ip - The IP address to look up
   * @returns Promise resolving to VendorResponse containing country information
   * @throws Error if the API request fails
   */
  async getCountry(ip: string): Promise<VendorResponse> {
    const response = await axios.get(`http://api.ipstack.com/${ip}`, {
      params: {
        access_key: config.ipstackApiKey,
        fields: 'country_name',
      },
    });

    return { country: response.data.country_name };
  }
}