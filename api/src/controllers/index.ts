import express from 'express';
const router = express.Router();

// Get Rates
import * as currencies from './currencies';
router.get('/getRates', currencies.getRates);

export default router;
