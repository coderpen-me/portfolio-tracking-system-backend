/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { body } from 'express-validator';

export const createUserValidationRules = () => {
    return [body('userName').notEmpty().withMessage('user name is missing').bail(), body('emailAddress').notEmpty().withMessage('email address is missing').bail()];
};
