// t with any filter
const express = require("express");
const router = express.Router();
const Fawn = require("fawn");
const ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");

const auth = require("../middleware/auth");
const { CommentBox } = require("../model/CommentBox");

const { Member } = require("../model/Member");
const { Tour, validate } = require("../model/tour-model");

//----------------------GET ALL PRODUCT POSTS -------------------------
router.get("/", async (req, res) => {
  // add filters with validate them
  const tours = await Tour.find().sort({ _id: -1 });
  res.status(200).send(tours);
});

//--------------------GET SPECIAL ADV BY ID----------------------------
router.get("/:_id", async (req, res) => {
  if (!ObjectID.isValid(req.params._id))
    return res.status(400).send(`id moshkel dare `);
  const tour = await Tour.findById({ _id: req.params._id });
  if (!tour) return res.status(404).send(`ba in id tour nadarim`);

  //------ append commentBox------
  const commentBox = await CommentBox.findById({ _id: tour.commentBoxId });
  if (!commentBox) return res.status(404).send("commment box peyda nashod");

  return res.status(200).send(`innnnnno mikhay ${(tour, commentBox)}`);
});

//------------------ CREAATE tour POST -----------------------------------------

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  } else {
    const tour = new Tour({
      owner: req.user,
      caption: req.body.caption,
      tags: req.body.tags,
      category: req.body.category
    });

    const commentBox = new CommentBox({
      _id: tour.commentBoxId,
      downOf: tour._id,
      onModel: "Tour"
    });

    const task = new Fawn.Task();

    task.save("tours", tour);

    task.save("commentboxes", commentBox);

    task.update(
      "members",
      { _id: req.user._id },
      {
        $push: { tourMaded: tour._id },
        $inc: { tourMadedNumber: 1 }
      }
    );

    task.options({ new: true });
    try {
      task.run({ useMongoose: true });

      res.status(200).send("DONE");
    } catch (err) {
      res.status(500).send("SOMTHING IN SERVER WENT WRONG!!!!!!!!!");
    }
  }
});

module.exports = router;
