import request from 'supertest';
import express from 'express';
import routes from '../routes';
import { ipService } from '../services/ipService';

jest.mock('../services/ipService');

const app = express();
app.use('/api', routes);

describe('Country API', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('GET /api/country should return country for valid IP', async () => {
    (ipService.getCountry as jest.Mock).mockResolvedValue({ ip: '8.8.8.8', country: 'United States' });

    const response = await request(app).get('/api/country?ip=8.8.8.8');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ip: '8.8.8.8', country: 'United States' });
  });

  it('GET /api/country should use requestor IP if no IP provided', async () => {
    (ipService.getCountry as jest.Mock).mockResolvedValue({ ip: '127.0.0.1', country: 'Local' });

    const response = await request(app).get('/api/country');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Cannot determine country for localhost' });
  });

  it('GET /api/country should handle IPv6 format', async () => {
    (ipService.getCountry as jest.Mock).mockResolvedValue({ ip: '2001:db8::1', country: 'Test Country' });

    const response = await request(app).get('/api/country?ip=2001:db8::1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ip: '2001:db8::1', country: 'Test Country' });
  });

  it('GET /api/country should return 400 if unable to determine IP', async () => {
    const response = await request(app)
      .get('/api/country')
      .set('X-Forwarded-For', ''); // Simulate empty IP

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Cannot determine country for localhost' });
  });

  it('GET /api/country should return 429 if rate limit exceeded', async () => {
    (ipService.getCountry as jest.Mock).mockRejectedValue(new Error('Rate limit exceeded for all vendors'));

    const response = await request(app).get('/api/country?ip=8.8.8.8');

    expect(response.status).toBe(429);
    expect(response.body).toEqual({ error: 'Rate limit exceeded for all vendors' });
  });

  it('GET /api/country should return 500 for unexpected errors', async () => {
    (ipService.getCountry as jest.Mock).mockRejectedValue(new Error('An unexpected error occurred'));

    const response = await request(app).get('/api/country?ip=8.8.8.8');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'An unexpected error occurred' });
  });
});