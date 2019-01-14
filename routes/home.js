const express = require("express");
const router = express.Router();
const { Member } = require("../model/Member");
const { Producte, createNewPoroduct } = require("../model/prod-model");

// if a user rediret to timlene

// else redirext to intro page
router.get("/", async (req, res) => {
  const members = await Member.find()
    .sort({ _id: -1 })
    .select("embedUserName")
    .populate("embedUserName");
  res.status(200).send(members);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await Member.findById({ _id: id });
  if (!result) res.status(404).send("the member with this id was not found");
  res.send(result);
});

module.exports = router;
