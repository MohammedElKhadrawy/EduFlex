const path = require('path');
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');

const Course = require('../models/Course');
const User = require('../models/User');
const throwCustomError = require('../errors/custom-error');

// Local Utility Functions

const checkCoursePermissions = async (courseId, userId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throwCustomError(`Could not find a course with ID: ${courseId}`, 404);
  }
  if (!course.instructor.equals(userId)) {
    throwCustomError(
      'Unauthorized!, only the instructor who created this course can modify it.',
      403
    );
  }
  return course;
};

const formatDuration = (durationString) => {
  const durationInSeconds = parseInt(durationString);

  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  // padStart  is used to add leading zeros until it reaches the specified length (2)
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  return `(${formattedMinutes}:${formattedSeconds})`;
};

const parseExpirationDate = (limitedPeriod, enrollmentDate) => {
  // map limited periods to days
  const periodDaysMap = {
    'A week': 7,
    '2 weeks': 14,
    Month: 30,
    '2 month': 2 * 30,
    '4 month': 4 * 30,
    '6 month': 6 * 30,
    '8 month': 8 * 30,
    '10 month': 10 * 30,
    Year: 12 * 30,
  };
  const limitedPeriodInMs = periodDaysMap[limitedPeriod] * 24 * 60 * 60 * 1000;
  const expirationDate = new Date(enrollmentDate.getTime() + limitedPeriodInMs);
  return expirationDate;
};

// Controller Functions

const getAllCourses = async (req, res, next) => {
  const { role } = req.user;
  const queryObj = {};
  // only admin gets to use status query parameter
  if (role === 'Admin') {
    const { status } = req.query;
    if (status) {
      const supportedStatus = ['Accepted', 'Pending', 'Rejected'];
      if (!supportedStatus.includes(status)) {
        throwCustomError('Unsupported value for status parameter', 400);
      }
      queryObj.status = status;
    }
  } else {
    queryObj.status = 'Accepted';
  }
  const courses = await Course.find(queryObj).populate(
    'instructor',
    'firstName lastName'
  );
  res.status(200).json({ courses });
};

const createCourse = async (req, res, next) => {
  if (!req.files) {
    throwCustomError('No file uploaded', 400);
  }

  const { courseImage } = req.files; // courseImage is the field name front-end needs to provide!
  if (!courseImage.mimetype.startsWith('image')) {
    throwCustomError('Please upload an image', 400);
  }

  const maxSize = 1024 * 1024 * 5; // 5MB
  if (courseImage.size > maxSize) {
    throwCustomError('Please upload an image smaller than 5MB', 400);
  }

  const imageName = uuidv4() + '-' + courseImage.name;
  await courseImage.mv(
    path.join(__dirname, '..', 'public', 'images', imageName)
  );

  const { courseAvailability, limitedPeriod } = req.body;
  if (courseAvailability === 'Limited' && !limitedPeriod) {
    throwCustomError('Limited period is required for a limited course!', 400);
  }
  if (courseAvailability === 'Unlimited' && limitedPeriod) {
    throwCustomError(
      'Cannot specify limited period for an unlimited course!',
      400
    );
  }

  const courseData = {
    ...req.body,
    imageUrl: `images/${imageName}`,
    status: 'Pending',
    instructor: req.user.userId,
  };

  const course = await Course.create(courseData);
  res.status(201).json({
    message:
      "Course has been created successfully, and is now pending admin's approval!",
    course,
  });
};

const getTopRatedCourses = async (req, res, next) => {
  const { category } = req.query;

  const queryObj = { avgRating: { $gte: 4.5 }, status: 'Accepted' };

  if (category) {
    const categoryMap = {
      primary: 'Primary stage',
      middle: 'Middle school',
      high: 'High school',
      university: 'University',
      skills: 'Graduated',
    };

    if (!Object.keys(categoryMap).includes(category)) {
      throwCustomError('unsupported category', 400);
    }

    if (category === 'skills') {
      queryObj.education = categoryMap[category];
    } else {
      queryObj.stage = categoryMap[category];
    }
  }

  const topRatedCourses = await Course.find(queryObj)
    .sort('-avgRating')
    .select('title avgRating numOfReviews price instructor imageUrl')
    .populate('instructor', 'firstName lastName');

  res.status(200).json({ topRatedCourses });
};

const searchCourses = async (req, res, next) => {
  const { category, level, term } = req.query;

  const queryObj = {};

  const categoryMap = {
    primary: 'Primary stage',
    middle: 'Middle school',
    high: 'High school',
    university: 'University',
    skills: 'Graduated',
  };

  if (!Object.keys(categoryMap).includes(category)) {
    throwCustomError('unsupported category', 400);
  }

  if (category === 'skills') {
    queryObj.education = categoryMap[category];
  } else {
    queryObj.stage = categoryMap[category];
  }

  if (level) {
    const levelMap = {
      1: 'Level one',
      2: 'Level two',
      3: 'Level three',
    };

    if (!Object.keys(levelMap).includes(level)) {
      throwCustomError('Invalid level parameter.', 400);
    }

    queryObj.level = levelMap[level];
  }

  if (term) {
    const termMap = {
      1: 'First term',
      2: 'Second term',
    };

    if (!Object.keys(termMap).includes(term)) {
      throwCustomError('Invalid term parameter.', 400);
    }

    queryObj.term = termMap[term];
  }

  queryObj.status = 'Accepted';

  const courses = await Course.find(queryObj).populate(
    'instructor',
    'firstName lastName'
  );

  res.status(200).json({ courses });
};

// students get courses they enrolled in and instructors get courses they teach
const getCurrentUserCourses = async (req, res, next) => {
  const { userId, role } = req.user;

  const queryObj = {};
  switch (role) {
    case 'Student':
      queryObj['enrollments.studentId'] = userId;
      break;
    case 'Instructor':
      queryObj['instructor'] = userId;
      break;
  }

  const courses = await Course.find(queryObj)
    .populate('instructor', 'firstName lastName')
    .sort('-createdAt'); // latest first
  res.status(200).json({ courses });
};

const getSingleCourse = async (req, res, next) => {
  const {
    params: { courseId },
    user: { userId, role },
  } = req;

  const course = await Course.findById(courseId).populate([
    {
      path: 'instructor',
      select: ['firstName', 'lastName'],
    },
    {
      path: 'reviews',
      populate: {
        path: 'user',
        select: ['firstName', 'lastName', 'profilePicture'],
      },
    },
  ]);

  if (!course) {
    throwCustomError(`No course with the ID of ${courseId})`, 404);
  }

  if (
    role !== 'Admin' &&
    course.status !== 'Accepted' &&
    !course.instructor.equals(userId)
  ) {
    throwCustomError('Unauthorized to access this course content', 403);
  }

  res.status(200).json({ course, studentsCount: course.enrollments.length });
};

// course owner can update but only admin can change status to accept or reject
const updateCourse = async (req, res, next) => {
  const {
    params: { courseId },
    user: { role, userId },
    body: { status },
  } = req;

  let course;
  switch (role) {
    case 'Instructor': {
      if (status) {
        throwCustomError('Unauthorized to update course status', 403);
      }
      // check for course ownership
      course = await checkCoursePermissions(courseId, userId);
      for (const key in req.body) {
        course[key] = req.body[key];
      }
      await course.save();
      break;
    }
    case 'Admin': {
      const supportedStatus = ['Accepted', 'Pending', 'Rejected'];
      if (!supportedStatus.includes(status)) {
        throwCustomError('unsupported status', 400);
      }
      course = await Course.findByIdAndUpdate(
        courseId,
        {
          $set: { status: status },
        },
        { new: true, runValidators: true }
      );
      if (!course) {
        throwCustomError(`No course with the ID of ${courseId})`, 404);
      }
      break;
    }
  }

  res
    .status(200)
    .json({ message: 'Course info has been updated successfully', course });
};

const enrollInCourse = async (req, res, next) => {
  const {
    user: { userId },
    params: { courseId },
  } = req;

  const course = await Course.findById(courseId);
  if (!course) {
    throwCustomError(`No course with the ID of ${courseId})`, 404);
  }

  const isEnrolled = course.enrollments.find((enrollment) =>
    enrollment.studentId.equals(userId)
  );

  if (isEnrolled) {
    throwCustomError('you are already enrolled in this course!', 400);
  }

  // add student's id to course enrollments
  course.enrollments.push({ studentId: userId });
  await course.save();

  // remove the course from user's wishlist
  await User.findByIdAndUpdate(userId, {
    $pull: { wishList: courseId },
  });

  res.status(200).json({ message: 'successfully enrolled in the course!' });
};

// only the course owner or an admin can get the populated enrollments with all the students data
const getCourseEnrollments = async (req, res, next) => {
  const {
    params: { courseId },
    user: { role, userId },
  } = req;

  let course;
  switch (role) {
    case 'Admin':
      course = await Course.findById(courseId).populate(
        'enrollments.studentId',
        'firstName lastName profilePicture'
      );
      break;

    case 'Instructor':
      course = await checkCoursePermissions(courseId, userId);
      await course.populate(
        'enrollments.studentId',
        'firstName lastName profilePicture'
      );
      break;
  }

  res.status(200).json({
    enrollments: course.enrollments,
    studentsCount: course.enrollments.length,
  });
};

const addSectionToCourse = async (req, res, next) => {
  const {
    params: { courseId },
    user: { userId },
    body: { sectionTitle },
  } = req;
  const course = await checkCoursePermissions(courseId, userId);
  const newSection = { title: sectionTitle, videos: [] };
  course.sections.push(newSection);
  await course.save();
  res.status(201).json({
    message: 'Section has been added to the course successfully!',
    sections: course.sections,
  });
};

const updateSectionTitle = async (req, res, next) => {
  const {
    params: { courseId, sectionIndex },
    user: { userId },
    body: { sectionTitle },
  } = req;
  const course = await checkCoursePermissions(courseId, userId);
  if (
    !sectionIndex ||
    sectionIndex >= course.sections.length ||
    sectionIndex < 0
  ) {
    throwCustomError('Invalid Section Index!', 400);
  }
  course.sections[sectionIndex].title = sectionTitle;
  await course.save();
  res.status(200).json({
    message: `Section title at index ${sectionIndex} has been updated successfully!`,
    sections: course.sections,
  });
};

const deleteSectionFromCourse = async (req, res, next) => {
  const {
    params: { courseId, sectionIndex },
    user: { userId },
  } = req;
  const course = await checkCoursePermissions(courseId, userId);
  if (
    !sectionIndex ||
    sectionIndex >= course.sections.length ||
    sectionIndex < 0
  ) {
    throwCustomError('Invalid Section Index!', 400);
  }
  // Remove all video references from this section before deleting it
  for (const video of course.sections[sectionIndex].videos) {
    const videoPath = path.join(__dirname, '..', video.videoUrl);
    fs.unlinkSync(videoPath);
  }
  course.sections.splice(sectionIndex, 1);
  await course.save();
  res.status(200).json({
    message: `The section with index ${sectionIndex} has been deleted successfully!`,
    sections: course.sections,
  });
};

const addVideoToSection = async (req, res, next) => {
  const {
    params: { courseId, sectionIndex },
    user: { userId },
    body: { isPreview },
  } = req;

  const course = await checkCoursePermissions(courseId, userId);
  if (
    !sectionIndex ||
    sectionIndex >= course.sections.length ||
    sectionIndex < 0
  ) {
    throwCustomError('Invalid Section Index!', 400);
  }

  if (!req.files) {
    throwCustomError('No file uploaded', 400);
  }

  const { courseVideo } = req.files; // courseVideo is the field name front-end needs to provide!
  if (courseVideo.mimetype !== 'video/mp4') {
    throwCustomError('Please upload a video in mp4 format', 400);
  }

  const maxSize = 1024 * 1024 * 100; // 100MB
  if (courseVideo.size > maxSize) {
    throwCustomError('Please upload an image smaller than 100MB', 400);
  }

  // const videoName = uuidv4() + '-' + courseVideo.name.replaceAll(' ', '-');
  const videoName = uuidv4() + '.mp4';
  const videoPath = path.join(__dirname, '..', 'videos', videoName);
  await courseVideo.mv(videoPath);

  // Extract metadata from the uploaded video
  const metadata = await ffprobe(videoPath, { path: ffprobeStatic.path });
  const { width, height, duration } = metadata.streams[0];

  // Check if resolution meets requirements (480p or higher)
  if (width < 854 || height < 480) {
    fs.unlinkSync(videoPath);
    throwCustomError(
      'Video resolution must be higher than or equal to 854x480p',
      400
    );
  }

  const formattedDuration = formatDuration(duration);

  const videoData = {
    // title: courseVideo.name.split('.')[0], // This may not always work if the name contains dots (.)
    title: courseVideo.name.replace('.mp4', ''), // This is to get the title without the extension!
    formattedDuration,
    isPreview,
    videoUrl: `videos/${videoName}`,
  };

  course.sections[sectionIndex].videos.push(videoData);
  await course.save();

  res.status(200).json({
    message: 'Video has been uploaded successfully!',
    sections: course.sections,
    videoData,
  });
};

const getVideo = async (req, res, next) => {
  const {
    params: { courseId, sectionIndex, videoIndex },
    user: { userId, role },
  } = req;

  // get the course
  const course = await Course.findById(courseId);
  if (!course) {
    throwCustomError(`Could not find a course with ID: ${courseId}`, 404);
  }

  // check for section validity
  if (
    !sectionIndex ||
    sectionIndex >= course.sections.length ||
    sectionIndex < 0
  ) {
    throwCustomError('Invalid Section Index!', 400);
  }

  // check for video validity
  if (
    !videoIndex ||
    videoIndex >= course.sections[sectionIndex].videos.length ||
    videoIndex < 0
  ) {
    throwCustomError('Invalid Video Index!', 400);
  }

  const { isPreview, videoUrl } =
    course.sections[sectionIndex].videos[videoIndex];

  // check for accessibility
  if (!isPreview) {
    // other instructors can't view another's videos
    if (role === 'Instructor' && !course.instructor.equals(userId)) {
      throwCustomError('Unauthorized access!', 403);
    }

    if (role === 'Student') {
      // check for student enrollment first
      const enrollment = course.enrollments.find((enrollment) =>
        enrollment.studentId.equals(userId)
      );
      if (!enrollment) {
        throwCustomError('You are not enrolled in this course', 403);
      }

      const { courseAvailability, limitedPeriod } = course;
      const { enrollmentDate } = enrollment;

      // check for limited period access
      if (courseAvailability === 'Limited') {
        // parse expiration date from enrollment date and limited period (string)
        const expirationDate = parseExpirationDate(
          limitedPeriod,
          enrollmentDate
        );
        // compare current date with the expiration date
        const currentDate = new Date();
        if (currentDate > expirationDate) {
          // pull the student from course enrollments
          course.enrollments = course.enrollments.filter(
            (enrollment) => !enrollment.studentId.equals(userId)
          );
          await course.save();

          // push the course to student's wishlist
          await User.findByIdAndUpdate(userId, {
            $push: { wishList: courseId },
          });

          // throw an error for response
          throwCustomError(
            'course access has expired! it was automatically moved to your wishlist',
            403
          );
        }
      }
    }
  }

  // we start our video streaming logic!
  const { range } = req.headers;
  if (!range) {
    throwCustomError('Range header is required!', 400);
  }

  // Construct full path for the video
  const videoPath = path.join(__dirname, '..', videoUrl);

  const videoSize = fs.statSync(videoPath).size;

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, '')); // replace all the non-digit characters
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1); // start + CHUNK_SIZE could go past the video end so we use Math.min

  const contentLength = end - start + 1; // to let the browser know how many bytes we're sending back
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4',
  };

  res.writeHead(206, headers); // 206 status is for partial content!

  // Create read stream for requested chunk and pipe it to response
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
};

// use this to update video title and isPreview to set to true or false (for free access without enrolling in the course)
const updateVideoInfo = async (req, res, next) => {
  const {
    params: { courseId, sectionIndex, videoIndex },
    user: { userId },
    body: { videoTitle, isPreview },
  } = req;
  const course = await checkCoursePermissions(courseId, userId);
  if (
    !sectionIndex ||
    sectionIndex >= course.sections.length ||
    sectionIndex < 0
  ) {
    throwCustomError('Invalid Section Index!', 400);
  }
  if (
    !videoIndex ||
    videoIndex >= course.sections[sectionIndex].videos.length ||
    videoIndex < 0
  ) {
    throwCustomError('Invalid Video Index!', 400);
  }
  course.sections[sectionIndex].videos[videoIndex].title = videoTitle;
  course.sections[sectionIndex].videos[videoIndex].isPreview = isPreview;
  await course.save();
  res.status(200).json({
    message: `Video info at index ${videoIndex} of section at index ${sectionIndex} has been updated successfully!`,
    sections: course.sections,
  });
};

const deleteVideo = async (req, res, next) => {
  const {
    params: { courseId, sectionIndex, videoIndex },
    user: { userId },
  } = req;
  const course = await checkCoursePermissions(courseId, userId);
  if (
    !sectionIndex ||
    sectionIndex >= course.sections.length ||
    sectionIndex < 0
  ) {
    throwCustomError('Invalid Section Index!', 400);
  }
  if (
    !videoIndex ||
    videoIndex >= course.sections[sectionIndex].videos.length ||
    videoIndex < 0
  ) {
    throwCustomError('Invalid Video Index!', 400);
  }
  // Extract the video url from the database
  const { videoUrl } = course.sections[sectionIndex].videos[videoIndex];
  // Construct the full path
  const videoPath = path.join(__dirname, '..', videoUrl);
  // Delete the file from server directory
  fs.unlinkSync(videoPath);
  // Remove the video object from array and save to db
  course.sections[sectionIndex].videos.splice(videoIndex, 1);
  await course.save();
  res.status(200).json({
    message: `Video at index ${videoIndex} in Section at index ${sectionIndex} has been deleted successfully!`,
    sections: course.sections,
  });
};

// old approach using stand-alone endpoints for file upload

// const uploadCourseImage = async (req, res, next) => {
//   if (!req.files) {
//     throwCustomError('No file uploaded', 400);
//   }

//   const { courseImage } = req.files;
//   if (!courseImage.mimetype.startsWith('image')) {
//     throwCustomError('Please upload an image', 400);
//   }

//   const maxSize = 1024 * 1024 * 5; // 5MB
//   if (courseImage.size > maxSize) {
//     throwCustomError('Please upload an image smaller than 5MB', 400);
//   }

//   const imageName = uuidv4() + '-' + courseImage.name;
//   await courseImage.mv(
//     path.join(__dirname, '..', 'public', 'images', imageName)
//   );

//   res.status(200).json({ imageUrl: `images/${imageName}` });
// };

// const uploadCourseVideo = async (req, res, next) => {
//   if (!req.files) {
//     throwCustomError('No file uploaded', 400);
//   }

//   const { courseVideo } = req.files;
//   if (!courseVideo.mimetype !==  'video/mp4') {
//     throwCustomError('Please upload a video in mp4 format', 400);
//   }

//   const maxSize = 1024 * 1024 * 100; // 100MB
//   if (courseVideo.size > maxSize) {
//     throwCustomError('Please upload an image smaller than 100MB', 400);
//   }

//   // before moving the video, use ffmpeg to extract duration and check for resolution

//   const videoName = uuidv4() + '-' + courseVideo.name;
//   await courseVideo.mv(
//     path.join(__dirname, '..', 'public', 'videos', videoName)
//   );

//   res.status(200).json({ videoUrl: `videos/${videoName}` });
// };

module.exports = {
  getAllCourses,
  createCourse,
  getTopRatedCourses,
  searchCourses,
  getCurrentUserCourses,
  getSingleCourse,
  updateCourse,
  enrollInCourse,
  getCourseEnrollments,
  addSectionToCourse,
  updateSectionTitle,
  deleteSectionFromCourse,
  addVideoToSection,
  getVideo,
  updateVideoInfo,
  deleteVideo,
  // uploadCourseImage,
  // uploadCourseVideo,
};
