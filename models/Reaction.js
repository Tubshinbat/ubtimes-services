const mongoose = require("mongoose");

const ReactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["angry", "love", "maybe", "sad", "wow", "haha"],
  },

  news: {
    type: mongoose.Schema.ObjectId,
    ref: "News",
  },

  count: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Reaction", ReactionSchema);
