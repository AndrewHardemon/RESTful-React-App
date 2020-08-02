//Products Module
const express = require('express');
const router = express.Router();

//GET
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: "Handling GET request to /products"
  });
});

//POST
router.post('/', (req, res, next) => {
  res.status(201).json({
    message: "Handling GET request to /products"
  });
});

//GET/:id
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
  };
});

//PATCH/:id
router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
    message: "Updated product!"
  })
});

//PATCH/:id
router.delete('/:productId', (req, res, next) => {
  res.status(200).json({
    message: "Deleted product!"
  })
});

module.exports = router