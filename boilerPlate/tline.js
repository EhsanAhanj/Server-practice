const mongoose = require("mongoose");

const timeLineSchema = new Schema({
  // owner: {
  //   userName: {}
  // }
  // body: { type: String, required: true },
  on: {
    type: Schema.Types.ObjectId,
    required: true,
    // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
    // will look at the `onModel` property to find the right model.
    refPath: "onModel"
  },
  onModel: {
    type: String,
    required: true,
    enum: ["Producte", "Member"]
  }
});

const Product = mongoose.model("Product", new Schema({ name: String }));
const BlogPost = mongoose.model("BlogPost", new Schema({ title: String }));
const Comment = mongoose.model("Comment", commentSchema);

const book = await Product.create({ name: "The Count of Monte Cristo" });
const post = await BlogPost.create({ title: "Top 10 French Novels" });

const commentOnBook = await Comment.create({
  body: "Great read",
  on: book._id,
  onModel: "Product"
});

const commentOnPost = await Comment.create({
  body: "Very informative",
  on: post._id,
  onModel: "BlogPost"
});

// The below `populate()` works even though one comment references the
// 'Product' collection and the other references the 'BlogPost' collection.
const comments = await Comment.find()
  .populate("on")
  .sort({ body: 1 });
comments[0].on.name; // "The Count of Monte Cristo"
comments[1].on.title; // "Top 10 French Novels"
const result = await CommentBox.findOneAndUpdate(
  {
    _id: product_post.commentBoxId,
    "comments._id": ObjectID(yechi)
  },
  { $inc: { "comments.$.likes": 1 } },
  {
    //arrayFilters: [{ ele: { _id: yechi } }],
    upsert: true,
    new: true
  }
);
// } else if (
//   req.body.commentWork._id &&
//   req.body.commentWork.replyWork._id &&
//   req.body.commentWork.replyWork.like
// ) {
//   if (
//     !ObjectID.isValid(req.body.commentWork._id) ||
//     !ObjectID.isValid(req.body.commentWork.replyWork._id)
//   )
//     return res.status(400).send(`idha comment moshkel dare `);

//   const commentFounded = commentBoxComponent.comments.filter(o => {
//     if (o._id == req.body.commentWork._id) return o;
//   });
//   if (commentFounded.length == 0)
//     return res.send("comment nist ya pak shode");
//   const replyFound = commentFounded[0].replys.filter(o => {
//     if (o._id == req.body.commentWork.replyWork._id) return o;
//   });
//   if (replyFound.length == 0) return res.status(400).send("Reply pak shode");

//   const isLiked = replyFound[0].likedBy.filter(o => {
//     if (o._id == embededUser._id) return o;
//   });

//   if (isLiked.length == 0) {
//     const found1 = await CommentBox.findByIdAndUpdate(
//       {
//         _id: product_post.commentBoxId,
//         "comments._id": ObjectID(req.body.commentWork._id),
//         "comments.replys._id": ObjectID(req.body.commentWork.replyWork._id)
//       },
//       {
//         $inc: { "comments.$[].replys.0.likes": 1 }
//         //  $push: { "comments.$[].replys.$.likedBy": embededUser }
//       },
//       {
//         upsert: true,
//         new: true
//       }
//     );
//     console.log("repoooooooooly", found1);

//     res.status(200).send("Reply LIKED");
//   } else {
//     await CommentBox.findOneAndUpdate(
//       {
//         _id: product_post.commentBoxId,
//         "comments._id": ObjectID(req.body.commentWork._id),
//         "comments.replys._id": ObjectID(req.body.commentWork.replyWork._id)
//       },
//       {
//         $inc: { "comments.$[].replys.$.likes": -1 },
//         $pull: { "comments.$[].replys.$.likedBy": embededUser }
//       },
//       {
//         upsert: true,
//         new: true
//       }
//     );
//     res.status(200).send("Reply UNLIKED");
//   }
