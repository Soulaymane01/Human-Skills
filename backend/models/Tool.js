const mongoose = require("mongoose");

// Tool Schema
const toolSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  icon: { type: String, required: true },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v) {
        return /^[a-z0-9-]+$/.test(v);
      },
      message: props => `${props.value} is not a valid slug!`
    }
  },
  component: { 
    type: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tool', toolSchema);