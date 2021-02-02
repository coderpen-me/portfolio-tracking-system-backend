/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { query, body } from 'express-validator';

export const createSecurityValidationRules = () => {
    return [body('symbol').notEmpty().withMessage('security symbol is missing').bail(), body('name').notEmpty().withMessage('security name is missing').bail()];
};

export const getSecurityLatestPriceValidationRules = () => {
    return [query('symbol').notEmpty().withMessage('security symbol is missing').bail()];
};
