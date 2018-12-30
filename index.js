const helemt = require("helmet");
const config = require("config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { createNewMember, Member } = require("./model/Member");

app.use(express.json());
app.use(helemt());

mongoose
  .connect(
    "mongodb://localhost/bouj",
    { useNewUrlParser: true }
  )
  .then(() => console.log("conected to mongodb"))
  .catch(err => console.err("error", err));

app.get("/", async (req, res) => {
  const members = await Member.find();
  res.send(members);
});
const PORT = process.env.PORT || 3000;

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await Member.find({ clientId: id });
  if (!result) res.status(404).send("the member with this id was not found");
  res.send(result);
});

app.post("/user", (req, res) => {
  const { name, clientId, phoneNumber, ostan } = req.body;

  res.send(createNewMember(clientId, name, phoneNumber, ostan));
});

app.listen(PORT, () => {
  console.log(`App lisening on port ${PORT}`);
});
