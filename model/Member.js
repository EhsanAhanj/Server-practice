const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  clientId: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: String,
  ostan: { type: String, required: true },
  city: String,
  locatinon: {
    mapAddress: {
      lattatud: Number,
      lantitiud: Number
    }
  },
  followers: [{ Types: mongoose.Schema.Types.ObjectId }],
  followings: [mongoose.Schema.Types.ObjectId],
  avatarImage: {
    avatarLarge: String,
    avatarSmall: String
  },
  memberRole: String,
  tripsPassed: [String],
  advanctureMaded: [String],
  post: [String],
  warnings: [String],
  ratingRate: Number,
  lastLogin: Date,
  publishacunt: Boolean,
  linksOut: [String],
  canRateFor: [String]
});

const Member = mongoose.model("Member", memberSchema);

async function createNewMember(clientId, name, email, ostan) {
  const member = new Member({
    name,
    clientId,
    phoneNumber,
    ostan
  });

  const result = await member.save();
  if (result) return member;
}
module.exports.Member = Member;
module.exports.createNewMember = createNewMember;
