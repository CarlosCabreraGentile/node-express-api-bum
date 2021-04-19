const express = require('express');
const coursesRouter = express.Router({ mergeParams: true});
const courseCtrl = require('../controllers/courses');

//create routes

coursesRouter.route('/')
    .get(courseCtrl.getCourses);

module.exports = coursesRouter;