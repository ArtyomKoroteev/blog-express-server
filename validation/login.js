import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Incorrect email.').isEmail(),
  body('password', 'Password should have more than 5 symbols.').isLength({min: 5}),
];
