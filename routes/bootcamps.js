const express = require('express');
const bootcampsRouter = express.Router();
const bootcampCtrl = require('../controllers/bootcamps');
// Include other resource routers
const courseRouter = require('./courses');
const advancedResults = require('../middleware/advanceResults');
const { protect, authorize } = require('../middleware/auth');
const Bootcamp = require('../models/Bootcamp');

// Re-route into other resource routers
bootcampsRouter.use('/:bootcampId/courses', courseRouter);

//create routes
bootcampsRouter.route('/radius/:zipcode/:distance')
    .get(bootcampCtrl.getBootcampsInRadius);

bootcampsRouter.route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), bootcampCtrl.bootcampPhotoUpload);    

bootcampsRouter.route('/')
    .get(advancedResults(Bootcamp, 'courses'), bootcampCtrl.getBootcamps)
    .post(protect, authorize('publisher', 'admin'), bootcampCtrl.createBootcamp);

bootcampsRouter.route('/:id')
    .get(bootcampCtrl.getBootcamp)
    .put(protect, authorize('publisher', 'admin'), bootcampCtrl.updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), bootcampCtrl.deleteBootcamp);

module.exports = bootcampsRouter;