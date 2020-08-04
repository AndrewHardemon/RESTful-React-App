//Dependencies
const express = require('express');
const router = express.Router();
//Middleware
const checkAuth = require('../middleware/check-auth');
//Controller
const OrdersController = require('../controllers/ordersController');


/*All Order Routes*/
//GET ALL
router.get('/', checkAuth, OrdersController.orders_get_all);
//POST
router.post('/', checkAuth, OrdersController.orders_post);
//GET/:id 
router.get('/:orderId', checkAuth, OrdersController.orders_get_by_id);
//DELETE/:id 
router.delete('/:orderId', checkAuth, OrdersController.orders_delete);


//Exports
module.exports = router