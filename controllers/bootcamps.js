const Bootcamp = require('../models/Bootcamp');

/**
 * @description Get all Bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
let getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({ success: true, data: bootcamps });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: err,
        });
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
            res.status(400).json({
                success: false
            });
        }

        res.status(200).json({ success: true, data: bootcamp });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: err,
        });
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
            res.status(201).json({
                success: true,
                data: data,
            });
        })
        .catch((err) => {
            res.status(400).json({
                success: false,
                msg: err,
            });
        });
};

/**
 * @description Update Bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access Private
 */
let updateBootcamp = (req, res, next) => {
    res
        .status(201)
        .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
};

/**
 * @description Delete Bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
 */
let deleteBootcamp = (req, res, next) => {
    res
        .status(201)
        .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};

module.exports = {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
};
