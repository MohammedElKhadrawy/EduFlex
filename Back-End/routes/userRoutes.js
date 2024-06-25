const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/userController');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const { validateNameAndEmail, validatePassword } = require('../utils');

const router = express.Router();

router.patch(
  '/upload-profile-picture',
  authenticateUser,
  userController.updateProfilePicture
);

// api/v1/users?role=(Instructor/Student) to get all users with that role "query parameter"
router.get(
  '/',
  [authenticateUser, authorizeRoles('Admin')],
  userController.getAllUsers
);

// front-end sends this get request right after logging user in to know which UI it should display (Instructor, Student or Admin)
router.get('/show-me', authenticateUser, userController.showCurrentUser);

router
  .route('/wish-list')
  .get(
    [authenticateUser, authorizeRoles('Student')],
    userController.getWishList
  )
  .patch(
    [authenticateUser, authorizeRoles('Student')],
    userController.toggleWishListCourse
  );

router
  .route('/:userId')
  .get(authenticateUser, userController.getSingleUser)
  .delete(
    [authenticateUser, authorizeRoles('Admin')],
    userController.deleteUser
  );
  
// temporarily disabled: Recursive issue + Fraud possibility
// .delete(
//   authenticateUser,
//   body('email')
//     .if(
//       (value, { req }) =>
//         req.user.role === 'Student' || req.user.role === 'Instructor'
//     )
//     .trim()
//     .isEmail()
//     .withMessage('please provide a valid E-mail')
//     .normalizeEmail(),
//   body('password')
//     .if(
//       (value, { req }) =>
//         req.user.role === 'Student' || req.user.role === 'Instructor'
//     )
//     .notEmpty()
//     .withMessage('Password is required'),
//   userController.deleteUser
// );

router.patch(
  '/update-user',
  authenticateUser,
  validateNameAndEmail(),
  userController.updateUser
);

router.patch(
  '/change-user-password',
  authenticateUser,
  [
    body('currentPassword', 'current password must not be empty')
      .trim()
      .notEmpty(),
    validatePassword('newPassword', 'confirmNewPassword'),
  ],
  userController.updateUserPassword
);

module.exports = router;
