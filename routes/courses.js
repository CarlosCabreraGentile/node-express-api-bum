const express = require('express');
const coursesRouter = express.Router({ mergeParams: true});
const { getCourse, getCourses, addCourse } = require('../controllers/courses');

//create routes

coursesRouter.route('/')
    .get(getCourses)
    .post(addCourse);

coursesRouter.route('/:id')
    .get(getCourse);    

module.exports = coursesRouter;