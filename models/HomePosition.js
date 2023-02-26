const mongoose = require("mongoose");

const HomePositionSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    enum: [true, false],
    default: true,
  },

  name: {
    type: String,
  },

  newsCategory: {
    type: mongoose.Schema.ObjectId,
    ref: "NewsCategories",
  },

  position: {
    type: Number,
  },

  createAt: {
    type: Date,
    default: Date.now,
  },

  updateAt: {
    type: Date,
    default: Date.now,
  },
  createUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  updateUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("HomePosition", HomePositionSchema);
