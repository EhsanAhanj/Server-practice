const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const config = require("config");
const bcrypt = require("bcrypt");
const { Member } = require("../model/Member");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const { phoneNumberOrUserName, password } = req.body;
    let member = "";
    try {
      member = await Member.findOne({
        $or: [
          { phoneNumber: phoneNumberOrUserName },
          { userName: phoneNumberOrUserName }
        ]
      });
    } catch (err) {
      console.log(err.message);
    }
    if (!member)
      return res.status(400).send("karbari ba in moshakhasat nadarim");
    else {
      const validPassword = await bcrypt.compare(password, member.password);
      if (!validPassword) return res.status(400).send("password eshtebahe");
      else {
        // send sms and compare
        const token = member.generateAuthToken();
        res
          .header("x-bouj-token", token)
          .status(200)
          .send("DONE");
      }
    }
  }
});

function validate(newMember) {
  const schema = {
    phoneNumberOrClientId: Joi.string()
      .min(4)
      .max(50)
      .required(),
    password: Joi.string()
      .min(5)
      .max(50)
      .required()
  };
  return Joi.validate(newMember, schema);
}
module.exports = router;
