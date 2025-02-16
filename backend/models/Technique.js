const mongoose = require("mongoose");

// Technique Schema
const techniqueSchema = new mongoose.Schema({
  category: { type: String, required: true },
  icon: { type: String, required: true }, // Assuming the icon will be stored as a string reference
  techniques: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
      timeNeeded: { type: String, required: true },
      content: { type:String, required: false},
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
    }
  ]
});


module.exports = mongoose.model('Technique', techniqueSchema);