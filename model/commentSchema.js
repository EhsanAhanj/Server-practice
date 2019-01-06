const mongoose = require("mongoose");
const replySchema = require("./replySchema");

const commentSchema = new mongoose.Schema({
  comment_owner: { type: Object, required: true },
  text: { type: String, required: true },
  liks: { type: Number },
  replyCount: { type: Number },
  replys: { type: replySchema },
  reports: { type: Number }
});

exports.commentSchema = commentSchema;
