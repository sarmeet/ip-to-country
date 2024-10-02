import express from 'express';
import { getCountry } from '../controllers/ipController';

const router = express.Router();

/**
 * GET /api/country
 * Endpoint for retrieving country information for an IP address.
 */
router.get('/country', getCountry);

export default router;