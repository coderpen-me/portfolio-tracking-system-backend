import * as express from 'express';
import { validate } from '../utils/validator';
const router = express.Router();
import { addNewUser, getUserByEmail, getUsers } from './user.controller';
import { createUserValidationRules } from './user.validate';

router.post('/', createUserValidationRules(), validate, addNewUser);
router.get('/', getUsers);
router.get('/all', getUserByEmail);

export { router as userRouter };
