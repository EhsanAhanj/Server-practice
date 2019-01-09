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
