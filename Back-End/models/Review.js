const { Schema, model } = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    title: String, // optional
    comment: {
      type: String,
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// this is called a compound index that ties 2 fields/properties together
// - marking each of them separately as unique won't work -
reviewSchema.index({ course: 1, user: 1 }, { unique: true });

reviewSchema.statics.calculateCourseStats = async function (courseId) {
  const result = await this.aggregate([
    { $match: { course: courseId } },
    {
      $group: {
        _id: '$course', // we can go with null, when our data is simple and associated with the only one course!
        avgRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model('Course').findByIdAndUpdate(courseId, {
      avgRating: +result[0]?.avgRating.toFixed(1) || 0,
      numOfReviews: result[0]?.numOfReviews || 0,
    });
  } catch (error) {
    console.log(error);
  }
};

// we use 'post' hook so we are assured that the saving/deleting was successful
reviewSchema.post('save', async function () {
  await this.constructor.calculateCourseStats(this.course);
});

reviewSchema.post('deleteOne', { document: true }, async function () {
  await this.constructor.calculateCourseStats(this.course);
});

reviewSchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
});

module.exports = model('Review', reviewSchema);
