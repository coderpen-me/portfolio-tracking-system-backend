/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { sendResponse } from '../utils/responseService';
import { Request, Response } from 'express';
import PortfolioModel from '../portfolio/portfolio.model';
import TradeModel from '../trade/trades.model';
import { operationalErrors } from '../utils/constants';
/**
 * This method clears all trades & portfolios
 * @param req
 * @param res
 */
export const clearTradesAndPortfolios = async (req: Request, res: Response) => {
    try {
        await PortfolioModel.remove({});
        await TradeModel.remove({});
        sendResponse(res, 200, { message: 'trades & portfolios cleared !' });
    } catch (error) {
        sendResponse(res, error.status ?? 500, error.message ? { message: error.message } : { message: operationalErrors.internalServerError });
    }
};
