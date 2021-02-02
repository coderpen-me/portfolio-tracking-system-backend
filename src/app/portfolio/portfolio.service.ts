/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import PortfolioModel from './portfolio.model';
import TradesModel from '../trade/trades.model';
import { getSecurityLatestTransactionPrice } from '../security/securities.service';

/**
 * This method returns a portfolio which includes all securities and their final quantity with average Buy Price.
 * @param userId
 */
export const getPortfolioDetails = async (userId: string) => {
    try {
        return await PortfolioModel.findOne({
            userId: userId,
        });
    } catch (error) {
        throw { message: 'Portfolio fetch from DB failed' };
    }
};

/**
 * This method saves a portfolio and those securities which have quantity > 0
 * @param portfoilio
 */
export const updatePortfolioDetails = async (portfoilio: Record<any, any>) => {
    try {
        portfoilio.securities = portfoilio.securities.filter((security: Record<any, any>) => {
            return security.totalQuantity > 0;
        });
        await portfoilio.save();
    } catch (error) {
        throw { message: `Updating portfolio failed` };
    }
};

/**
 *  This method fetches all the securities in portfolio and corresponding trades grouped by security
 * @param userId
 */
export const getPortfolioTrade = async (userId: string) => {
    try {
        const portfolio: any = await PortfolioModel.findOne({
            userId: userId,
        });
        const result = await TradesModel.aggregate([
            { $match: { userId: userId } },
            { $sort: { _id: 1 } },
            {
                $group: {
                    _id: '$securitySymbol',
                    trades: {
                        $push: {
                            tradeStatus: '$tradeStatus',
                            securitySymbol: '$securitySymbol',
                            tradeType: '$tradeType',
                            totalPrice: '$totalPrice',
                            unitPrice: '$unitPrice',
                            tradeQuantity: '$tradeQuantity',
                            userId: '$userId',
                            _id: '$_id',
                        },
                    },
                },
            },
        ]);
        portfolio._doc.trades = {};
        for (const t of result) {
            portfolio._doc.trades[t._id] = [...t.trades];
        }
        return portfolio;
    } catch (error) {
        throw { message: 'Portfolio trades fetch from DB failed' };
    }
};

/**
 * This method calculates total returns of a user
 * @param userId
 */
export const getPortfolioReturns = async (userId: string) => {
    try {
        const portfolio = await getPortfolioDetails(userId);
        let sum = 0;
        if (portfolio.securities && portfolio.securities.length > 0) {
            for (const security of portfolio.securities) {
                const latestTransactionPrice = await getSecurityLatestTransactionPrice(security.securitySymbol);
                sum += (latestTransactionPrice - security.averageBuyPrice) * security.totalQuantity;
            }
        }
        return sum;
    } catch (error) {
        throw { message: 'Return fetch from DB failed' };
    }
};
