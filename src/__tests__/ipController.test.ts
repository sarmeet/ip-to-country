import { Request, Response } from 'express';
import { getCountry } from '../controllers/ipController';
import { ipService } from '../services/ipService';
import type { Socket } from 'net';

jest.mock('../services/ipService');

describe('IP Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    responseJson = jest.fn();
    mockResponse = {
      json: responseJson,
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return country for valid IP', async () => {
    mockRequest.query = { ip: '8.8.8.8' };
    (ipService.getCountry as jest.Mock).mockResolvedValue({ ip: '8.8.8.8', country: 'United States' });

    await getCountry(mockRequest as Request, mockResponse as Response);

    expect(responseJson).toHaveBeenCalledWith({ ip: '8.8.8.8', country: 'United States' });
  });

  it('should use requestor IP if no IP provided', async () => {
    const requestIp = '192.168.1.1';
    mockRequest = { ...mockRequest, ip: requestIp };
    (ipService.getCountry as jest.Mock).mockResolvedValue({ ip: requestIp, country: 'Local' });

    await getCountry(mockRequest as Request, mockResponse as Response);

    expect(responseJson).toHaveBeenCalledWith({ ip: '192.168.1.1', country: 'Local' });
  });

  it('should handle IPv6 format', async () => {
    mockRequest = { ...mockRequest, ip: '::ffff:192.0.2.1' };
    (ipService.getCountry as jest.Mock).mockResolvedValue({ ip: '192.0.2.1', country: 'Test Country' });

    await getCountry(mockRequest as Request, mockResponse as Response);

    expect(responseJson).toHaveBeenCalledWith({ ip: '192.0.2.1', country: 'Test Country' });
  });

  it('should return 400 if IP is localhost', async () => {
    mockRequest.query = { ip: '::1' };

    await getCountry(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(responseJson).toHaveBeenCalledWith({ error: 'Cannot determine country for localhost' });
  });

  it('should return 400 if unable to determine IP', async () => {
    mockRequest = {
      ...mockRequest,
      ip: undefined,
      socket: { remoteAddress: undefined } as unknown as Socket
    };

    await getCountry(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(responseJson).toHaveBeenCalledWith({ error: 'Unable to determine IP address' });
  });

  it('should return 404 if country not found for IP', async () => {
    mockRequest.query = { ip: '8.8.8.8' };
    (ipService.getCountry as jest.Mock).mockResolvedValue({ ip: '8.8.8.8', country: null });

    await getCountry(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(responseJson).toHaveBeenCalledWith({ error: 'Country not found for the given IP' });
  });

  it('should return 429 if rate limit exceeded', async () => {
    mockRequest.query = { ip: '8.8.8.8' };
    (ipService.getCountry as jest.Mock).mockRejectedValue(new Error('Rate limit exceeded for all vendors'));

    await getCountry(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(429);
    expect(responseJson).toHaveBeenCalledWith({ error: 'Rate limit exceeded for all vendors' });
  });

  it('should return 500 for unexpected errors', async () => {
    mockRequest.query = { ip: '8.8.8.8' };
    (ipService.getCountry as jest.Mock).mockRejectedValue(new Error('An unexpected error occurred'));

    await getCountry(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(responseJson).toHaveBeenCalledWith({ error: 'An unexpected error occurred' });
  });
});
