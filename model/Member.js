const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const { Producte } = require("./p_model");

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 4, maxlength: 50 },
  clientId: { type: String, required: true },
  phoneNumber: { type: String, required: true, minlength: 7, maxlength: 10 },
  password: { type: String, minlength: 5, maxlength: 1023 },
  publishacunt: { type: Boolean, default: true },
  ostan: { type: String, required: true },
  city: String,
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"] // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number]
    }
  },

  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  avatarImage: {
    avatarSmall: { type: String, default: "https://picsum.photos/200" },
    avatarLarge: String
  },
  memberRole: String,
  tripsPassed: [],
  advanctureMaded: [String],
  producte_posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Producte" }],
  warnings: [String],
  ratingRate: Number,
  lastLogin: Date,
  linksOut: [String],
  canRateFor: [String]
});

memberSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, clientId: this.clientId },
    config.get("jwtPrivateKey")
  );
  return token;
};
const Member = mongoose.model("Member", memberSchema);

function validateNewMember(newMember) {
  const schema = {
    clientId: Joi.string().required(),
    name: Joi.string()
      .min(4)
      .max(50)
      .required(),
    phoneNumber: Joi.string()
      .min(7)
      .max(10)
      .required(),
    ostan: Joi.string().required(),
    password: Joi.string()
      .min(5)
      .max(50)
      .required()
  };
  return Joi.validate(newMember, schema);
}
async function isDublicted({ clientId, phoneNumber }) {
  try {
    const result = await Member.find()
      .or([{ clientId }, { phoneNumber }])
      .countDocuments();
    return result ? true : false;
  } catch (err) {
    return console.log(err);
  }
}

exports.isDublicted = isDublicted;
exports.Member = Member;
exports.validate = validateNewMember;
