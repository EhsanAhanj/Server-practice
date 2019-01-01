const mongoose = require("mongoose");
const { Member } = require("../model/Member");
const Joi = require("joi");

const Producte = mongoose.model(
  "Producte",
  new mongoose.Schema({
    owner_clientId: { type: String, required: true },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true
    },
    date: { type: Date, default: Date.now },
    desc: { type: String, required: true },
    images: { type: String, default: "https://picsum.photos/200/300" },
    category: [String],
    tags: [String]
  })
);
function validateProducte(producte) {
  const schema = {
    desc: Joi.string()
      .min(5)
      .max(50)
      .required(),
    tags: Joi.array()
      .items(Joi.string().required())
      .required(),
    category: Joi.array()
      .items(Joi.string().required())
      .required(),
    clientId: Joi.string()
  };

  return Joi.validate(producte, schema);
}
exports.validate = validateProducte;
exports.Producte = Producte;
