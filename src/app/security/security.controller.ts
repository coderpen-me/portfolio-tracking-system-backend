/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { addSecurity, getAllSecurities, getSecurityFilteredBySymbol, getSecurityLatestTransactionPrice } from './securities.service';
import { Request, Response } from 'express';
import { operationalErrors, securityEntityErrors } from '../utils/constants';
import { sendResponse } from '../utils/responseService';

/**
 * Add new security method
 * @param req
 * @param res
 */
export const createSecurity = async (req: Request, res: Response) => {
    try {
        await addSecurity(req.body.symbol, req.body.name);
        sendResponse(res, 200, { message: 'security created successfully' });
    } catch (error) {
        sendResponse(res, error.status ?? 500, { message: error.message ? error.message : operationalErrors.internalServerError, error: error.error ?? [] });
    }
};

/**
 *get security method -> If symbol is provided in input query params, It will find security with that Symbol
 *                       Else, it will show all securities
 * @param req
 * @param res
 */
export const getSecurities = async (req: Request, res: Response) => {
    try {
        const result = await getAllSecurities();
        if (result) {
            sendResponse(res, 200, { data: result });
        } else {
            sendResponse(res, 404, { message: securityEntityErrors.securityNotFound });
        }
    } catch (error) {
        sendResponse(res, error.status ?? 500, { message: error.message ? error.message : operationalErrors.internalServerError, error: error.error ?? [] });
    }
};

/**
 *get security method -> If symbol is provided in input query params, It will find security with that Symbol
 *                       Else, it will show all securities
 * @param req
 * @param res
 */
export const getSecurityBySymbol = async (req: Request, res: Response) => {
    try {
        const result = await getSecurityFilteredBySymbol(req.query.symbol as string);
        if (result) {
            sendResponse(res, 200, { data: result });
        } else {
            sendResponse(res, 404, { message: securityEntityErrors.securityNotFound });
        }
    } catch (error) {
        sendResponse(res, error.status ?? 500, { message: error.message ? error.message : operationalErrors.internalServerError, error: error.error ?? [] });
    }
};

/**
 * Get LTP - latest price of a security
 * @param req
 * @param res
 */
export const getSecurityLatestPrice = async (req: Request, res: Response) => {
    try {
        const result = await getSecurityLatestTransactionPrice(req.query.symbol as string);
        if (result) {
            sendResponse(res, 200, { data: result });
        } else {
            sendResponse(res, 404, { message: securityEntityErrors.securityNotFound });
        }
    } catch (error) {
        sendResponse(res, error.status ?? 500, { message: error.message ? error.message : operationalErrors.internalServerError, error: error.error ?? [] });
    }
};
