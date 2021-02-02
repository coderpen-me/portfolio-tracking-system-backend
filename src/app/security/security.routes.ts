import * as express from 'express';
import { validate } from '../utils/validator';
import { createSecurityValidationRules, getSecurityLatestPriceValidationRules } from './securities.validator';
const router = express.Router();
import { createSecurity, getSecurities, getSecurityBySymbol, getSecurityLatestPrice } from './security.controller';

router.post('/', createSecurityValidationRules(), validate, createSecurity);
router.get('/', getSecurityBySymbol);
router.get('/all', getSecurities);
router.get('/latest-transaction-price', getSecurityLatestPriceValidationRules(), validate, getSecurityLatestPrice);

export { router as securityRouter };
