const express = require("express");
const router = express.Router();
const { Member } = require("../model/Member");
const { Producte, createNewPoroduct } = require("../model/p_model");

// if a user rediret to timlene

// else redirext to intro page
router.get("/", async (req, res) => {
  const members = await Member.find();
  res.send("resiiiiiiiiiiiiidim inja");
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await Member.find({ clientId: id });
  if (!result) res.status(404).send("the member with this id was not found");
  res.send(result);
});

module.exports = router;
