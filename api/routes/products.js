//Products Module
const express = require('express');
const router = express.Router();

//implied /products
//GET
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: "Handling GET request to /products"
  });
});

//POST
router.post('/', (req, res, next) => {
  res.status(200).json({
    message: "Handling GET request to /products"
  });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  if( id === 'special') {
    res.status(200).json({
      message: 'You discovered the special ID',
      id: id
    });
  } else {
    res.status(200).json({
      message: 'You passed an ID'
    });
  }
});

module.exports = router