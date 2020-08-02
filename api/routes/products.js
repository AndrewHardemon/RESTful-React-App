//Products Module
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

//GET
router.get('/', (req, res, next) => {
  Product.find() //find all
    .exec() //promise
    .then(docs => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
});

//POST
router.post('/', (req, res, next) => {
  //Create product in Mongo with Mongoose
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product
    .save() //saves the product using mongoose 
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Handling GET request to /products",
        createdProduct: product
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err})
    })
});

//GET/:id
router.get('/:productId', (req, res, next) => {
  //const id = req.params.productId;
  //Use findById to get the product
  Product.findById(req.params.productId)
    .exec() //creates promise
    .then(doc => {
      console.log("From database",doc);
      //doc ? res.status(200).json(doc) : res.status(404).json({message: 'No valid entry for provided ID'})
      if (doc) { res.status(200).json(doc) } //if found
      else { res.status(404).json({message: 'No valid entry for provided ID'}) } //if not found
      res.status(200).json(doc);
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err})
    });
});

//PATCH/:id
router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
    message: "Updated product!"
  });
});

//DELETE/:id
router.delete('/:productId', (req, res, next) => {
  Product.remove({_id: req.params.productId})
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error:err
      });
    });
});

module.exports = router