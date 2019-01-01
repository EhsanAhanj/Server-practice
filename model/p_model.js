const mongoose = require("mongoose");
const { Member } = require("../model/Member");

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

exports.Producte = Producte;
