import * as express from 'express';
const router = express.Router();
import { fetchPortfolioTrades, fetchHoldings, fetchPortfolioReturns } from './portfolio.controller';
import { validate } from '../utils/validator';
import { getTradesValidationRules, getHoldingsValidationRules, getReturnsValidationRules } from './portfolio.validator';

router.get('/trades', getTradesValidationRules(), validate, fetchPortfolioTrades);
router.get('/holdings', getHoldingsValidationRules(), validate, fetchHoldings);
router.get('/returns', getReturnsValidationRules(), validate, fetchPortfolioReturns);

export { router as portfolioRouter };
