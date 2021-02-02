/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { sendResponse } from './responseService';

export const validate = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        sendResponse(res, 422, { errors: errors.array().map((e: any) => e.msg) });
    } else return next();
};
