const express = require("express");
const router = express.Router();
const { Member } = require("../model/Member");

router.post("/", async (req, res) => {
  const { clientId: id, name, phoneNumber: pn, ostan } = req.body;
  const same = await Member.find()
    .or([{ clientId: id }, { phoneNumber: pn }])
    .countDocuments();

  console.log(same);
  if (same === 0) {
    let member = new Member({
      name,
      clientId: id,
      phoneNumber: pn,
      ostan
    });

    member = await member.save();
    res.status(200).send(member.clientId);

    //console.log(result);
  } else {
    res.send("bad requst repetation!!!!!!!!!!");
  }
});

module.exports = router;
