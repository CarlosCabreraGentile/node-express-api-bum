const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

const User = require('../models/User');

const usersRouter = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advanceResults');
const { protect, authorize } = require('../middleware/auth'); 

usersRouter.use(protect); // works for all routes, all routes use protect
usersRouter.use(authorize('admin')); // works for all routes, all routes use authorize

usersRouter
  .route('/')
  .get(advancedResults(User), getUsers)
  .post(createUser);

usersRouter
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = usersRouter;