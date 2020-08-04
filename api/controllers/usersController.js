//Dependencies
const mongoose = require('mongoose');
//Hash and Token
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//Dotenv Alternative
const yenv = require('yenv');
const env = yenv('env.yaml');
//Models
const User = require('../models/user');

//Error Handle Function
const error_handle = (res, err) => {
  res.status(500).json({
    error: err
  });
};

//Sign-up User
exports.user_signup = (req, res, next) => {
  User.find({email: req.body.email})
    .exec()
    .then(user => {
      if (user.length >= 1) {//if user exists
        return res.status(409).json({
          message: 'Email already has been used'
        })
      } else {//if doesn't hash password
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if(err){
            return res.status(500).json({
              error: err
            });
          } else {//if hash works make user
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user.save()//save user
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: 'User created'
                })
              })//catch error
              .catch(err => error_handle(res, err))
          }
        });
      };
    });
};

//Log-in User
exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email})
    .exec()
    .then(user => { //check if email exists
      if(user.length < 1){
        return res.status(401).json({
          message: 'Auth failed'//vague to avoid brute force
        });
      }//Check if password matches
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {//if it failed for odd reason
          return res.status(401).json({
            message: 'Auth failed'
          });
        }
        if (result){//if it was correct create web token
          const token = jwt.sign({
            email: user[0].email,
            userId: user[0]._id
          },
            env.JWT,
            { expiresIn: "1h" }
          )
          return res.status(200).json({
            message: 'Auth successful',
            token: token
          })
        }
        res.status(401).json({ //If incorrect
          message: 'Auth failed'
        });
      });
    })
    .catch(err => error_handle(res, err))
};

/* Need to check if user exists before deleting, then
only let admins and the user themself have the ability
to delete their account. Also need to add levels of
authorization */

//Delete User 
exports.user_delete = (req, res, next) => {
  User.deleteOne({ _id: req.params.userId}) 
    .exec()
    .then((/*result*/) => {
      res.status(200).json({
        message: 'User deleted' //No ID shown for now. Only to console
      })
    })
    .catch(err => error_handle(res, err))
};