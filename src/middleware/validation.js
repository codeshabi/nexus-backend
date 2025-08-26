const { body } = require('express-validator');

const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['investor', 'entrepreneur']),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim()
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

module.exports = { registerValidation, loginValidation };