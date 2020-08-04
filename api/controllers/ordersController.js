//Dependencies
const mongoose = require('mongoose');
//Models
const Order = require('../models/order');
const Product = require('../models/product');


//Error Handle Function
const error_handle = (res, err) => {
  res.status(500).json({
    error: err
  });
};

//GET ALL
exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        order: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              description: 'Where to get this product',
              url: 'http://localhost:3000/orders/' + doc._id
            }
          }
        })
      })
    })
    .catch(err => error_handle(res, err))
};

//POST
exports.orders_post = (req, res, next) => {
  //Check to see if product exists
  Product.findById(req.body.productId)
    .then(product => {
      if(!product){
        return res.status(404).json({
          message: 'Product not found'
        });
      };
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
      })
      //Saving the new order. Saves gives real promise. No exec
      return order.save();
    })//after saving order then
    .then(result => {
      // console.log(result);
      res.status(201).json({
        message: 'Order stored',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: 'POST',
          description: 'Where to get this product',
          url: 'http://localhost:3000/orders/' + result._id
        }
      })
    })
    .catch(err => error_handle(res, err));
};

//GET BY ID
exports.orders_get_by_id = (req, res, next) => {
  Order.findById(req.params.orderId)
    .exec()
    .then(order => {
      if(!order) {
        return res.status(404).json({
          message: 'Order not found'
        })
      }
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          description: 'See all orders here',
          url: 'http://localhost:3000/orders/'
        }
      })
    })
    .catch(err => error_handle(res, err));
};

exports.orders_delete = (req, res, next) => {
  Order.deleteOne({_id: req.params.orderId})
    .exec()
    .then(result =>{
      res.status(200).json({
        message: `Order ${req.params.orderId} deleted`,
        request: {
          type: 'DELETE',
          description: 'Create new order',
          body: { productId: 'String', quantity: 'Number'},
          url: 'http://localhost:3000/orders/'
        }
      })
    })
    .catch(err => error_handle(res, err));
};