//Dependencies
const express = require('express');
const router = express.Router();
//Middleware
const checkAuth = require('../middleware/check-auth');
//Models
const User = require('../models/user');
//Controllers
const usersController = require('../controllers/usersController');


/*All User Routes*/
//Signup User
router.post('/signup', usersController.user_signup);
//Log-in User
router.post('/login', usersController.user_login)
//Delete User
router.delete('/:userId', checkAuth, usersController.user_delete)

//Module Exports
module.exports = router;