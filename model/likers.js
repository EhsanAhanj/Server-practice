const mongoose = require("mongoose");

const likersSchema = new mongoose.Schema({
  downOf: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "onModel",
    required: true
  },
  onModel: {
    type: String,
    enum: ["Tour", "Product", "Post", "Adventure"],
    required: true
  },
  likes: { type: Number, min: 0, default: 0 },
  likedBy: { type: Array, items: Object }
});

const Likers = mongoose.model("Likers", likersSchema);

module.exports.Likers = Likers;
