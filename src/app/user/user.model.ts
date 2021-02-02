import * as mongoose from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

const UserSchema = mongoose.Schema;

const userModelSchema = new UserSchema({
    _id: {
        type: String,
        default: () => {
            return uuidV4();
        },
    },
    userName: String,
    emailAddress: {
        type: String,
        unique: true,
    },
});

export default mongoose.model('UserModel', userModelSchema);
