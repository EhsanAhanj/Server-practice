const express = require("express");
const router = express.Router();
const { Member, validate, isDublicted } = require("../model/Member");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    const { clientId, name, phoneNumber, ostan } = req.body;
    const hasDublicated = isDublicted(req.body);

    if (!hasDublicated) {
      let member = new Member({
        name,
        clientId,
        phoneNumber,
        ostan
      });

      member = await member.save();
      res.status(200).send(member.clientId);
    } else {
      res.send("this username or phonenumber rejistred beror.");
    }
  }
});

module.exports = router;
