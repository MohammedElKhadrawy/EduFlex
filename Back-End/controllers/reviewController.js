const Course = require('../models/Course');
const Review = require('../models/Review');
const throwCustomError = require('../errors/custom-error');
const { collectValidationResult } = require('../utils');

const createReview = async (req, res, next) => {
  collectValidationResult(req);
  const { course: courseId } = req.body;
  const targetCourse = await Course.findById(courseId);
  if (!targetCourse) {
    throwCustomError(`Could not find a course with ID: ${courseId}`, 404);
  }

  const { userId } = req.user;
  const isEnrolled = targetCourse.enrollments.find((enrollment) =>
    enrollment.studentId.equals(userId)
  );
  if (!isEnrolled) {
    throwCustomError('You are not enrolled in this course', 403);
  }

  const reviewData = { ...req.body, user: userId };
  const review = await Review.create(reviewData);
  res.status(201).json({ review });
};

const getAllReviews = async (req, res, next) => {
  const { top } = req.query;

  const queryObj = {};
  
  if (top) {
    queryObj.rating = { $gte: 4.5 };
  }

  const reviews = await Review.find(queryObj).sort('-rating').populate([
    { path: 'course', select: ['title', 'subject'] },
    { path: 'user', select: ['firstName', 'lastName', 'profilePicture'] },
  ]);
  // .populate('user', 'firstName'); // just to know that we can chain populate multiple times, one field at a time
  res.status(200).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId).populate([
    { path: 'course', select: ['title', 'subject'] },
    { path: 'user', select: ['firstName', 'lastName', 'profilePicture'] },
  ]);
  if (!review) {
    throwCustomError(`Could not find a review with ID: ${reviewId}`, 404);
  }
  res.status(200).json({ review });
};

const updateReview = async (req, res, next) => {
  collectValidationResult(req);
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    throwCustomError(`Could not find a review with ID: ${reviewId}`, 404);
  }
  if (!review.user.equals(req.user.userId)) {
    throwCustomError(
      'Unauthorized, only the user who created this review can update it',
      403
    );
  }
  // this approach makes it more flexible, the user only passes the to-be-changed fields!
  for (const prop in req.body) {
    if (prop === 'user' || prop === 'course') continue;
    review[prop] = req.body[prop];
  }
  await review.save();
  res.status(200).json({ review });
};

const deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    throwCustomError(`Could not find a review with ID: ${reviewId}`, 404);
  }
  if (!review.user.equals(req.user.userId)) {
    throwCustomError(
      'Unauthorized, only the user who created this review can delete it',
      403
    );
  }
  await review.deleteOne();
  res.status(200).json({ message: 'Successfully deleted review' });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
