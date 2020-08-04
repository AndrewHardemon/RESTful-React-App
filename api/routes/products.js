//Dependencies
const express = require('express');
const router = express.Router();
//Middleware
const multerUpload = require('../middleware/multer-upload');
const checkAuth = require('../middleware/check-auth');
//Controller
const productsController = require('../controllers/productsController');


//OPTIONAL
/*make routing file for all images coming to /uploads
if I need to make the images hidden from the browser*/

/*All Product Routes*/
//GET
router.get('/', productsController.products_get_all);
//POST with Multer Upload middleware
router.post('/', checkAuth, multerUpload.upload.single('productImage'), productsController.products_post);
//GET/:id
router.get('/:productId', productsController.products_get_by_id);
//PATCH/:id
router.patch('/:productId', checkAuth, productsController.products_patch);
//DELETE/:id
router.delete('/:productId', checkAuth, productsController.products_delete);


//Module Exports
module.exports = router