const mongoose = require("mongoose");
const {
  polygonSchema,
  pointSchema,
  lineStringSchema
} = require("./pointSchema");
const Joi = require("joi");

const Tour = mongoose.model(
  "Tour",
  new mongoose.Schema({
    owner: { type: Object, required: true },
    commentBoxId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommentBox",
      auto: true,
      required: true
    },
    likers: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Likers",
      auto: true,
      required: true
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
function validateTour(tour) {
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

  return Joi.validate(tour, schema);
}

exports.validate = validateTour;

exports.Tour = Tour;
