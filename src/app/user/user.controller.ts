/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as UserServices from './user.services';
import { Request, Response } from 'express';
import { operationalErrors, userEntityErrors } from '../utils/constants';
import { sendResponse } from '../utils/responseService';
/**
 * Create a new user
 * @param req
 * @param res
 */
export const addNewUser = async (req: Request, res: Response) => {
    try {
        await UserServices.createUser(req.body.userName, req.body.emailAddress);
        sendResponse(res, 200, { message: 'user created successfully' });
    } catch (error) {
        sendResponse(res, error.status ?? 500, { message: error.message ? error.message : operationalErrors.internalServerError, error: error.error ?? [] });
    }
};

/**
 * Fetches all users
 * @param req
 * @param res
 */
export const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await UserServices.getAllUsers();
        if (result) {
            sendResponse(res, 200, { data: result });
        } else {
            sendResponse(res, 404, { message: userEntityErrors.userNotFound });
        }
    } catch (error) {
        sendResponse(res, error.status ?? 500, { message: error.message ? error.message : operationalErrors.internalServerError, error: error.error ?? [] });
    }
};

/**
 * returns user with provided email Address.
 * @param req
 * @param res
 */
export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        const result = await UserServices.getUserByEmail(req.query.emailAddress as string);
        if (result) {
            sendResponse(res, 200, { data: result });
        } else {
            sendResponse(res, 404, { message: userEntityErrors.userNotFound });
        }
    } catch (error) {
        sendResponse(res, error.status ?? 500, { message: error.message ? error.message : operationalErrors.internalServerError, error: error.error ?? [] });
    }
};
