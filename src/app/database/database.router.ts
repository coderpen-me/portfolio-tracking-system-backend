import * as express from 'express';
import { clearTradesAndPortfolios } from './database.controller';
const router = express.Router();

router.post('/', clearTradesAndPortfolios);

export { router as databaseRouter };
