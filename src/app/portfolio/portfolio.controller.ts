/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { sendResponse } from '../utils/responseService';
import { getPortfolioTrade, getPortfolioDetails, getPortfolioReturns } from './portfolio.service';
import { Request, Response } from 'express';
import { operationalErrors } from '../utils/constants';

/**
 * This method fetches all the securities in portfolio and corresponding trades grouped by security
 * @param req
 * @param res
 */
export const fetchPortfolioTrades = async (req: Request, res: Response) => {
    try {
        const portfolioTrades = await getPortfolioTrade(req.query.userId as string);
        sendResponse(res, 200, { portfolioTrades: portfolioTrades });
    } catch (error) {
        sendResponse(res, error.status ?? 500, error.message ? { message: error.message } : { message: operationalErrors.internalServerError });
    }
};

/**
 * This method gives all securites and their current total quantity and average price.
 * @param req
 * @param res
 */
export const fetchHoldings = async (req: Request, res: Response) => {
    try {
        const portfolioHoldings: any = await getPortfolioDetails(req.query.userId as string);
        sendResponse(res, 200, { portfolioHoldings: portfolioHoldings.securities });
    } catch (error) {
        sendResponse(res, error.status ?? 500, error.message ? { message: error.message } : { message: operationalErrors.internalServerError });
    }
};

/**
 * This method calculates total returns of a user
 * @param req
 * @param res
 */
export const fetchPortfolioReturns = async (req: Request, res: Response) => {
    try {
        const portfolioReturns = await getPortfolioReturns(req.query.userId as string);
        sendResponse(res, 200, { portfolioReturns: portfolioReturns });
    } catch (error) {
        sendResponse(res, error.status ?? 500, error.message ? { message: error.message } : { message: operationalErrors.internalServerError });
    }
};
