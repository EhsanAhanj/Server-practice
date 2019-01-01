const mongoose = require("mongoose");
const { Producte } = require("./p_model");

const Member = mongoose.model(
  "Member",
  new mongoose.Schema({
    name: { type: String, required: true },
    clientId: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: String,
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
  })
);

exports.Member = Member;
