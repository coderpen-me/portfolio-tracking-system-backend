import * as express from 'express';
import { validate } from '../utils/validator';
const router = express.Router();
import { insertTradeValidationRules, updateTradeValidationRules, deleteTradeValidationRules } from './trade.validator';
import { addTrades, updateTrade, deleteTrade } from './trade.controller';

router.post('/insert', insertTradeValidationRules(), validate, addTrades);
router.put('/update', updateTradeValidationRules(), validate, updateTrade);
router.delete('/delete', deleteTradeValidationRules(), validate, deleteTrade);

export { router as tradeRouter };
