const express = require('express');
const coursesRouter = express.Router({ mergeParams: true});
const { getCourse, getCourses, addCourse, updateCourse, deleteCourse } = require('../controllers/courses');
const Course = require('../models/Course');
const advancedResults = require('../middleware/advanceResults');

//create routes

// With populate we can return not just the bootcamp id
// but also i.e the name and description or any field we want
coursesRouter.route('/')
    .get(advancedResults(Course, {
        path: 'bootcamp',
        select: 'name description',
      }), getCourses)
    .post(addCourse);

coursesRouter.route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse);    

module.exports = coursesRouter;