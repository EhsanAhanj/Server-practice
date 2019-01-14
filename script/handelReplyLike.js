const { CommentBox } = require("../model/CommentBox");
const ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");
const { Reply } = require("../model/replySchema");

async function handelReplyLike(replayId, commentBoxId, commentId, embededUser) {
  const commentFounded = await CommentBox.find(
    {
      _id: ObjectID(commentBoxId),
      "comments._id": ObjectID(commentId)
    },
    { "comments.$": 1 }
  );

  if (commentFounded.length == 0) return "comment nist ya pak shode";
  const replyFound = commentFounded[0].comments[0].replys.filter(o => {
    if (o._id == replayId) return o;
  });

  if (replyFound.length == 0) return "Reply pak shode";
  const isLiked = replyFound[0].likedBy.filter(o => {
    if (o._id == embededUser._id) return o;
  });

  if (isLiked.length == 0) {
    await CommentBox.findOneAndUpdate(
      {
        _id: commentBoxId,
        "comments._id": ObjectID(commentId),
        "comments.replys._id": ObjectID(replayId)
      },
      {
        $inc: { "comments.$[i].replys.$[j].likes": 1 },
        $push: { "comments.$[i].replys.$[j].likedBy": embededUser }
      },
      {
        arrayFilters: [
          { "i._id": ObjectID(commentId) },
          { "j._id": ObjectID(replayId) }
        ],
        upsert: true,
        new: true
      }
    );

    return "Reply LIKED";
  } else {
    await CommentBox.findOneAndUpdate(
      {
        _id: commentBoxId,
        "comments._id": ObjectID(commentId),
        "comments.replys._id": ObjectID(replayId)
      },
      {
        $inc: { "comments.$[i].replys.$[j].likes": -1 },
        $pull: { "comments.$[i].replys.$[j].likedBy": embededUser }
      },
      {
        arrayFilters: [
          { "i._id": ObjectID(commentId) },
          { "j._id": ObjectID(replayId) }
        ],
        upsert: true,
        new: true
      }
    );
    return "Reply UNLIKED";
  }
}

module.exports.handelReplyLike = handelReplyLike;
