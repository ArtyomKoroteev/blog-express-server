import { body } from 'express-validator';

export const registrationValidation = [
  body('email', 'Incorrect email.').isEmail(),
  body('password', 'Password should have more than 5 symbols.').isLength({min: 5}),
  body('fullName', 'Set name').isLength({min: 5}),
  body('avatarUrl', 'Wrong link to the avatar.').optional().isURL(),
];
