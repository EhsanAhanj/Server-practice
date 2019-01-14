const { CommentBox } = require("../model/CommentBox");
const ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");
const { Reply } = require("../model/replySchema");

async function handelReplyComment(text, commentBoxId, commentId, embededUser) {
  let reply = new Reply({
    reply_owner: embededUser,
    text,
    replyOf: commentId
  });
  await CommentBox.updateOne(
    {
      _id: commentBoxId,
      "comments._id": ObjectID(commentId)
    },
    {
      $inc: { "comments.$.replyCount": 1 },
      $push: { "comments.$.replys": reply }
    },
    {
      upsert: true,
      new: true
    }
  );

  return "Reply ersal shod";
}

module.exports.handelReplyComment = handelReplyComment;
