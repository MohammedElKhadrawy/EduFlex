const path = require('path');
const fs = require('fs').promises;

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/User');
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendAcknowledgementEmail,
  createTokenUser,
  generateJWT,
  collectValidationResult,
  generateOTP,
  verifyOTP,
} = require('../utils/');
const throwCustomError = require('../errors/custom-error');

const register = async (req, res, next) => {
  collectValidationResult(req);

  const {
    role,
    education,
    stage,
    level,
    // nationalID // we combined this functionality in the same endpoint!
  } = req.body;

  // Protection for admin role (only assigned for first acc or manually from database)
  const isFirstAccount = (await User.countDocuments()) === 0;
  if (!isFirstAccount && role === 'Admin') {
    throwCustomError('Bad request', 400);
  }

  // old approach using stand-alone endpoint for file upload

  // if (
  //   role === 'Instructor' &&
  //   (!nationalID || nationalID.trim().length === 0)
  // ) {
  //   throwCustomError('National ID is a required field for instructors!', 422);
  // }

  // handling required field for instructor role
  let imagePath;
  if (role === 'Instructor') {
    if (!req.files) {
      throwCustomError('No file uploaded', 400);
    }

    const nationalIdImage = req.files.idImage; // idImage is the field name front-end needs to provide!
    if (!nationalIdImage.mimetype.startsWith('image')) {
      throwCustomError('Please upload an image', 400);
    }

    const maxSize = 1024 * 1024 * 5; // 5MB
    if (nationalIdImage.size > maxSize) {
      throwCustomError('Please upload an image smaller than 5MB', 400);
    }

    const imageName = uuidv4() + '-' + nationalIdImage.name;
    imagePath = path.join(__dirname, '..', 'private', imageName);
    await nationalIdImage.mv(imagePath);

    req.body.nationalID = `private/${imageName}`;
  }

  // handling required fields for student role
  if (role === 'Student' && !education) {
    throwCustomError('Education is a required field for students!', 422);
  }

  if (role === 'Student' && education !== 'Graduated' && (!stage || !level)) {
    if (stage !== 'University') {
      throwCustomError(
        'Stage and Level of Education fields are required for undergrads!',
        422
      );
    }
  }

  // generate OTP with expiration time of 1 hr
  const { otp, otpExpiration } = generateOTP(3600000);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [user] = await User.create([{ ...req.body, otp, otpExpiration }], {
      session,
    });

    await sendVerificationEmail({
      name: user.firstName,
      email: user.email,
      otp,
    });

    await session.commitTransaction();

    res.status(201).json({
      message: 'Success! Please check your email to verify account',
    });
  } catch (error) {
    // abort transaction
    await session.abortTransaction();

    // make sure the idImage was deleted
    if (imagePath) await fs.unlink(imagePath);

    // forward error to the global error-handling middleware
    next(error);
  } finally {
    session.endSession();
  }
};

const verifyEmail = async (req, res, next) => {
  collectValidationResult(req);

  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.isVerified) {
    throwCustomError('Invalid request or user already verified.', 400);
  }

  verifyOTP({ user, otp }); // validate OTP sent to user

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiration = undefined;
  await user.save();

  // Generate JWT token for authenticated access
  const tokenUser = createTokenUser(user);
  const token = generateJWT(tokenUser);

  res.status(200).json({ message: 'Email verified successfully.', token });
};

const resendOTP = async (req, res, next) => {
  collectValidationResult(req);

  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.isVerified) {
    throwCustomError('Invalid request or user already verified.', 400);
  }

  // generate OTP with expiration time of 1 hr
  const { otp, otpExpiration } = generateOTP(3600000);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save({ session });

    // Send new OTP via email
    await sendVerificationEmail({
      name: user.firstName,
      email: user.email,
      otp,
      resend: true,
    });

    await session.commitTransaction();

    res.status(200).json({ message: 'New OTP sent successfully.' });
  } catch (error) {
    // abort transaction
    await session.abortTransaction();
    // forward error to the global error-handling middleware
    next(error);
  } finally {
    session.endSession();
  }
};

const login = async (req, res, next) => {
  collectValidationResult(req);

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throwCustomError('Could not find a user with this E-mail', 401);
  }

  const isPasswordCorrect = await user.checkPassword(password);
  if (!isPasswordCorrect) {
    throwCustomError(
      'Wrong password! try again or click forgot password to reset it.',
      401
    );
  }

  if (!user.isVerified) {
    throwCustomError(
      'Users have to verify their emails before they can log in.',
      401
    );
  }

  const tokenUser = createTokenUser(user);
  const token = generateJWT(tokenUser);

  res.status(200).json({ message: 'successfully logged in!', token });
};

const forgotPassword = async (req, res, next) => {
  collectValidationResult(req);

  const { email } = req.body;

  // Save the resetPwOtp and its expiration time in the user's document
  const user = await User.findOne({ email });

  if (!user) {
    throwCustomError('Could not find a user with this E-mail', 404);
  }

  // generate resetPwOtp with expiration time of 10 mins = 10 * 60 * 1000 ms
  const { otp: resetPwOtp, otpExpiration: resetPwOtpExpiration } =
    generateOTP(600000);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    user.resetPwOtp = resetPwOtp;
    user.resetPwOtpExpiration = resetPwOtpExpiration;
    await user.save({ session });

    // Send resetPwOtp via email
    await sendResetPasswordEmail({
      name: user.firstName,
      email: user.email,
      resetPwOtp,
    });

    await session.commitTransaction();

    res
      .status(200)
      .json({ message: 'Please check your email for reset password otp' });
  } catch (error) {
    // abort transaction
    await session.abortTransaction();
    // forward error to the global error-handling middleware
    next(error);
  } finally {
    session.endSession();
  }
};

const resetPassword = async (req, res, next) => {
  collectValidationResult(req);

  const { email, resetPwOtp, newPassword } = req.body;

  // Find the user by email and check the resetPwOtp and its expiration time
  const user = await User.findOne({ email });

  if (!user) {
    throwCustomError('Could not find a user with this E-mail', 404);
  }

  verifyOTP({ user, otp: resetPwOtp, reset: true });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update user's password and clear OTP fields
    user.password = newPassword; // hashing is done pre-save in userSchema
    user.resetPwOtp = undefined;
    user.resetPwOtpExpiration = undefined;
    await user.save({ session });

    await sendAcknowledgementEmail({ name: user.firstName, email: user.email });

    await session.commitTransaction();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    // abort transaction
    await session.abortTransaction();
    // forward error to the global error-handling middleware
    next(error);
  } finally {
    session.endSession();
  }
};

// old approach using stand-alone endpoint for file upload

// const uploadNationalID = async (req, res, next) => {
//   if (!req.files) {
//     throwCustomError('No file uploaded', 400);
//   }

//   const nationalIdImage = req.files.idImage;
//   if (!nationalIdImage.mimetype.startsWith('image')) {
//     throwCustomError('Please upload an image', 400);
//   }

//   const maxSize = 1024 * 1024 * 5; // 5MB
//   if (nationalIdImage.size > maxSize) {
//     throwCustomError('Please upload an image smaller than 5MB', 400);
//   }

//   const imageName = uuidv4() + '-' + nationalIdImage.name;
//   await nationalIdImage.mv(path.join(__dirname, '..', 'private', imageName));

//   res.status(200).json({ nationalID: `private/${imageName}` });
// };

module.exports = {
  register,
  verifyEmail,
  resendOTP,
  login,
  forgotPassword,
  resetPassword,
  // uploadNationalID,
};
