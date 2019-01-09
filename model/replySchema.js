const mongoose = require("mongoose");

const replySchma = new mongoose.Schema({
  reply_owner: { type: Object, required: true },
  text: { type: String, required: true },
  likes: { type: Number },
  date: { type: Date, default: Date.now },
  likedBy: { type: Array, items: Object },
  reports: { type: Number }
});

const Reply = mongoose.model("Reply", replySchma);

exports.Reply = Reply;
