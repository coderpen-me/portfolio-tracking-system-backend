/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import UserModel from '../user/user.model';
import { getPortfolioDetails } from '../portfolio/portfolio.service';
import { query } from 'express-validator';
import { portfolioEntityErrors, userValidationMessages, userEntityErrors } from '../utils/constants';

export const getHoldingsValidationRules = () => {
    return [
        query('userId')
            .notEmpty()
            .withMessage(userValidationMessages.userIdMissing)
            .bail()
            .custom(async (userId: string) => {
                const userFetched = await UserModel.findOne({
                    _id: userId,
                });
                if (!userFetched) {
                    return Promise.reject(userEntityErrors.userNotFound);
                }
                const portfolioData: any = await getPortfolioDetails(userId);
                if (!portfolioData) {
                    return Promise.reject(portfolioEntityErrors.portfolioNotFound);
                }
            }),
    ];
};

export const getTradesValidationRules = () => {
    return [
        query('userId')
            .notEmpty()
            .withMessage(userValidationMessages.userIdMissing)
            .bail()
            .custom(async (userId: string) => {
                const userFetched = await UserModel.findOne({
                    _id: userId,
                });
                if (!userFetched) {
                    return Promise.reject(userEntityErrors.userNotFound);
                }
                const portfolioData: any = await getPortfolioDetails(userId);
                if (!portfolioData) {
                    return Promise.reject(portfolioEntityErrors.portfolioNotFound);
                }
            }),
    ];
};

export const getReturnsValidationRules = () => {
    return [
        query('userId')
            .notEmpty()
            .withMessage(userValidationMessages.userIdMissing)
            .bail()
            .custom(async (userId: string) => {
                const userFetched = await UserModel.findOne({
                    _id: userId,
                });
                if (!userFetched) {
                    return Promise.reject(userEntityErrors.userNotFound);
                }
                const portfolioData: any = await getPortfolioDetails(userId);
                if (!portfolioData) {
                    return Promise.reject(portfolioEntityErrors.portfolioNotFound);
                }
            }),
    ];
};
