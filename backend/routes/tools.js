const express = require('express');
const Tool = require('../models/Tool'); // Import the Tool model
const router = express.Router();

// 📌 Get all tools
router.get('/', async (req, res) => {
  try {
    const tools = await Tool.find();
    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/slug/:slug', async (req, res) => {
  try {
    const tool = await Tool.findOne({ slug: req.params.slug });
    if (!tool) return res.status(404).json({ message: 'Tool not found' });
    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 📌 Create a new tool
router.post('/', async (req, res) => {
  try {
    const newTool = new Tool(req.body);
    const savedTool = await newTool.save();
    res.status(201).json(savedTool);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 Delete a tool
router.delete('/:id', async (req, res) => {
  try {
    await Tool.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tool deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
