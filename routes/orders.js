const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Place a new order
router.post('/', authMiddleware, async (req, res) => {
  const newOrder = new Order({ userId: req.user.id, ...req.body });
  await newOrder.save();
  res.status(201).json(newOrder);
});

// Get all orders (Admin/Manager)
router.get('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') return res.status(403).send('Access denied.');
  const orders = await Order.find().populate('userId').populate('products.productId');
  res.json(orders);
});

// Get a specific order (Admin/Manager)
router.get('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') return res.status(403).send('Access denied.');
  const order = await Order.findById(req.params.id).populate('userId').populate('products.productId');
  res.json(order);
});

module.exports = router;