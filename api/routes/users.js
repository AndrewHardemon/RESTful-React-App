//Users module
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//later npm uninstall normal C++ bcrypt

const User = require('../models/user');

//Error Handle Function
function errorHandle(res, err) {
  res.status(500).json({
    error: err
  });
}

//Signup
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