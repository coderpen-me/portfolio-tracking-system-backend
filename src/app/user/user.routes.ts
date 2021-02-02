import * as express from 'express';
import { validate } from '../utils/validator';
const router = express.Router();
import { addNewUser, getUsers } from './user.controller';
import { createUserValidationRules } from './user.validate';

router.post('/', createUserValidationRules(), validate, addNewUser);
router.get('/', getUsers);

export { router as userRouter };
