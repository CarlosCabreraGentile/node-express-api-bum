const express = require('express');
const bootcampsRouter = express.Router();
const bootcampCtrl = require('../controllers/bootcamps');
// Include other resource routers
const courseRouter = require('./courses');

// Re-route into other resource routers
bootcampsRouter.use('/:bootcampId/courses', courseRouter);

//create routes
bootcampsRouter.route('/radius/:zipcode/:distance')
    .get(bootcampCtrl.getBootcampsInRadius);

bootcampsRouter.route('/:id/photo')
    .put(bootcampCtrl.bootcampPhotoUpload);    

bootcampsRouter.route('/')
    .get(bootcampCtrl.getBootcamps)
    .post(bootcampCtrl.createBootcamp);

bootcampsRouter.route('/:id')
    .get(bootcampCtrl.getBootcamp)
    .put(bootcampCtrl.updateBootcamp)
    .delete(bootcampCtrl.deleteBootcamp);

module.exports = bootcampsRouter;