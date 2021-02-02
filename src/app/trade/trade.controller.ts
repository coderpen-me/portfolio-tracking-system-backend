/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { sendResponse } from '../utils/responseService';
import * as tradeService from './trade.service';
import { Request, Response } from 'express';
import { operationalErrors, tradeEntityErrors } from '../utils/constants';

/**
 * This method is used to insert new trades and then update portfolio.
 * @param req
 * @param res
 */
export const addTrades = async (req: Request, res: Response) => {
    try {
        const result = await tradeService.insertTrades(req.body.userId, req.body.trades);
        if (result) {
            sendResponse(res, 200, { message: 'trade inserted successfully', data: result });
        } else {
            sendResponse(res, 422, { message: tradeEntityErrors.tradeInsertFailed });
        }
    } catch (error) {
        sendResponse(res, error.status ?? 500, { message: error.message ? error.message : operationalErrors.internalServerError, error: error.error ?? [] });
    }
};

/**
 * This method is used to update trade and then update portfolio.
 * @param req
 * @param res
 */
export const updateTrade = async (req: Request, res: Response) => {
    try {
        const result = await tradeService.updateTrade(req.body);
        if (result) {
            sendResponse(res, 200, { message: 'trade updated successfully', data: result });
        } else {
            sendResponse(res, 422, { message: tradeEntityErrors.tradeUpdateFailed });
        }
    } catch (error) {
        sendResponse(res, error.status ?? 500, { message: error.message ? error.message : operationalErrors.internalServerError, error: error.error ?? [] });
    }
};

/**
 * This method is used to delete trade and then update portfolio.
 * @param req
 * @param res
 */
export const deleteTrade = async (req: Request, res: Response) => {
    try {
        await tradeService.deleteTrade(req.query.userId as string, req.query.tradeId as string);
        sendResponse(res, 200, { message: 'trade deleted successfully' });
    } catch (error) {
        sendResponse(res, error.status ?? 500, { message: error.message ? error.message : operationalErrors.internalServerError, error: error.error ?? [] });
    }
};
