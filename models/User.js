const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret, expire } = require('../config/config');
// const randomize = require('randomatic');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false, // when we get an user from API we dont show password
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
//   confirmEmailToken: String,
//   isEmailConfirmed: {
//     type: Boolean,
//     default: false,
//   },
//   twoFactorCode: String,
//   twoFactorCodeExpire: Date,
//   twoFactorEnable: {
//     type: Boolean,
//     default: false,
//   },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, secret, {
    expiresIn: expire,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // compare the entered password entered, with the password in database
  return await bcrypt.compare(enteredPassword, this.password);
};

// // Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// // Generate email confirm token
// UserSchema.methods.generateEmailConfirmToken = function (next) {
//   // email confirmation token
//   const confirmationToken = crypto.randomBytes(20).toString('hex');

//   this.confirmEmailToken = crypto
//     .createHash('sha256')
//     .update(confirmationToken)
//     .digest('hex');

//   const confirmTokenExtend = crypto.randomBytes(100).toString('hex');
//   const confirmTokenCombined = `${confirmationToken}.${confirmTokenExtend}`;
//   return confirmTokenCombined;
// };

module.exports = mongoose.model('User', UserSchema);