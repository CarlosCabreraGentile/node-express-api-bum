/**
 * @description Get all Bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
let getBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Get all bootcamps' });
}

/**
 * @description Get one Bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
let getBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Get bootcamp ${req.params.id}` });
}

/**
 * @description Create Bootcamp
 * @route POST /api/v1/bootcamps/
 * @access Private
 */
let createBootcamp = (req, res, next) => {
    res.status(201).json({ success: true, msg: 'Create new bootcamp' });
}

/**
 * @description Update Bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access Private
 */
let updateBootcamp = (req, res, next) => {
    res.status(201).json({ success: true, msg: `Update bootcamp ${req.params.id}` });
}

/**
 * @description Delete Bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
 */
let deleteBootcamp = (req, res, next) => {
    res.status(201).json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
}

module.exports = {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp
}