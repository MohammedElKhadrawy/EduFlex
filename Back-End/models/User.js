const { Schema, model } = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // technically, this isn't a validator..this is just checking for the index
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: {
        values: ['Admin', 'Instructor', 'Student'],
        message: '{VALUE} is not supported',
      },
      required: true,
    },
    profilePicture: {
      type: String,
      default: 'images/default-profile-picture.jpg',
    },
    education: {
      type: String,
      enum: {
        values: ['General', 'Special', 'Graduated'],
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
    nationalID: String,
    wishList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpiration: Date,
    resetPwOtp: String,
    resetPwOtpExpiration: Date,
  },
  {
    timestamps: true,
  }
);

// reserve the 'this' keyword by using 'function' instead of arrow-function
userSchema.pre('save', async function () {
  // we don't want to re-hash existing password if it wasn't updated.
  if (!this.isModified('password')) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.checkPassword = async function (enteredPassword) {
  const doesMatch = await bcrypt.compare(enteredPassword, this.password);
  return doesMatch;
};

userSchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
});

module.exports = model('User', userSchema);
