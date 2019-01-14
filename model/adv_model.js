const mongoose = require("mongoose");
const {
  polygonSchema,
  pointSchema,
  lineStringSchema
} = require("./pointSchema");
const Joi = require("joi");

const Adventure = mongoose.model(
  "Adventure",
  new mongoose.Schema({
    owner: { type: Object, required: true },
    commentBoxId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommentBox",
      auto: true,
      required: true
    },
    likers: {
      type: Array,
      items: Object
    },
    caption: { type: String, required: true },
    cover: { type: polygonSchema },
    likes: { type: Number, default: 0 },
    locationCenter: { type: pointSchema },
    geoWay: { type: lineStringSchema },
    date: { type: Date, default: Date.now },
    caption: { type: String, required: true },
    images: {
      type: Array,
      items: Object,
      default: [
        "https://picsum.photos/200/300",
        "https://picsum.photos/200/300"
      ]
    },
    category: { type: Array, items: String, required: true },
    tags: { type: Array, items: String, required: true }
  })
);
function validateAdventure(adventure) {
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
      .required()
  };

  return Joi.validate(adventure, schema);
}

exports.validate = validateAdventure;

exports.Adventure = Adventure;
