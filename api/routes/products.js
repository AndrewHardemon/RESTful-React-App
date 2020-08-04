//Products Module
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

//Storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/'); //callback
  },
  filename: function( req, file, cb){
    cb(null, new Date().toISOString()
      .replace(/:|\./g,'') + '-' + file.originalname);
  }
});
//Filters
const fileFilter = (req, file, cb) => {
  if(file.mimetype === "image/jpeg" || 
     file.mimetype ==='image/png'){
    cb(null, true);   //accept file
  } else {
    //Will need to display this later on in the front end
    cb(new Error('Not accepted file type'), false); //reject file
  }
}

//Use storage with multer
const upload = multer({
  storage: storage,
  limits: {
    filesize: 1024 * 1024 * 6 //only takes <6gb images
  },
  fileFilter: fileFilter
});

//Mongoose Model Object
const Product = require('../models/product');

//Error Handle Function
function errorHandle(res, err) {
  res.status(500).json({
    error: err
  });
}

//OPTIONAL
/*make routing file for all images coming to /uploads
if I need to make the images hidden from the browser*/

//GET
router.get('/', (req, res, next) => {
  Product.find() //find all
    .select('name price _id productImage') //only get these for response
    .exec() //promise
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            request: {
              type: 'GET',
              description: 'Where to get this product',
              url: 'http://localhost:3000/products/' + doc._id
            }
          }
        })
      }
      // (doc.length >= 0) ? 200 ? 404 //optional
      res.status(200).json(response);
    })
    .catch(err => errorHandle(res, err));
});

//POST (added upload middleware)
router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
  console.log(req.file);
  //Create product in Mongo with Mongoose
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product
    .save() //saves the product using mongoose 
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product succesfully",
        createdProduct: {
          name: result.name,
          price: result.price, 
          _id: result._id,
          productImage: result.productImage,
          request: {
            type: 'POST',
            description: 'Where to get the new product',
            url: 'http://localhost:3000/products/' + result._id
          }
        }
      });
    })
    .catch(err => errorHandle(res, err));
});

//GET/:id
router.get('/:productId', (req, res, next) => {
  //const id = req.params.productId;
  //Use findById to get the product
  Product.findById(req.params.productId)
    .select('name price _id productImage') //only get these for response
    .exec() //creates promise
    .then(doc => {
      //Terenary Statement for if we found the product or not
      doc ? res.status(200).json({
        product: doc,
        request: {
          type: 'GET',
          description: 'Get all products',
          url: 'http://localhost:3000/products/'
        }
      }) : res.status(404)
        .json({message: 'No valid entry for provided ID'})
    })
    .catch(err => errorHandle(res, err));
});

//PATCH/:id
router.patch('/:productId', checkAuth, (req, res, next) => {
  const updateOps = {};
  //Run through req.body to find name and value pairs for $set
  for (const ops of req.body) { //uses object inside of array
    updateOps[ops.propName] = ops.value;
  }
  Product.update({_id: req.params.productId}, {$set: updateOps})
    .exec() //creates promise
    .then( (/*result*/) => {
      res.status(200).json({
        message: `Product updated`,
        request: {
          type: 'GET',
          description: 'Get this product',
          url: 'http://localhost:3000/products/' + req.params.productId
        }
      });
    })
    .catch(err => errorHandle(res, err));
});

//DELETE/:id
router.delete('/:productId', checkAuth, (req, res, next) => {
  Product.deleteOne({_id: req.params.productId})
    .exec()
    .then((/*result*/) => {
      res.status(200).json({
        message: 'Product deleted',
        request: {
          type: 'DELETE',
          description: 'Create new product',
          body: { name: "String", price: "Number"},
          url: 'http://localhost:3000/products/'
        }
      });
    })
    .catch(err => errorHandle(res, err));
});

module.exports = router