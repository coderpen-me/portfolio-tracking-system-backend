/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { securityEntityErrors } from '../utils/constants';
import SecuritiesModel from './securities.model';

// Add new security in DB
export const addSecurity = async (symbol: string, name: string) => {
    try {
        const newSecurity: any = new SecuritiesModel();
        newSecurity.name = name;
        newSecurity.securitySymbol = symbol;
        return await SecuritiesModel.insertMany(newSecurity);
    } catch (error) {
        throw {
            message: 'new security creation failed in services',
            error: error.writeErrors,
        };
    }
};

// Fetch all securities
export const getAllSecurities = async () => {
    try {
        return await SecuritiesModel.find();
    } catch (error) {
        throw {
            message: securityEntityErrors.securityFetchFailed,
            error: error.writeErrors,
        };
    }
};

// Fetch a security by input security symbol
export const getSecurityBySymbol = async (symbol: string) => {
    try {
        return await SecuritiesModel.findOne({ securitySymbol: symbol });
    } catch (error) {
        throw {
            message: securityEntityErrors.securityFetchFailed,
            error: error.writeErrors,
        };
    }
};

// Fetch lastest price of a security by input security symbol
export const getSecurityLatestTransactionPrice = async (symbol: string) => {
    try {
        const security: any = await SecuritiesModel.findOne({ securitySymbol: symbol }, { latestTransactionPrice: 1, _id: 0 });
        return security.latestTransactionPrice;
    } catch (error) {
        throw {
            message: securityEntityErrors.securityFetchFailed,
            error: error.writeErrors,
        };
    }
};
