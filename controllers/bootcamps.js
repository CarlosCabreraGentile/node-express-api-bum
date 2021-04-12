const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');

/**
 * @description Get all Bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
let getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
    } catch (err) {
        //OPTION 1
        // res.status(400).json({
        //     success: false,
        //     msg: err,
        // });
        //OPTION 2
        next(err);
    }
};

/**
 * @description Get one Bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
let getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            //only can return one thing so that the return
            return next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404));
        }

        res.status(200).json({ success: true, data: bootcamp });
    } catch (err) {
        //OPTION 1
        // res.status(400).json({
        //     success: false,
        //     msg: `Bootcamp not found with id: ${req.params.id}`,
        // });
        //OPTION 2
        next(err);
    }
};

/**
 * @description Create Bootcamp
 * @route POST /api/v1/bootcamps/
 * @access Private
 */
let createBootcamp = (req, res, next) => {
    Bootcamp.create(req.body)
        .then((data) => {
            res.status(201).json({ success: true, data: data });
        })
        .catch((err) => {
            //OPTION 1
            // res.status(400).json({
            //     success: false,
            //     msg: err,
            // });
            //OPTION 2
            next(err);
        });
};

/**
 * @description Update Bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access Private
 */
let updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!bootcamp) {
            //only can return one thing so that the return
            //OPTION 1
            // return res.status(400).json({
            //     success: false,
            // });
            //OPTION 2
            return next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404));
        }

        res.status(200).json({ success: true, data: bootcamp });
    } catch (err) {
        //OPTION 1
        // res.status(400).json({
        //     success: false,
        //     msg: err,
        // });
        //OPTION 2
        next(err);
    }
};

/**
 * @description Delete Bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
 */
let deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        if (!bootcamp) {
            //only can return one thing so that the return
            //OPTION 1
            // return res.status(400).json({ success: false });
            //OPTION 2
            return next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404));
        }

        res.status(200).json({ success: true, data: bootcamp });
    } catch (err) {
        //OPTION 1
        // res.status(400).json({
        //     success: false,
        //     msg: err,
        // });
        //OPTION 2
        next(err);
    }
};

module.exports = {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
};
