const express = require('express');

const {
  authenticateUser,
  authorizeRoles,
  verifyTokenFromQuery,
} = require('../middleware/auth');
const courseController = require('../controllers/courseController');

const router = express.Router();

// // we combined this to be in the createCourse route!
// router.post(
//   '/upload-course-image',
//   [authenticateUser, authorizeRoles('Instructor')],
//   courseController.uploadCourseImage
// );

router
  .route('/')
  // admin can use ?status=Pending for requests
  .get(authenticateUser, courseController.getAllCourses)
  .post(
    [authenticateUser, authorizeRoles('Instructor')],
    courseController.createCourse
  );

// GET => /search-by-category?category=primary&level=1&term=1 for example
router.get(
  '/search-by-category',
  authenticateUser,
  courseController.searchCourses
);

// GET => /my-courses taught or enrolled (switch-case)
router.get(
  '/my-courses',
  [authenticateUser, authorizeRoles('Student', 'Instructor')],
  courseController.getCurrentUserCourses
);

router
  .route('/:courseId')
  .get(authenticateUser, courseController.getSingleCourse)
  // PATCH => /:courseId update course only for course owner, and only admin can change status!
  .patch(
    [authenticateUser, authorizeRoles('Admin', 'Instructor')],
    courseController.updateCourse
  );

// POST => /:courseId/enroll for student enrollment
router.post(
  '/:courseId/enroll',
  [authenticateUser, authorizeRoles('Student')],
  courseController.enrollInCourse
);

// instructor can get all students enrolled in his course (populated enrollments)
// get course enrollments (for the owner/admin)
router.get(
  '/:courseId/enrollments',
  [authenticateUser, authorizeRoles('Instructor', 'Admin')],
  courseController.getCourseEnrollments
);

router
  .route('/:courseId/sections')
  .post(
    [authenticateUser, authorizeRoles('Instructor')],
    courseController.addSectionToCourse
  );

router
  .route('/:courseId/sections/:sectionIndex')
  .patch(
    [authenticateUser, authorizeRoles('Instructor')],
    courseController.updateSectionTitle
  )
  .delete(
    [authenticateUser, authorizeRoles('Instructor')],
    courseController.deleteSectionFromCourse
  );

// // we combined this to be in the addVideoToSection route!
// // front-end sends a request to this route onChange of the file field
// router.post(
//   '/upload-course-video',
//   [authenticateUser, authorizeRoles('Instructor')],
//   courseController.uploadCourseVideo
// );

router
  .route('/:courseId/sections/:sectionIndex/videos')
  .post(
    [authenticateUser, authorizeRoles('Instructor')],
    courseController.addVideoToSection
  );

router
  .route('/:courseId/sections/:sectionIndex/videos/:videoIndex')
  .get(verifyTokenFromQuery, courseController.getVideo)
  // use this to update title and isPreview
  .patch(
    [authenticateUser, authorizeRoles('Instructor')],
    courseController.updateVideoInfo
  )
  .delete(
    [authenticateUser, authorizeRoles('Instructor')],
    courseController.deleteVideo
  );

module.exports = router;
