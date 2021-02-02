/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import TradeModel from './trades.model';
import PortfolioModel from '../portfolio/portfolio.model';
import { getPortfolioDetails, updatePortfolioDetails } from '../portfolio/portfolio.service';
import { getWeightedAverage, updateWeightedAverage } from '../utils/weightedAverageUtility';
import { getSecurityLatestTransactionPrice } from '../security/securities.service';
import { isNil } from 'lodash';
import { tradeEntityErrors } from '../utils/constants';

/**
 * This method is used to find index of input secuirty inside portfolio securities array. Securities array inside portfolio contains all securities.
 * @param portfolio portfolio object contains all securities of a particular user
 * @param symbol symbol of security we want to find in a particular portfolio
 */
export const findSecurity = (portfolio: Record<any, any>, symbol: string) => {
    const index = portfolio.securities.findIndex((p: Record<any, any>) => p.securitySymbol === symbol);
    return index === -1 ? null : index;
};

/**
 * This method inserts transaction in trade collection and modifies the portfolio. During insert, latest unit price is fetched from securities collection.
 * @param userId userId of the user who made transaction
 * @param tradeData array of all trades made by user. Each trade contains symbol of security, quantity & type of order.
 */
export const insertTrades = async (userId: string, tradeData: Array<any>) => {
    try {
        let portfolio: any = await getPortfolioDetails(userId);

        // If portfolio is not found, we will create a portfolio for this user
        if (!portfolio) {
            portfolio = new PortfolioModel();
            portfolio.userId = userId;
            portfolio.securities = [];
        }
        for (const trade of tradeData) {
            // We will fetch lastest price of security using getSecurityLatestTransactionPrice method
            const latestTransactionPrice = await getSecurityLatestTransactionPrice(trade.securitySymbol);
            trade.userId = userId;
            trade.unitPrice = latestTransactionPrice;
            trade.totalPrice = trade.tradeQuantity * latestTransactionPrice;
            const securityIndex = findSecurity(portfolio, trade.securitySymbol);
            // If trade type is to SELL
            if (trade.tradeType == 'S') {
                // If security is not present in portfolio, we can not perform sell operation.
                if (!isNil(securityIndex)) {
                    // If total quantity available is less than SELL quantity, we can not perform sell operation.
                    if (portfolio.securities[securityIndex].totalQuantity >= trade.tradeQuantity) {
                        // removing sold quantity from portfolio
                        portfolio.securities[securityIndex].totalQuantity -= trade.tradeQuantity;
                        // Storing average BUY price of security sold. This will help to update this transaction in future.
                        trade.averagePriceAtSold = portfolio.securities[securityIndex].averageBuyPrice;
                    } else {
                        throw { message: `not enough quantity to sell ${trade.securitySymbol}` };
                    }
                } else {
                    throw { message: `security ${trade.securitySymbol} doesn't exist in the portfolio` };
                }
            } else if (trade.tradeType == 'B') {
                // If trade type is to Buy
                if (!isNil(securityIndex)) {
                    // Security is present in portfolio, then we will only update exisiting average rate and quantity
                    // Calculating new average buy using given formala : (qty1 * price + qty2 * price)/(qty1 + qty2)
                    portfolio.securities[securityIndex].averageBuyPrice = getWeightedAverage(
                        portfolio.securities[securityIndex].totalQuantity,
                        portfolio.securities[securityIndex].averageBuyPrice,
                        trade.tradeQuantity,
                        latestTransactionPrice
                    );
                    // To update totoal quantity, We are adding trade BUY quantity
                    portfolio.securities[securityIndex].totalQuantity += trade.tradeQuantity;
                } else {
                    // If security is not present in portfolio, We will create a new security object and add it to portfolio as we are BUYING in this action.
                    portfolio.securities.push({
                        securitySymbol: trade.securitySymbol,
                        totalQuantity: trade.tradeQuantity,
                        averageBuyPrice: latestTransactionPrice,
                    });
                }
            }
        }
        // Inserting all trades in trades collection -> Working as history of trades here.
        const updatedTrades = await TradeModel.insertMany(tradeData);
        // Updating the portfolio after all trade changes are done
        await updatePortfolioDetails(portfolio);
        return updatedTrades;
    } catch (error) {
        throw { message: tradeEntityErrors.tradeInsertFailed };
    }
};

/**
 * This method is used to update traction based on given conditions :
 *
 * WE CAN NOT DO
 * 1. BUY type of transaction can not be changed to SELL --> Because, it will invalidate subsequent SELL operation (If any)
 * 2. BUY type of transaction quantity can not decreased in update --> Because, it will invalidate subsequent SELL operation (If any)
 * 3. SELL type of transaction quantity can not be increased --> Because, we may sell more than available at that point.
 *
 * WE CAN DO
 * 4. Update SELL to BUY & then increase/decrease quantity
 * 5. Decrease SELL quantity
 * 6. Increase BUY quantity
 * @param body
 */
export const updateTrade = async (updateTradeData: Record<any, any>) => {
    const portfolio: any = await getPortfolioDetails(updateTradeData.userId);
    const trade: any = await TradeModel.findOne({ _id: updateTradeData.tradeId });
    const securityIndex = findSecurity(portfolio, trade.securitySymbol);
    // If trade is BUY type
    if (trade.tradeType === 'B') {
        // If security is not present in portfolio, we will create new security in portfolio.
        if (!isNil(securityIndex)) {
            // To update a BUY trade, we will use weighted average formula to exclude previous trade parameters and add new at same time.
            // (security_total_qty * avg_price_in_security + updated_qty * updated_price - old_qty * old_price)/(security_total_qty + updated_qty - old_qty)
            portfolio.securities[securityIndex].averageBuyPrice = updateWeightedAverage(
                portfolio.securities[securityIndex].totalQuantity,
                portfolio.securities[securityIndex].averageBuyPrice,
                updateTradeData.tradeQuantity,
                updateTradeData.unitPrice,
                trade.tradeQuantity,
                trade.unitPrice
            );
            // Updating quantity in portfolio -> total_in_portfolio + new_qty - old_qty
            portfolio.securities[securityIndex].totalQuantity = portfolio.securities[securityIndex].totalQuantity + updateTradeData.tradeQuantity - trade.tradeQuantity;
            // Updating trade details (To update document in trade collection)
            trade.tradeQuantity = updateTradeData.tradeQuantity;
            trade.unitPrice = updateTradeData.unitPrice;
            trade.totalPrice = trade.tradeQuantity * trade.unitPrice;
        } else {
            // If security is not present in portfolio, we will create it, as we are BUYING.
            portfolio.securities.push({
                securitySymbol: trade.securitySymbol,
                averageBuyPrice: updateTradeData.unitPrice,
                totalQuantity: updateTradeData.tradeQuantity - trade.tradeQuantity,
            });
            // Updating trade details (To update document in trade collection)
            trade.tradeQuantity = updateTradeData.tradeQuantity;
            trade.unitPrice = updateTradeData.unitPrice;
            trade.totalPrice = updateTradeData.tradeQuantity * updateTradeData.unitPrice;
        }
    } else if (trade.tradeType === 'S') {
        // SELL can be updated to BUY or we can decrease SELL quantity
        if (updateTradeData.tradeType === 'B') {
            if (!isNil(securityIndex)) {
                // If security is present in portfolio, we will first add sold quantity (based on price on which it was sold).
                portfolio.securities[securityIndex].averageBuyPrice = getWeightedAverage(
                    portfolio.securities[securityIndex].totalQuantity,
                    portfolio.securities[securityIndex].averageBuyPrice,
                    trade.tradeQuantity,
                    trade.averagePriceAtSold
                );
                // Adding back sold quantity
                portfolio.securities[securityIndex].totalQuantity += trade.tradeQuantity;
                // Performing weighted average for BUY operation
                portfolio.securities[securityIndex].averageBuyPrice = getWeightedAverage(
                    portfolio.securities[securityIndex].totalQuantity,
                    portfolio.securities[securityIndex].averageBuyPrice,
                    updateTradeData.tradeQuantity,
                    updateTradeData.unitPrice
                );
                // Adding brought quantity
                portfolio.securities[securityIndex].totalQuantity += updateTradeData.tradeQuantity;
            } else {
                portfolio.securities.push({
                    securitySymbol: trade.securitySymbol,
                    averageBuyPrice: getWeightedAverage(trade.tradeQuantity, trade.averagePriceAtSold, updateTradeData.tradeQuantity, updateTradeData.unitPrice),
                    totalQuantity: trade.tradeQuantity + updateTradeData.tradeQuantity,
                });
            }
            // Updating trade details (To update document in trade collection)
            trade.tradeQuantity = updateTradeData.tradeQuantity;
            trade.unitPrice = updateTradeData.unitPrice;
            trade.totalPrice = trade.tradeQuantity * trade.unitPrice;
            trade.tradeType = updateTradeData.tradeType;
        } else {
            // If security is not present in portfoio, we need to add the security in portfolio as we will be SELLING less now that will increase quantity.
            if (!isNil(securityIndex)) {
                // If security is present in portfolio, we will update the average price in postfolio and total quantity
                portfolio.securities[securityIndex].averageBuyPrice = getWeightedAverage(
                    portfolio.securities[securityIndex].totalQuantity,
                    portfolio.securities[securityIndex].averageBuyPrice,
                    trade.tradeQuantity - updateTradeData.tradeQuantity,
                    trade.averagePriceAtSold
                );
                portfolio.securities[securityIndex].totalQuantity += trade.tradeQuantity - updateTradeData.tradeQuantity;
            } else {
                // Adding security in portfolio, as we are now selling less, so we will add the difference in quantities now.
                portfolio.securities.push({
                    securitySymbol: trade.securitySymbol,
                    averageBuyPrice: trade.averagePriceAtSold,
                    totalQuantity: trade.tradeQuantity - updateTradeData.tradeQuantity,
                });
            }
            // Updating trade details (To update document in trade collection)
            trade.tradeQuantity = updateTradeData.tradeQuantity;
            trade.unitPrice = updateTradeData.unitPrice;
            trade.totalPrice = trade.tradeQuantity * trade.unitPrice;
        }
    }

    // Inserting all trades in trades collection -> Working as history of trades here.
    const result = await TradeModel.findOneAndUpdate({ _id: trade._id }, trade, { new: true });
    // Updating the portfolio after all trade changes are done
    await updatePortfolioDetails(portfolio);
    return result;
};

/**
 * In this transaction, we will delete only SELL type trades, as deleting BUY type trades will invalidate subsequent SELL trades.
 * WE CAN ONLY DELETE SELL TRADES
 * @param userId
 * @param tradeId
 */
export const deleteTrade = async (userId: string, tradeId: Record<any, any>) => {
    const portfolio: any = await getPortfolioDetails(userId);
    const trade: any = await TradeModel.findOne({ _id: tradeId });
    // Getting index of security inside portfolio
    const securityIndex = findSecurity(portfolio, trade.securitySymbol);
    // If security is not present, we will add it in portfolio with quantity sold based on average price at which it was purchased ,
    // else we will add SOLD securities back to portfolio and delete the transaction.
    if (!isNil(securityIndex)) {
        // Adding sold securities, back to portfolio -> changing average rate here.
        portfolio.securities[securityIndex].averageBuyPrice = getWeightedAverage(
            portfolio.securities[securityIndex].totalQuantity,
            portfolio.securities[securityIndex].averageBuyPrice,
            trade.tradeQuantity,
            trade.averagePriceAtSold
        );
        // Adding quantities sold, back to portfolio.
        portfolio.securities[securityIndex].totalQuantity += trade.tradeQuantity;
    } else {
        portfolio.securities.push({
            securitySymbol: trade.securitySymbol,
            averageBuyPrice: trade.averagePriceAtSold,
            totalQuantity: trade.tradeQuantity,
        });
    }

    const result = await TradeModel.deleteOne({ _id: trade._id });

    //update the portfolio accordinly:
    await updatePortfolioDetails(portfolio);
    return result;
};
