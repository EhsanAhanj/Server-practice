const mongoose = require("mongoose");
const commentSchema = require("./commentSchema");
const Joi = require("joi");

const commentBoxSchema = new mongoose.Schema({
  downOf: { type: mongoose.Schema.Types.ObjectId, required: true },
  commentCount: Number,
  comments: { type: Array, items: commentSchema },
  dekorComent: { type: Array, maxlength: 3, items: commentSchema },
  canComment: { type: Boolean, default: true }
});

const CommentBox = mongoose.model("CommentBox", commentBoxSchema);

exports.CommentBox = CommentBox;
