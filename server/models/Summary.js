const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false // Open mode won't require user
  },
  originalText: {
    type: String,
    required: true
  },  
  summaryText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Summary", summarySchema);