const mongoose = require("mongoose");
const { embedUserName } = require("../model/Member");
const Joi = require("joi");
const pointSchema = require("../model/pointSchema");
const { CommentBox } = require("../model/CommentBox");

const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    owner: { type: Object, required: true },
    commentBoxId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommentBox",
      auto: true,
      required: true
    },
    likes: { type: Number, default: 0 },
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Likers",
      auto: true,
      required: true
    },

    location: { type: pointSchema },
    date: { type: Date, default: Date.now },
    caption: { type: String, required: true },
    images: {
      type: Array,
      items: String,
      default: [
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300"
      ]
    },
    category: { type: Array, items: String, required: true },
    tags: { type: Array, items: String, required: true }
  })
);
function validateProduct(product) {
  const schema = {
    caption: Joi.string()
      .min(5)
      .max(500)
      .required(),
    tags: Joi.array()
      .items(Joi.string())
      .required(),
    category: Joi.array()
      .items(Joi.string())
      .required(),
    userId: Joi.objectId().required()
  };

  return Joi.validate(product, schema);
}

exports.validate = validateProduct;
exports.Product = Product;
