//Users module
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//dotenv replacement
const yenv = require('yenv');
const env = yenv('env.yaml');


const User = require('../models/user');

//Error Handle Function
function errorHandle(res, err) {
  res.status(500).json({
    error: err
  });
}

//Signup User
router.post('/signup', (req, res, next) => {
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
              .catch(err => errorHandle(res, err))
          }
        });
      };
    });
});

//Log-in User
router.post('/login', (req, res, next) => {
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
    .catch(err => errorHandle(res, err))
})


//Delete User
router.delete('/:userId', (req, res, next) => {
  User.deleteOne({ _id: req.params.userId})
    .exec()
    .then((/*result*/) => {
      res.status(200).json({
        message: 'User deleted'
      })
    })
    .catch(err => errorHandle(res, err))
})


module.exports = router;