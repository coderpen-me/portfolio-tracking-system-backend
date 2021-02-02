import * as express from 'express';
const router = express.Router();

import { tradeRouter } from './app/trade/trade.routes';
import { portfolioRouter } from './app/portfolio/portfolio.routes';
import { userRouter } from './app/user/user.routes';
import { securityRouter } from './app/security/security.routes';

router.use('/v1/trade', tradeRouter);
router.use('/v1/portfolio', portfolioRouter);
router.use('/v1/user', userRouter);
router.use('/v1/security', securityRouter);

export { router as mainApplicationRouter };
