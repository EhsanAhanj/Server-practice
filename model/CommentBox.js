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

async function generateCommentBox(onModel, owner_id, owner_commentId) {
  const commentBox = new CommentBox({
    _id: owner_commentId,
    downOf: owner_id,
    onModel
  });
  const result = await commentBox.save();
  return result;
}

const CommentBox = mongoose.model("CommentBox", commentBoxSchema);

exports.generateCommentBox = generateCommentBox;
exports.CommentBox = CommentBox;
