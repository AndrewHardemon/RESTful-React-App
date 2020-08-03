const express = require("express");
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')
const mongoose = require('mongoose');
const yenv = require('yenv')
const env = yenv('env.yaml')

//Getting the routes form our api/routes folder
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

//Connect to monngodb atlas or local mongodb using mongoose
mongoose.connect(env.ATLAS_URI 
  || "mongodb://localhost/restful-react",
  { useNewUrlParser: true, useUnifiedTopology: true })

//Get rip of Deprecation warning
mongoose.Promise = global.Promise; //might be redundant

//Middleware
app.use(morgan('dev')); //logger
app.use('/uploads', express.static('uploads')); //public uploads
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); //adds body property to requests
// app.use(cors()); //backup for cors

// //Middleware for preventing CORS errors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); //can replace * with any specific host
  res.header('Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if(req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); //add all requests used by api
    return res.status(200).json({});
  }
  next();
});

//Routes for handleling routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

//Handle requests that don't hit the routes
app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404 //returns status 404
  next(err); //forwards the error request
});

//Catch all thrown errors (change err to error if issues arise)
app.use((err, req, res, next) => {
  res.status(err.status || 500) //500 for other errors
  res.json({
    error: {
      message: err.message
    }
  })
});

module.exports = app;
