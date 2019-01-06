const express = require("express");
const router = express.Router();
const Fawn = require("fawn");
const ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");

const auth = require("../middleware/auth");

const { Producte, validate } = require("../model/p_model");
const { Member } = require("../model/Member");
const Joi = require("joi");

Fawn.init(mongoose);

//----------------------GET ALL PRODUCTE POSTS -------------------------
router.get("/", async (req, res) => {
  // add filters with validate them
  const producte_posts = await Producte.find().sort({ _id: -1 });
  res.status(200).send(producte_posts);
});
//------------------------GET ONE PRODUCTE POST BY ID-------------------------
router.get("/:_id", async (req, res) => {
  if (!ObjectID.isValid(req.params._id))
    return res.status(400).send(`id moshkel dare `);
  const producte_post = await Producte.findById({ _id: req.params._id });
  if (!producte_post) return res.status(404).send(`ba in id post nadarim`);
  res.status(200).send(`innnnnno mikhay ${producte_post}`);
});

//-----------------------LIKE PRODUCTE BY FAWN--------------------------------
router.put("/:_id", auth, async (req, res) => {
  const embededUser = req.user;
  conssol.log("embeded user", embededUser);
  if (!ObjectID.isValid(req.params._id))
    return res.status(400).send(`id moshkel dare `);
});

//------------------ CREAATE PRODUCE POST -----------------------------------------
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  console.log("in errrrrrrrrrrrrr", error);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  } else {
    const { userId, caption, category, tags } = req.body;
    const member = await Member.findById({ _id: userId });

    let producte_post = new Producte({
      owner: member.embedUserName(),
      caption,
      tags,
      category
    });
    await Member.updateOne(
      { _id: member._id },
      {
        $push: { producte_posts: producte_post._id }
      }
    );
    producte_post = await producte_post.save();
    if (producte_post) {
      res.status(200).send(producte_post);
    } else res.send("mahsool post nasho");
  }
});

module.exports = router;
