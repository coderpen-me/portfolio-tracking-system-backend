/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as mongoose from 'mongoose';

export const createMongoConnection = (mongoURI: string) => {
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    mongoose.connection.on('connected', () => {
        console.log('Connected to DB');
    });
    mongoose.connection.on('error', (err) => {
        if (err) {
            console.log(`Error while connecting to DB ${err}`);
        }
    });
};
