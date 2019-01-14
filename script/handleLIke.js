const mongoose = require("mongoose");

async function handelLikeToggle(collection, postId, embededUser) {
  const { likedBy } = await collection
    .findOne({ _id: postId })
    .select("likedBy");

  let found = likedBy.filter(o => {
    if (o._id === embededUser._id) return o;
  });
  //-------------LIKED---------
  if (found.length == 0) {
    result = await collection.updateOne(
      { _id: postId },
      { $inc: { likes: 1 }, $push: { likedBy: embededUser } }
    );
    return "LIKED";

    //-----------UNLIKED-------
  } else {
    result = await collection.updateOne(
      { _id: postId },
      { $inc: { likes: -1 }, $pull: { likedBy: embededUser } }
    );
    return "UNLIKED";
  }
}

module.exports.handelLikeToggle = handelLikeToggle;
