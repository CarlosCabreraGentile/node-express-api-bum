const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');

/**
 * @description Get all Bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
let getBootcamps = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude, dont want to match as a field
  const removeFields = ['select', 'sort'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Manipulate query string and add operator
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  // { averageCost: { gte: '1000' }, 'location.city': 'Boston' }
  // { averageCost: { $gte: '1000' }, 'location.city': 'Boston' }

  // Finding resource
  query = Bootcamp.find(JSON.parse(queryStr));

  // Select Fields
  if(req.query.select){
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields); // get only the fields from query parameters i.e name, description
  }

  // Sort
  if(req.query.sort){
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy); // sort by specific parameter
  } else{ //default value createdAt 
    query = query.sort('-createdAt');
  }
  
  // Execute query
  const bootcamps = await query;
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
// Refactor version
let deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: bootcamp });
});

//Old Version
// let deleteBootcamp = async (req, res, next) => {
//     try {
//       const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  
//       if (!bootcamp) {
//         //only can return one thing so that the return
//         //OPTION 1
//         // return res.status(400).json({ success: false });
//         //OPTION 2
//         return next(
//           new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404)
//         );
//       }
  
//       res.status(200).json({ success: true, data: bootcamp });
//     } catch (err) {
//       //OPTION 1
//       // res.status(400).json({
//       //     success: false,
//       //     msg: err,
//       // });
//       //OPTION 2
//       next(err);
//     }
//   };

/**
 * @description Get bootcamps within a radius
 * @route GET /api/v1/bootcamps/radius/:zipcode/:distance
 * @access Private
 */
// Refactor version
let getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calculate radius using radians
  // Divide distance by radius of earth
  // Earth radius = 3.963mi / 6.378km
  const radius = distance / 3963;
  
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

module.exports = {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius
};
