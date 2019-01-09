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

async function generateLikers(onModel, owner_id, owner_likedby) {
  const likers = new Likers({
    _id: owner_likedby,
    downOf: owner_id,
    onModel,
    likedBy: []
  });
  const result = await likers.save();
  return result;
}

module.exports.Likers = Likers;
module.exports.generateLikers = generateLikers;
