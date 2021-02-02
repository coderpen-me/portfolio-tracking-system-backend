import * as mongoose from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

const TradesSchema = mongoose.Schema;

const tradesModelSchema = new TradesSchema({
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
    securitySymbol: {
        type: String,
        ref: 'SecuritiesModel',
    },
    tradeType: {
        type: String,
        enum: ['B', 'S'],
    },
    tradeQuantity: {
        type: Number,
    },
    unitPrice: {
        type: Number,
    },
    totalPrice: {
        type: Number,
    },
    averagePriceAtSold: {
        type: Number,
    },
    date: {
        type: Date,
        default: () => {
            return new Date();
        },
    },
});

export default mongoose.model('TradesModel', tradesModelSchema);
