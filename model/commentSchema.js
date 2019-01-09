const mongoose = require("mongoose");
const replySchema = require("./replySchema");

const commentSchema = new mongoose.Schema({
  comment_owner: { type: Object, required: true },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  likedBy: { type: Array, items: Object },
  replyCount: { type: Number },
  replys: { type: Array, items: replySchema },
  reports: { type: Number }
});
const Comment = mongoose.model("Comment", commentSchema);

exports.Comment = Comment;
