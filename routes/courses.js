const express = require('express');
const coursesRouter = express.Router({ mergeParams: true});
const { getCourse, getCourses, addCourse, updateCourse, deleteCourse } = require('../controllers/courses');
const { deleteMany } = require('../models/Bootcamp');

//create routes

coursesRouter.route('/')
    .get(getCourses)
    .post(addCourse);

coursesRouter.route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse);    

module.exports = coursesRouter;