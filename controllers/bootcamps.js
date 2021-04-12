const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');

/**
 * @description Get all Bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
let getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

/**
 * @description Get one Bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
let getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      //only can return one thing so that the return
      return next(
        new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @description Create Bootcamp
 * @route POST /api/v1/bootcamps/
 * @access Private
 */
let createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

      res.status(201).json({ success: true, data: bootcamp });

});

/**
 * @description Update Bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access Private
 */
let updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: bootcamp });

});

/**
 * @description Delete Bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
 */
let deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: bootcamp });
});

module.exports = {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
};
