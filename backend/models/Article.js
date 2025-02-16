const mongoose = require("mongoose");

// Article Schema
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  category: { type: String, required: true },
  readTime: { type: String, required: true },
  image: { type: String, required: true },
  author: {
    name: { type: String, required: true },
    image: { type: String, required: true }
  },
  slug: { 
    type: String, 
    required: false, 
    unique: true,
    validate: {
      validator: function(v) {
        return /^[a-z0-9-]+$/.test(v);
      },
      message: props => `${props.value} is not a valid slug!`
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', articleSchema);