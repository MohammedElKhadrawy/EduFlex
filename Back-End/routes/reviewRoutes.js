const express = require('express');
const { body } = require('express-validator');

const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');
const Review = require('../models/Review');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReviews) // use ?top=true for top reviews
  .post(
    [authenticateUser, authorizeRoles('Student')],
    [
      body('rating', 'rating must be a number between 1 and 5').isFloat({
        min: 1,
        max: 5,
      }),
      // body('title', 'title must be a string less than 100 characters')
      //   .isString()
      //   .trim()
      //   .isLength({ max: 100 }),
      body('comment', 'comment is required').isString().notEmpty(),
      body('course', 'course is required')
        .notEmpty()
        .custom(async (value, { req }) => {
          const existingReview = await Review.findOne({
            course: value,
            user: req.user.userId,
          });
          if (existingReview) {
            throw new Error('already submitted review for this course');
          }
        }),
    ],
    reviewController.createReview
  );

router
  .route('/:reviewId')
  .get(reviewController.getSingleReview)
  .patch(
    authenticateUser,
    [
      body('rating', 'rating must be a number between 1 and 5').isFloat({
        min: 1,
        max: 5,
      }),
      // body('title', 'title must be a string less than 100 characters')
      //   .isString()
      //   .trim()
      //   .isLength({ max: 100 }),
      body('comment', 'comment is required').isString().notEmpty(),
    ],
    reviewController.updateReview
  )
  .delete(authenticateUser, reviewController.deleteReview);

module.exports = router;
