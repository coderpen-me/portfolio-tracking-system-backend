import * as mongoose from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

const SecuritiesSchema = mongoose.Schema;

const securitiesModelSchema = new SecuritiesSchema({
    _id: {
        type: String,
        default: () => {
            return uuidV4();
        },
    },
    securitySymbol: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
    },
    latestTransactionPrice: {
        type: Number,
        default: 100,
    },
});

export default mongoose.model('SecuritiesModel', securitiesModelSchema);
