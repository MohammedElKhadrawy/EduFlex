const path = require('path');

const { v4: uuidv4 } = require('uuid');

const User = require('../models/User');
const Course = require('../models/Course');
const throwCustomError = require('../errors/custom-error');
const {
  createTokenUser,
  generateJWT,
  collectValidationResult,
} = require('../utils');

const getAllUsers = async (req, res, next) => {
  const { role } = req.query;
  if (role !== 'Instructor' && role !== 'Student') {
    throwCustomError('Invalid query parameter', 400);
  }
  const users = await User.find({ role }).select('-password');
  res.status(200).json({ users, totalCount: users.length });
};

const showCurrentUser = async (req, res, next) => {
  res.status(200).json({ user: req.user });
};

const getSingleUser = async (req, res, next) => {
  const { userId } = req.params;
  // checking for permission before querying the db enhances performance for sure!
  // Admin can view any user's data, a user can only view his own data (for pre-population in user update form)
  if (req.user.role !== 'Admin' && req.user.userId !== userId) {
    throwCustomError('Unauthorized to access this route', 403);
  }
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throwCustomError(`Could not find a user with ID: ${userId}`, 404);
  }
  res.status(200).json({ user });
};

// disabled temporarily: Recursive issue + Fraud possibility
// const deleteUser = async (req, res, next) => {
//   collectValidationResult(req);

//   const {
//     params: { userId },
//     user: { role },
//   } = req;

//   // Admin can delete any user, a user can only delete his own account
//   if (role !== 'Admin' && req.user.userId !== userId) {
//     throwCustomError('Unauthorized to access this route', 403);
//   }

//   // protect Admin account from being deleted by mistake
//   if (role === 'Admin' && req.user.userId === userId) {
//     throwCustomError('Bad request, Admin account cannot be deleted', 400);
//   }

//   const user = await User.findById(userId);
//   if (!user) {
//     throwCustomError(`Could not find a user with ID: ${userId}`, 404);
//   }

//   // handshake with the student/instructor to confirm credentials before deleting
//   if (role === 'Student' || role === 'Instructor') {
//     // IMPORTANT!: axios users can provide a body to a delete request
//     // through the { data: { payload } } keyword (which is in the options object in the 2nd argument)
//     // as a delete request doesn't expect a body directly in the 2nd argument
//     const { email, password } = req.body;
//     const isPasswordCorrect = await user.checkPassword(password);
//     if (user.email !== email || !isPasswordCorrect) {
//       throwCustomError('Invalid credentials', 400);
//     }
//   }

//   await user.deleteOne();
//   res.status(200).json({ message: 'User has been deleted successfully!' });
// };

const updateUser = async (req, res, next) => {
  collectValidationResult(req);

  const { firstName, lastName, email, education, stage, level } = req.body;
  const { role, userId } = req.user;

  let updatedFields = { firstName, lastName, email };
  if (role === 'Student') {
    // Extra check for required fields
    if (education !== 'Graduated' && (!stage || !level)) {
      if (stage !== 'University') {
        throwCustomError(
          'Stage and Level of Education fields are required for undergrads!',
          422
        );
      }
    }
    updatedFields = { ...updatedFields, education, stage, level };
  }

  // This approach doesn't set "level" to undefined when it's not provided!
  // for example: when updating from "High school" - "level three" to "University" without providing level
  // (it stays level three)!

  // const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
  //   new: true,
  //   runValidators: true,
  // });

  const user = await User.findById(userId);
  if (!user) {
    throwCustomError(`Could not find a user with ID: ${userId}`, 404);
  }
  for (const key in updatedFields) {
    user[key] = updatedFields[key];
  }

  await user.save();

  const tokenUser = createTokenUser(user);
  const token = generateJWT(tokenUser); // Front-End should replace the old token with the updated one

  res
    .status(200)
    .json({ message: 'User updated successfully!', user: tokenUser, token });
};

const updateUserPassword = async (req, res, next) => {
  collectValidationResult(req);
  const {
    body: { currentPassword, newPassword },
    user: { userId },
  } = req;
  const user = await User.findById(userId);
  if (!user) {
    throwCustomError(`Could not find a user with ID: ${userId}`, 404);
  }
  const isPasswordCorrect = await user.checkPassword(currentPassword);
  if (!isPasswordCorrect) {
    throwCustomError('wrong current password', 401);
  }
  user.password = newPassword; // hashing is done pre-save in the User model
  await user.save();
  res.status(200).json({ message: 'Password updated successfully!' });
};

const getWishList = async (req, res, next) => {
  const { userId } = req.user;
  const user = await User.findById(userId)
    .select('wishList')
    .populate({
      path: 'wishList',
      populate: {
        path: 'instructor',
        select: ['firstName', 'lastName'],
      },
    });

  if (!user) {
    throwCustomError(`Could not find a user with ID: ${userId}`, 404);
  }

  res.status(200).json({ wishList: user.wishList });
};

const toggleWishListCourse = async (req, res, next) => {
  const {
    body: { courseId },
    user: { userId },
  } = req;

  const course = await Course.findById(courseId);
  if (!course) {
    throwCustomError(`Could not find a course with ID: ${courseId}`, 404);
  }

  // check for enrollment before proceeding with the wishlist logic
  const isEnrolled = course.enrollments.find((enrollment) =>
    enrollment.studentId.equals(userId)
  );
  if (isEnrolled) {
    throwCustomError(
      'A course in which you are enrolled cannot be added to your wishlist after enrollment.',
      400
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    throwCustomError(`Could not find a user with ID: ${userId}`, 404);
  }
  
  // check for course existence in the wishlist
  const alreadyExists = user.wishList.find((courseRef) =>
    courseRef.equals(courseId)
  );

  let action = {};
  if (alreadyExists) {
    action.$pull = { wishList: courseId };
  } else {
    action.$push = { wishList: courseId };
  }

  await user.updateOne(action);

  res.status(200).json({
    message: 'wishlist was updated successfully!',
    // front-end should send get request for full details about the wish-list
  });
};

const updateProfilePicture = async (req, res, next) => {
  if (!req.files) {
    throwCustomError('No file uploaded', 400);
  }

  const { profilePicture } = req.files;
  if (!profilePicture.mimetype.startsWith('image')) {
    throwCustomError('Please upload an image', 400);
  }

  const maxSize = 1024 * 1024 * 5; // 5MB
  if (profilePicture.size > maxSize) {
    throwCustomError('Please upload an image smaller than 5MB', 400);
  }

  const imageName = uuidv4() + '-' + profilePicture.name.replaceAll(' ', '-');
  await profilePicture.mv(
    path.join(__dirname, '..', 'public', 'images', imageName)
  );

  const { userId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    throwCustomError(`Could not find a user with ID: ${userId}`, 404);
  }

  user.profilePicture = `images/${imageName}`;
  await user.save();

  res
    .status(200)
    .json({ message: 'Profile picture has been updated successfully' });
};

module.exports = {
  getAllUsers,
  showCurrentUser,
  getSingleUser,
  // deleteUser,
  updateUser,
  updateUserPassword,
  getWishList,
  toggleWishListCourse,
  updateProfilePicture,
};
