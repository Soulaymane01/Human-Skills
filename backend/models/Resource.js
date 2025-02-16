const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  downloadables: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String },
    size: { type: String },
    url: { type: String, required: true }
  }],
  books: [{
    title: { type: String, required: true },
    author: { type: String },
    description: { type: String, required: true },
    image: { type: String },
    url: { type: String, required: true }
  }],
  external: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    url: { type: String, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
