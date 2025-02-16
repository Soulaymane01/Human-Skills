const express = require('express');
const Technique = require('../models/Technique'); // Import the Technique model
const router = express.Router();

// 📌 Get all techniques
router.get('/', async (req, res) => {
  try {
    const techniques = await Technique.find();
    console.log(techniques)
    res.json(techniques);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/slug/:slug', async (req, res) => {
  try {
    const category = await Technique.aggregate([
      { $unwind: "$techniques" },
      { $match: { "techniques.slug": req.params.slug } },
      { 
        $replaceRoot: { 
          newRoot: { $mergeObjects: ["$techniques", { category: "$category" }] } 
        } 
      }
    ]);
    if (!category.length) {
      return res.status(404).json({ message: 'Technique not found' });
    }
    res.json(category[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 📌 Create a new technique
router.post('/', async (req, res) => {
  try {
    const newTechnique = new Technique(req.body);
    const savedTechnique = await newTechnique.save();
    res.status(201).json(savedTechnique);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 Delete a technique
router.delete('/:id', async (req, res) => {
  try {
    await Technique.findByIdAndDelete(req.params.id);
    res.json({ message: 'Technique deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
