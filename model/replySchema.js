const mongoose = require("mongoose");

const replySchma = new mongoose.Schema({
  reply_owner: { type: Object, required: true },
  text: { type: String, required: true },
  replyOf: { type: String, required: true },
  likes: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  likedBy: { type: Array, items: Object },
  reports: { type: Number }
});

const Reply = mongoose.model("Reply", replySchma);

exports.Reply = Reply;
