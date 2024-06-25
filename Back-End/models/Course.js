const { Schema, model } = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Review = require('./Review');

// Define a schema for Video
const videoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  formattedDuration: {
    type: String,
    required: true,
  },
  isPreview: {
    type: Boolean,
    default: false,
  },
  videoUrl: {
    type: String,
    required: true,
  },
});

// Define a schema for Section
const sectionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  videos: [videoSchema],
});

// Define a schema for Course
const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    education: {
      type: String,
      required: true,
      enum: {
        values: ['General', 'Special', 'Graduated'], // Graduated = skills
        message: '{VALUE} is not supported',
      },
    },
    stage: {
      type: String,
      enum: {
        values: ['Primary stage', 'Middle school', 'High school', 'University'],
        message: '{VALUE} is not supported',
      },
    },
    level: {
      type: String,
      enum: {
        values: ['Level one', 'Level two', 'Level three'],
        message: '{VALUE} is not supported',
      },
    },
    language: {
      type: String,
      required: true,
      enum: {
        values: ['Arabic', 'English'],
        message: '{VALUE} is not supported',
      },
    },
    term: {
      type: String,
      enum: {
        values: ['First term', 'Second term'],
        message: '{VALUE} is not supported',
      },
    },
    subject: String,
    courseAvailability: {
      type: String,
      required: true,
      enum: {
        values: ['Limited', 'Unlimited'],
        message: '{VALUE} is not supported',
      },
    },
    limitedPeriod: {
      type: String,
      enum: {
        values: [
          'A week',
          '2 weeks',
          'Month',
          '2 month',
          '4 month',
          '6 month',
          '8 month',
          '10 month',
          'Year',
        ],
        message: '{VALUE} is not supported',
      },
    },
    keywords: [
      {
        type: String,
        // required: true
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    imageUrl: { type: String, required: true },
    sections: [sectionSchema],
    avgRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    enrollments: [
      {
        studentId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        enrollmentDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    // these are essential for the virtual to work!
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

courseSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'course',
  justOne: false, // because we want a list!
});

// we reach out to Review model and delete reviews associated with the course
// before it gets deleted so a pre-deleteOne hook
courseSchema.pre('deleteOne', { document: true }, async function () {
  await Review.deleteMany({ course: this._id });
});

courseSchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
});

module.exports = model('Course', courseSchema);
