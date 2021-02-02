/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { userEntityErrors } from '../utils/constants';
import UserModel from './user.model';
/**
 * creates new user
 * @param userName
 * @param emailAddress
 */
export const createUser = async (userName: string, emailAddress: string) => {
    try {
        const newUser: any = new UserModel();
        newUser.userName = userName;
        newUser.emailAddress = emailAddress;
        return await UserModel.insertMany(newUser);
    } catch (error) {
        throw {
            message: userEntityErrors.userCreationFailed,
            error: error.writeErrors,
        };
    }
};
/**
 * returns all users
 */
export const getAllUsers = async () => {
    try {
        return await UserModel.find();
    } catch (error) {
        throw { message: `users fetch from DB failed`, error: error.writeErrors };
    }
};

/**
 * returns user with provided emailAddress
 * @param emailAddress
 */
export const getUserByEmail = async (emailAddress: string) => {
    try {
        return await UserModel.findOne({ emailAddress: emailAddress });
    } catch (error) {
        throw { message: `users fetch from DB failed`, error: error.writeErrors };
    }
};
