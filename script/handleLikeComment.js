const { CommentBox } = require("../model/CommentBox");
const ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");

async function handelLikeComment(commentBoxId, commentId, embededUser) {
  const commentFounded = await CommentBox.aggregate([
    { $unwind: "$comments" },
    {
      $match: {
        "comments._id": ObjectID(commentId)
      }
    }
  ]);
  const likedBy = commentFounded[0].comments.likedBy;

  if (!likedBy) return "comment nist ya pak shode";

  const isLiked = likedBy.filter(o => {
    if (o._id == embededUser._id) return o;
  });
  if (isLiked.length == 0) {
    await CommentBox.updateOne(
      {
        _id: commentBoxId,
        "comments._id": ObjectID(commentId)
      },
      {
        $inc: { "comments.$.likes": 1 },
        $push: { "comments.$.likedBy": embededUser }
      },
      {
        upsert: true,
        new: true
      }
    );
    return "COMMENT LIKED ";
  } else {
    await CommentBox.updateOne(
      {
        _id: commentBoxId,
        "comments._id": ObjectID(commentId)
      },
      {
        $inc: { "comments.$.likes": -1 },
        $pull: { "comments.$.likedBy": embededUser }
      },
      {
        upsert: true,
        new: true
      }
    );
    return "COOOMENT UNLIKED ";
  }
}
module.exports.handelLikeComment = handelLikeComment;
