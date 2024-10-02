import axios from 'axios';
import { IpVendor, VendorResponse } from '../types';

export class IpapiVendor implements IpVendor {
  name = 'ipapi';

  async getCountry(ip: string): Promise<VendorResponse> {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    return { country: response.data.country_name };
  }
}