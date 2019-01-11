const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { Member, validate, isDublicted } = require("../model/Member");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    let itDublicated = await isDublicted(req.body);

    const {
      userName,
      bname,
      phoneNumber,
      ostan,
      password,
      location
    } = req.body;
    if (!itDublicated) {
      let member = new Member({
        bname,
        userName,
        phoneNumber,
        ostan,
        password,
        location
      });
      const salt = await bcrypt.genSalt(10);
      member.password = await bcrypt.hash(password, salt);
      member = await member.save();
      const token = member.generateAuthToken();
      res
        .header("x-bouj-token", token)
        .status(200)
        .send(_.pick(member, ["userName", "bname", "_id", "location"]));
    } else {
      res.status(400).send("this username or phonenumber rejistred beror.");
    }
  }
});

module.exports = router;
