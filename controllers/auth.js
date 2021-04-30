const asyncHandler = require('../middleware/async');
const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendemail');
const User = require('../models/User');
const { expireCookie, nodeEnv } = require('../config/config');

/**
 * @description Register user
 * @route POST /api/v1/auth/register
 * @access Public
 */
let register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  //   // grab token and send to email
  //   const confirmEmailToken = user.generateEmailConfirmToken();

  //   // Create reset url
  //   const confirmEmailURL = `${req.protocol}://${req.get(
  //     'host',
  //   )}/api/v1/auth/confirmemail?token=${confirmEmailToken}`;

  //   const message = `You are receiving this email because you need to confirm your email address. Please make a GET request to: \n\n ${confirmEmailURL}`;

  //   user.save({ validateBeforeSave: false });

  //   const sendResult = await sendEmail({
  //     email: user.email,
  //     subject: 'Email confirmation token',
  //     message,
  //   });

  sendTokenResponse(user, 200, res);
});

/**
 * @description Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
let login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password); // entered password from the body

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// // @desc      Log user out / clear cookie
// // @route     GET /api/v1/auth/logout
// // @access    Public
// exports.logout = asyncHandler(async (req, res, next) => {
//   res.cookie('token', 'none', {
//     expires: new Date(Date.now() + 10 * 1000),
//     httpOnly: true,
//   });

//   res.status(200).json({
//     success: true,
//     data: {},
//   });
// });

/**
 * @description Get current logged in user
 * @route GET /api/v1/auth/me
 * @access Private
 */
let getMe = asyncHandler(async (req, res, next) => {
  // user is already available in req due to the protect middleware
  // const user = req.user;

  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @description Update user details
 * @route PUT /api/v1/auth/updatedetails
 * @access Private
 */
let updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @description Update password
 * @route PUT /api/v1/auth/updatepassword
 * @access Private
 */
let updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password'); // get all user + the password
  console.log('user ----->', user);
  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  
  await user.save();

  sendTokenResponse(user, 200, res);
});

/**
 * @description Forgot password
 * @route POST /api/v1/auth/forgotpassword
 * @access Public
 */
let forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  // using a method not a static, static should be called on the model
  // a method is call on the actual user we are getting
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email, // this email is in the body
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

/**
 * @description Reset password
 * @route PUT /api/v1/auth/resetpassword/:resettoken
 * @access Public
 */
let resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// /**
//  * @desc    Confirm Email
//  * @route   GET /api/v1/auth/confirmemail
//  * @access  Public
//  */
// exports.confirmEmail = asyncHandler(async (req, res, next) => {
//   // grab token from email
//   const { token } = req.query;

//   if (!token) {
//     return next(new ErrorResponse('Invalid Token', 400));
//   }

//   const splitToken = token.split('.')[0];
//   const confirmEmailToken = crypto
//     .createHash('sha256')
//     .update(splitToken)
//     .digest('hex');

//   // get user by token
//   const user = await User.findOne({
//     confirmEmailToken,
//     isEmailConfirmed: false,
//   });

//   if (!user) {
//     return next(new ErrorResponse('Invalid Token', 400));
//   }

//   // update confirmed to true
//   user.confirmEmailToken = undefined;
//   user.isEmailConfirmed = true;

//   // save
//   user.save({ validateBeforeSave: false });

//   // return token
//   sendTokenResponse(user, 200, res);
// });

// // Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token 
  // using a method not a static, static should be called on the model
  // a method is call on the actual user we are getting
  const token = user.getSignedJwtToken();

  const options = {
    // we want expires in 30 days
    expires: new Date(
      Date.now() + expireCookie * 24 * 60 * 60 * 1000, // this gives us 30 days from this time
    ),
    httpOnly: true,
  };

  if (nodeEnv === 'production') {
    options.secure = true; // for https
  }

  res
    .status(statusCode)
    .cookie('token', token, options).json({
    success: true,
    token,
  });
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword
};
