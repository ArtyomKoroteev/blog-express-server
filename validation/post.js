import { body } from 'express-validator';

export const postCreateValidation = [
  body('title', 'Incorrect title.').isLength({min: 3}),
  body('text', 'Text should have more than 100 symbols.').isLength({min: 10}),
  body('tags', 'Wrong tags format').optional().isString(),
  body('imageUrl', 'Wrong link to the avatar.').optional().isString(),
];
