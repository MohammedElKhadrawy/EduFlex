const { body } = require('express-validator');

const User = require('../models/User');

const validateNameAndEmail = () => {
  return [
    body('firstName')
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('First name must be of length 3-20')
      .isAlphanumeric()
      .withMessage('First name must consist of only letters and numbers'),
    body('lastName')
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Last name must be of length 3-20')
      .isAlphanumeric()
      .withMessage('Last name must consist of only letters and numbers'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('please provide a valid E-mail')
      .normalizeEmail()
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) {
          // this condition is important for updateUser logic
          // in case the user doesn't wanna update his email, and the old one is sent back by default
          // so the user is logged in => req.user is available and we're working on his data
          // and naturally the query will find the user with the old email
          if (req.user && user._id.equals(req.user.userId)) {
            return true;
          }
          throw new Error('A user with this E-mail already exists');
        }
      }),
  ];
};

const validatePassword = (fieldName, confirmationFieldName) => {
  return [
    body(fieldName)
      .trim()
      .isLength({ min: 8 })
      .withMessage('password must be at least 8 characters')
      // .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) // min-length of 8 characters and at least one letter and one number!
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/) // this one will apply the above and also accept special characters
      .withMessage('password must contain at least 1 letter and 1 number'),
    body(confirmationFieldName).custom((value, { req }) => {
      if (value !== req.body[fieldName]) {
        throw new Error("Password and Confirmation don't match");
      }
      return true;
    }),
  ];
};

const normalizeUserEmail = (fieldName) => {
  return body(fieldName)
    .trim()
    .isEmail()
    .withMessage('please provide a valid E-mail')
    .normalizeEmail();
};

module.exports = { validateNameAndEmail, validatePassword, normalizeUserEmail };
