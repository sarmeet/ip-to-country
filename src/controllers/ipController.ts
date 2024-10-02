import { Request, Response } from 'express';
import { ipService } from '../services/ipService';

/**
 * Controller for handling IP to country requests.
 * @param req - Express request object
 * @param res - Express response object
 */
export const getCountry = async (req: Request, res: Response): Promise<void> => {
  let ip = req.query?.ip as string | undefined;

  // If no IP is provided in the query, use the requestor's IP
  if (!ip) {
    ip = req.ip || req.socket.remoteAddress || '';
    // Remove IPv6 prefix if present
    ip = ip.replace(/^::ffff:/, '');
  }

  // Handle localhost/loopback addresses
  if (ip === '::1' || ip === '127.0.0.1') {
    res.status(400).json({ error: 'Cannot determine country for localhost' });
    return;
  }

  // If still unable to determine IP, return an error
  if (!ip) {
    res.status(400).json({ error: 'Unable to determine IP address' });
    return;
  }

  try {
    // Get country information for the IP
    const result = await ipService.getCountry(ip);
    
    // Check if the country is null or undefined
    if (!result.country) {
      res.status(404).json({ error: 'Country not found for the given IP' });
      return;
    }
    
    res.json(result);
  } catch (error) {
    // Handle rate limit errors
    if (error instanceof Error) {
      if (error.message === 'Rate limit exceeded for all vendors') {
        res.status(429).json({ error: error.message });
      } else {
        // Handle other known errors
        res.status(500).json({ error: error.message });
      }
    } else {
      // Handle unexpected errors
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};