export interface IpInfo {
  ip: string;
  country: string;
}

export interface VendorResponse {
  country: string;
}

export interface IpVendor {
  name: string;
  getCountry(ip: string): Promise<VendorResponse>;
}