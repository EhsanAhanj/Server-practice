const mongoose = require("mongoose");
const { embedUserName } = require("../model/Member");
const Joi = require("joi");
const pointSchema = require("../model/pointSchema");
const { CommentBox } = require("../model/CommentBox");

const Producte = mongoose.model(
  "Producte",
  new mongoose.Schema({
    owner: { type: Object, required: true },
    commentBoxId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommentBox",
      auto: true,
      required: true
    },
    likes: { type: Number },
    likedBy: { type: Array, items: Object },

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
function validateProducte(producte) {
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

  return Joi.validate(producte, schema);
}

exports.validate = validateProducte;
exports.Producte = Producte;
