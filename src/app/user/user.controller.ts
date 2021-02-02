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
 * Fetches all users by default, but if emailAddress is provided as query params it will seach that user with provided email Address.
 * @param req
 * @param res
 */
export const getUsers = async (req: Request, res: Response) => {
    try {
        let result;
        if (req.query.emailAddress) result = await UserServices.getUserByEmail(req.query.emailAddress as string);
        else result = await UserServices.getAllUsers();
        if (result) {
            sendResponse(res, 200, { data: result });
        } else {
            sendResponse(res, 404, { message: userEntityErrors.userNotFound });
        }
    } catch (error) {
        sendResponse(res, error.status ?? 500, { message: error.message ? error.message : operationalErrors.internalServerError, error: error.error ?? [] });
    }
};
