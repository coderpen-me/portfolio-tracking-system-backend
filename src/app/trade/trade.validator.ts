/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import SecuritiesModel from '../security/securities.model';
import TradeModel from '../trade/trades.model';
import UserModel from '../user/user.model';
import { getPortfolioDetails } from '../portfolio/portfolio.service';
import { body, query } from 'express-validator';

export const insertTradeValidationRules = () => {
    return [
        body('userId')
            .notEmpty()
            .withMessage('userId is missing')
            .bail()
            .custom(async (userId: string) => {
                const userFetched = await UserModel.findOne({
                    _id: userId,
                });
                if (!userFetched) {
                    return Promise.reject('userId not found');
                }
            }),
        body('trades')
            .isArray()
            .withMessage('trades must be passed as an array')
            .bail()
            .custom(async (trades: any[], params: { req: any }) => {
                if (!trades.length) {
                    throw new Error('trades data array is empty');
                }
                for (const trade of trades) {
                    if (!trade.securitySymbol || !trade.tradeType || !trade.tradeQuantity) {
                        return Promise.reject('missing required parameters in trades data');
                    }
                    if (trade.tradeType !== 'B' && trade.tradeType !== 'S') {
                        return Promise.reject('one/more trade types are invalid');
                    }
                    const securityFetched = await SecuritiesModel.find({
                        securitySymbol: trade.securitySymbol,
                    });
                    if (!securityFetched) {
                        return Promise.reject('One/more security symbol is not valid');
                    }
                }
            }),
    ];
};

export const updateTradeValidationRules = () => {
    return [
        body('userId')
            .notEmpty()
            .withMessage('userId is missing')
            .bail()
            .custom(async (userId: string) => {
                const portfolioData: any = await getPortfolioDetails(userId);
                if (!portfolioData) {
                    return Promise.reject('portfolio not found for this user');
                }
            }),
        body('tradeId')
            .notEmpty()
            .withMessage('tradeId is missing')
            .bail()
            .custom(async (tradeId: string, params: { req: any }) => {
                const trade: any = await TradeModel.findOne({ _id: tradeId });
                if (!trade) {
                    return Promise.reject('tradeId not found');
                }
                if (trade.tradeType === 'B' && trade.tradeQuantity > params.req.body.tradeQuantity) {
                    return Promise.reject(`can not update quantity less than ${trade.tradeQuantity}`);
                }
                if (trade.tradeType === 'S' && params.req.body.tradeType === 'S' && trade.tradeQuantity < params.req.body.tradeQuantity) {
                    return Promise.reject(`can not update quantity greater than ${trade.tradeQuantity}`);
                }
            }),
        body('tradeQuantity')
            .notEmpty()
            .withMessage('tradeQuantity is missing')
            .bail()
            .custom((tradeQuantity: number) => {
                if (tradeQuantity <= 0) {
                    return Promise.reject('tradeQuantity is invalid');
                }
                return true;
            }),
        body('unitPrice')
            .notEmpty()
            .withMessage('unitPrice is missing')
            .bail()
            .custom((unitPrice: number) => {
                if (unitPrice < 0) {
                    return Promise.reject('unitPrice is invalid');
                }
                return true;
            }),
    ];
};

export const deleteTradeValidationRules = () => {
    return [
        query('userId')
            .notEmpty()
            .withMessage('userId is missing')
            .bail()
            .custom(async (userId: string) => {
                const portfolioData: any = await getPortfolioDetails(userId);
                if (!portfolioData) {
                    return Promise.reject('portfolio not found for this user');
                }
                return true;
            }),
        query('tradeId')
            .notEmpty()
            .withMessage('tradeId is missing')
            .bail()
            .custom(async (tradeId: string) => {
                const tradeData: any = await TradeModel.findOne({ _id: tradeId });
                if (!tradeData) {
                    return Promise.reject('tradeId not found');
                }
                if (tradeData.tradeType == 'B') {
                    return Promise.reject('Deleting Buy type trade is not aloowed');
                }
                return true;
            }),
    ];
};
