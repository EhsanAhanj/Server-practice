const mongoose = require("mongoose");
const commentSchema = require("./commentSchema");

const commentBoxSchema = new mongoose.Schema({
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
  commentCount: { type: Number, default: 0 },
  comments: { type: Array, items: commentSchema },
  dekorComent: { type: Array, maxlength: 3, items: commentSchema },
  canComment: { type: Boolean, default: true }
});

const CommentBox = mongoose.model("CommentBox", commentBoxSchema);

exports.CommentBox = CommentBox;
