const mongoose = require("mongoose");
const Joi = require("joi");

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const polygonSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Polygon"],
    required: true
  },
  coordinates: {
    type: [[[Number]]], // Array of arrays of arrays of numbers
    required: true
  }
});
const lineStringSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["LineString"],
    required: true
  },
  coordinates: {
    type: [[Number]],
    required: true
  }
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

exports.lineStringSchema = lineStringSchema;
exports.polygonSchema = polygonSchema;
exports.Point = Point;
exports.pointSchema = pointSchema;
exports.ValidatePoint = ValidatePoint;
