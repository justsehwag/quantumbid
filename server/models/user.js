const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      minLength: 3,
      maxLength: 32,
      trim: true,
    },
    avatar: {
      type: String,
      default: process.env.DEFAULT_AVATAR,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please provide an email'],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, 'Please provide a mobile number'],
      minLength: 10,
      maxLength: 10,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Enter valid date of birth!'],
    },
    password: {
      type: String,
      required: [true, 'Password can not be empty!'],
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const SALT = process.env.SALT;

  const salt = await bcryptjs.genSalt(parseInt(SALT));
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

userSchema.methods.generateAuthToken = function () {
  const SECRET = process.env.SECRET;
  const payload = {
    id: this._id,
    name: this.name,
    email: this.email,
  };
  const token = jwt.sign(payload, SECRET);

  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
