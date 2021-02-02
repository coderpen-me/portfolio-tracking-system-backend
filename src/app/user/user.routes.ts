import * as express from 'express';
import { validate } from '../utils/validator';
const router = express.Router();
import { addNewUser, getUserByEmail, getUsers } from './user.controller';
import { createUserValidationRules } from './user.validate';

router.post('/', createUserValidationRules(), validate, addNewUser);
router.get('/all', getUsers);
router.get('/', getUserByEmail);

export { router as userRouter };
