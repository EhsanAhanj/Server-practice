const mongoose = require("mongoose");
const Joi = require("joi");

const pointSchema = new mongoose.Schema({
  type: { type: String, default: "Point" },
  coordinates: {
    type: Array,
    items: Number,
    default: [6646, 333],
    required: true
  },
  _id: false
});

const Point = mongoose.model("Point", pointSchema);

function ValidatePoint(point) {
  const schema = {
    type: Joi.string(),
    coordinates: Joi.array()
      .items(Joi.number())
      .length(2)
      .required()
  };
  return Joi.validate(point, schema);
}

exports.Point = Point;
exports.pointSchema = pointSchema;
exports.ValidatePoint = ValidatePoint;
