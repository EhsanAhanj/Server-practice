const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const { Product } = require("./p_model");
const { pointSchema, ValidatePoint } = require("./pointSchema");

const memberSchema = new mongoose.Schema({
  bname: { type: String, required: true, minlength: 4, maxlength: 50 },
  userName: { type: String, required: true },
  phoneNumber: { type: String, required: true, minlength: 7, maxlength: 10 },
  password: { type: String, minlength: 5, maxlength: 1023 },
  publishacunt: { type: Boolean, default: true },
  ostan: { type: String, required: true },
  city: String,
  location: { type: pointSchema, required: true },
  followerNumber: { type: Number, min: 1, default: 1 },
  followingNumber: Number,
  tripsPassedNumber: Number,
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  avatarSmall: { type: String, default: "https://picsum.photos/200" },
  avatarLarge: String,
  memberRole: String,
  tripsPassed: [],
  aventureMaded: [{ type: mongoose.Schema.Types.ObjectId, ref: "Adventure" }],
  aventureMadedNumber: Number,
  tourMaded: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tour" }],
  tourMadedNumber: Number,
  prodPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  prodPostNumber: Number,
  warnings: [String],
  ratingRate: Number,
  lastLogin: Date,
  linksOut: [String],
  canRateFor: [String]
});

memberSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      avatarSm: this.avatarSmall,
      followerNumber: this.followerNumber,
      followingNumber: this.followerNumber,
      userName: this.userName,
      ostan: this.ostan,
      memberRole: this.memberRole
    },
    config.get("jwtPrivateKey")
  );
  return token;
};
const Member = mongoose.model("Member", memberSchema);

function validateNewMember(newMember) {
  const isValidpoit = ValidatePoint(newMember.location);

  if (isValidpoit.error) return isValidpoit;
  else {
    const schema = {
      userName: Joi.string().required(),
      bname: Joi.string()
        .min(4)
        .max(50)
        .required(),
      phoneNumber: Joi.string()
        .min(7)
        .max(13)
        .required(),
      ostan: Joi.string().required(),
      password: Joi.string()
        .min(5)
        .max(50)
        .required(),
      location: Joi.any()
    };
    return Joi.validate(newMember, schema);
  }
}
async function isDublicted({ userName, phoneNumber }) {
  try {
    const result = await Member.find()
      .or([{ userName }, { phoneNumber }])
      .countDocuments();
    return result ? true : false;
  } catch (err) {
    return console.log(err);
  }
}
exports.isDublicted = isDublicted;
exports.Member = Member;
exports.validate = validateNewMember;
