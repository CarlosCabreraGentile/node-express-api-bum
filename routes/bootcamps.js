const express = require('express');
const bootcampsRouter = express.Router();
const bootcampCtrl = require('../controllers/bootcamps');

//create routes

bootcampsRouter.route('/radius/:zipcode/:distance')
    .get(bootcampCtrl.getBootcampsInRadius);

bootcampsRouter.route('/')
    .get(bootcampCtrl.getBootcamps)
    .post(bootcampCtrl.createBootcamp);

bootcampsRouter.route('/:id')
    .get(bootcampCtrl.getBootcamp)
    .put(bootcampCtrl.updateBootcamp)
    .delete(bootcampCtrl.deleteBootcamp);

module.exports = bootcampsRouter;