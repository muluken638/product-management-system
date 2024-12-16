const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  const products = await Product.find().populate('category');
  res.json(products);
});

// Add a new product
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'manager' && req.user.role !== 'admin') return res.status(403).send('Access denied.');
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.status(201).json(newProduct);
});

// Update product details
router.put('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'manager' && req.user.role !== 'admin') return res.status(403).send('Access denied.');
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedProduct);
});

// Delete a product
router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'manager' && req.user.role !== 'admin') return res.status(403).send('Access denied.');
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;