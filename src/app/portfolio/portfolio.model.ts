import * as mongoose from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

const PortfolioSchema = mongoose.Schema;

const portfolioModelSchema = new PortfolioSchema({
    _id: {
        type: String,
        default: () => {
            return uuidV4();
        },
    },
    userId: {
        type: String,
        ref: 'UserModel',
    },
    securities: [
        {
            averageBuyPrice: {
                type: Number,
            },
            totalQuantity: {
                type: Number,
            },
            securitySymbol: {
                type: String,
                ref: 'SecuritiesModel',
            },
        },
    ],
});

export default mongoose.model('PortfolioModel', portfolioModelSchema);
