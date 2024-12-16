const express = require('express');
const Category = require('../models/Catagory');
const authMiddleware = require('../middleware/authMiddlewre');
const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// Add a new category
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied.');
  const newCategory = new Category(req.body);
  await newCategory.save();
  res.status(201).json(newCategory);
});

// Update category details
router.put('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied.');
  const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedCategory);
});

// Delete a category
router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied.');
  await Category.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;