/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Response } from 'express';

export const sendResponse = (res: Response, statusCode: number, responseContent: any) => {
    res.status(statusCode);
    res.json(responseContent);
};
