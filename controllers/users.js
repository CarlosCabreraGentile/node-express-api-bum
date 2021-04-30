 
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

/**
 * @description Get all users
 * @route GET /api/v1/users
 * @access Private/Admin
 */
let getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @description Get single user
 * @route GET /api/v1/users/:id
 * @access Private/Admin
 */
let getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @description Create user
 * @route POST /api/v1/users
 * @access Private/Admin
 */
let createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

/**
 * @description Update user
 * @route PUT /api/v1/users/:id
 * @access Private/Admin
 */
let updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @description Delete user
 * @route DELETE /api/v1/users/:id
 * @access Private/Admin
 */
let deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
  };